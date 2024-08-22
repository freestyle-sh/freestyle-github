import fs, { InMemoryStore, StoreFS } from "@zenfs/core";
import type { APIRoute } from "astro";
import { useCloud } from "freestyle-sh";
import { RepoIndex, Repository } from "../../../../cloudstate/simple-repo";

export async function GET({ params, request }: Parameters<APIRoute>[0]) {
    console.log("getting file");
    const id = await useCloud<typeof RepoIndex>("repo-index").getOrCreateRepo({
        owner: "JacobZwang",
        name: params.repo!,
    });

    const data = await useCloud<typeof Repository>(id).getData();

    const map = new Map<bigint, Uint8Array>(
        JSON.parse(await data.data).map((
            [key, value]: [string, any],
        ) => [BigInt(key), new Uint8Array(value)]),
    );

    const store = new InMemoryStore();

    map.forEach((value, key) => {
        store.set(key, value);
    });

    fs.mount(`/${params.repo}`, new StoreFS(store));

    let file;

    try {
        file = fs.readFileSync(`${params.repo}/.git/` + params.path);
    } catch (e) {
        return new Response(null, { status: 404 });
    }

    fs.umount(`/${params.repo}`);

    return new Response(file);
}
