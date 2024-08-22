import fs, { InMemoryStore, StoreFS } from "@zenfs/core";
import type { APIRoute } from "astro";
import { useCloud } from "freestyle-sh";
import { getOrMountRepo, RepoIndex, Repository } from "../../../../cloudstate/simple-repo";

export async function GET({ params, request }: Parameters<APIRoute>[0]) {
    console.log("getting file");
    const { id } = await useCloud<typeof RepoIndex>("repo-index").getRepo({
        owner: "JacobZwang",
        name: params.repo!,
    });

    const data = await useCloud<typeof Repository>(id).getData();
    getOrMountRepo(id, new Blob([data.data]));

    let file;

    try {
        file = fs.readFileSync(`${id}/.git/` + params.path);
    } catch (e) {
        return new Response(null, { status: 404 });
    }

    return new Response(file);
}
