import fs, { InMemoryStore, StoreFS } from "@zenfs/core";
import type { APIRoute } from "astro";
import { useCloud } from "freestyle-sh";
import zlib from "node:zlib";
import {
  getOrMountRepo,
  inMemoryStoreToBlob,
  RepoIndex,
  Repository,
} from "../../../../../cloudstate/simple-repo";
import { dirname } from "@zenfs/core/emulation/path.js";

export async function GET({ params, request }: Parameters<APIRoute>[0]) {
  console.log("GET", params);

  const repo = await useCloud<typeof RepoIndex>("repo-index").getRepo({
    owner: params.user!,
    name: params.repo!,
  });

  const data = await useCloud<typeof Repository>(repo.id).getData();
  await getOrMountRepo(repo.id, new Blob([data.data]));

  let file: Uint8Array | null = null;

  try {
    try {
      for (const file of fs.readdirSync(`/${repo.id}/.git/objects/be`)) {
        console.log("FILE", `/${repo.id}/.git/${file}`, file);
      }
    } catch (e) {}
    // console.log(
    //   "REPO FILES",
    //   fs.readdirSync(`/${repo.id}/.git/${params.path}`),
    //   params.path
    // );
    file = fs.readFileSync(`/${repo.id}/.git/${params.path}`);
    console.log(`File @ ${params.path} is`, file);
  } catch (e) {
    console.log("failed to read file", `${repo.id}/.git/${params.path}`, e);

    return new Response(null, { status: 404 });
  }

  try {
    fs.umount(`/${repo.id}`);
  } catch (e) {
    console.warn("Failed to unmount", e);
  }
  return new Response(file);
}

// Tells Git that the server supports locking
export async function PROPFIND({
  params: _params,
  request: _req,
}: Parameters<APIRoute>[0]) {
  return new Response(
    `<?xml version="1.0" encoding="utf-8" ?>
<D:multistatus xmlns:D="DAV:">
  <D:response>
    <D:propstat>
      <D:prop>
        <D:supportedlock>
            <D:lockentry>
                <D:lockscope><D:exclusive/></D:lockscope>
                <D:locktype><D:write/></D:locktype>
            </D:lockentry>
        </D:supportedlock>
      </D:prop>
    </D:propstat>
  </D:response>
</D:multistatus>`,
  );
}

export async function MKCOL({ params, request }: Parameters<APIRoute>[0]) {
  // TODO: Figure out what this is supposed to do
  return new Response(
    `<?xml version="1.0" encoding="utf-8" ?>
    <D:multistatus xmlns:D="DAV:">
      <D:response>
        <D:propstat>
          <D:prop>
            <D:supportedlock>
              <D:lockentry>
                <D:lockscope><D:exclusive/></D:lockscope>
                <D:locktype><D:write/></D:locktype>
              </D:lockentry>
            </D:supportedlock>
          </D:prop>
        </D:propstat>
      </D:response>
    </D:multistatus>`,
  );
}

export async function LOCK({ params, request }: Parameters<APIRoute>[0]) {
  // TODO: Implement locking
  return new Response(
    `<?xml version="1.0" encoding="utf-8" ?>
      <D:prop>
        <D:lockdiscovery>
          <D:activelock>
              <D:lockscope><D:exclusive/></D:lockscope>
              <D:locktype><D:write/></D:locktype>
              <D:depth>infinity</D:depth>
            <D:owner>
              <D:href>http://example.com/~username/</D:href>
            </D:owner>
            <D:timeout>Second-604800</D:timeout>
            <D:locktoken>
              <D:href>opaquelocktoken:1234-5678-90ab-cdef</D:href>
            </D:locktoken>
            <D:lockroot>
              <D:href>http://localhost:8910/git/repos/test</D:href>
            </D:lockroot>
          </D:activelock>
        </D:lockdiscovery>
      </D:prop>
`,
  );
}

export async function PUT({ params, request }: Parameters<APIRoute>[0]) {
  // Put the contents of the body into params.path
  console.log("PUT", params);

  if (!params.repo || !params.user || !params.path) {
    return new Response(null, { status: 404 });
  }

  const { id } = await useCloud<typeof RepoIndex>("repo-index").getRepo({
    owner: params.user,
    name: params.repo,
  });

  const repo = useCloud<typeof Repository>(id);
  const data = await repo.getData();

  const store = await getOrMountRepo(id, new Blob([data.data]));

  const file = `${id}/.git/${params.path}`;
  const parent = dirname(file);

  // try {
  fs.mkdirSync(parent, { recursive: true });

  fs.writeFileSync(file, await request.text());

  // } catch (e) {
  //   console.error(e, "in PUT");
  //   return new Response(null, { status: 404 });
  // }

  // store.sync();

  await repo.setData({
    data: JSON.stringify(
      Array.from(store.entries()).map(([key, value]) => [
        key.toString(),
        Array.from(value),
      ]),
    ),
  });

  // try {
  //   fs.umount(`/${id}`);
  // } catch (e) {
  //   console.warn("Failed to unmount", e);
  // }

  return new Response();
}

export async function HEAD({ params, request }: Parameters<APIRoute>[0]) {
  // console.log("HEAD", params);
  return new Response();
}

export async function MOVE({ params, request }: Parameters<APIRoute>[0]) {
  // TODO: Figure out what this is supposed to do
  console.log("MOVE", params, "text", request);

  if (!params.repo || !params.path) {
    return new Response(null, { status: 404 });
  }

  const { id, name } = await useCloud<typeof RepoIndex>("repo-index").getRepo({
    owner: params.user,
    name: params.repo,
  });

  const repo = useCloud<typeof Repository>(id);
  const data = await repo.getData();

  const store = await getOrMountRepo(id, new Blob([data.data]));

  try {
    // const destUrl = request.headers.get("destination");
    // if (!destUrl) {
    //   console.error("No destination in MOVE");
    //   return new Response(null, { status: 404 });
    // }

    // const dest = new URL(destUrl).pathname.replace(`/git/repos/${name}`, "");
    //
    // console.log("MOVE", dest);
    //
    // // const file = `/${id}/.git/${params.path}`;
    // const file = `/${id}/.git/${dest}`;
    //
    // const data = fs.readFileSync(file);

    // console.log("1");
    // fs.mkdirSync(dirname(`/${id}/.git/objects/${dest}`), { recursive: true });
    // console.log("2");
    const data = await request.text();

    console.log("1");
    fs.mkdirSync(dirname(`/${id}/.git/${params.path}`), { recursive: true });
    console.log("2");

    fs.writeFileSync(`/${id}/.git/${params.path}`, data);
    console.log("3");
  } catch (e) {
    console.error("Failed to MOVE", e);
    return new Response(null, { status: 404 });
  }

  store.sync();

  // repo.setData = blob;
  repo.setData({
    data: JSON.stringify(
      Array.from(store.entries()).map(([key, value]) => [
        key.toString(),
        Array.from(value),
      ]),
    ),
  });

  // try {
  //   fs.umount(`/${id}`);
  // } catch (e) {
  //   console.warn("Failed to unmount", e);
  // }

  return new Response();
}

export async function UNLOCK({ params, request }: Parameters<APIRoute>[0]) {
  // TODO: Implement locking
  // console.log("UNLOCK", params, request);
  return new Response();
}
