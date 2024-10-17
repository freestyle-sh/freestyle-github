import fs, { InMemoryStore, StoreFS } from "@zenfs/core";
import type { APIRoute } from "astro";
import { useCloud } from "freestyle-sh";
import {
  getOrMountRepo,
  RepoIndex,
  Repository,
} from "../../../../cloudstate/simple-repo";
import { dirname } from "@zenfs/core/emulation/path.js";

export async function GET({ params, request }: Parameters<APIRoute>[0]) {
  console.log("getting file");

  const repo = await useCloud<typeof RepoIndex>("repo-index").getRepo({
    owner: "JacobZwang",
    name: params.repo!,
  });

  const data = await useCloud<typeof Repository>(repo.id).getData();
  getOrMountRepo(repo.id, new Blob([data.data]));

  let file: Uint8Array | null = null;

  try {
    file = fs.readFileSync(`${params.repo}/.git/${params.path}`);
  } catch (e) {
    // try {
    //     fs.umount(`/${params.repo}`);
    // } catch (e) {}
    return new Response(null, { status: 404 });
  }

  //   try {
  //       fs.umount(`/${params.repo}`);
  //     } catch (e) {}

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

  const id = await useCloud<typeof RepoIndex>("repo-index").getRepo({
    owner: "JacobZwang",
    name: params.repo!,
  });

  const repo = useCloud<typeof Repository>(id.id);
  const data = await repo.getData();

  getOrMountRepo(id.id, new Blob([data.data]));

  if (fs.mounts.get(`/${params.repo}`)) {
    fs.umount(`/${params.repo}`);
  }
  fs.mount(`/${params.repo}`, new StoreFS(store));

  const file = `${params.repo}/.git/${params.path}`;
  const parent = dirname(file);

  try {
    fs.mkdirSync(parent, { recursive: true });

    fs.writeFileSync(file, await request.text());
  } catch (e) {
    return new Response(null, { status: 404 });
  }

  fs.umount(`/${params.repo}`);

  return new Response();
}

export async function HEAD({ params, request }: Parameters<APIRoute>[0]) {
  // console.log("HEAD", params);
  return new Response();
}

export async function MOVE({ params, request }: Parameters<APIRoute>[0]) {
  // TODO: Figure out what this is supposed to do
  // console.log("MOVE", params, "text", await request.blob());
  return new Response();
}

export async function UNLOCK({ params, request }: Parameters<APIRoute>[0]) {
  // TODO: Implement locking
  // console.log("UNLOCK", params, request);
  return new Response();
}
