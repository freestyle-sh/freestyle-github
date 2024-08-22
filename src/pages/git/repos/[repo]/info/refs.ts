// import {InMemoryStore, StoreFS} from '@zenfs/core';
import { configure, InMemory, InMemoryStore, StoreFS } from '@zenfs/core';
import git from "isomorphic-git";
import {fs} from "@zenfs/core"
import { useCloud } from 'freestyle-sh';
import { Repository, SimpleRepo, type RepoIndex } from '../../../../../cloudstate/simple-repo';
import { CloudStore } from '../../../../../cloudstate/filesystem';
import type { APIRoute } from 'astro';

// import fs from "node:fs";

// await configure({
//     mounts: {
//         "/": InMemory
//     }
// });

export async function GET({ params, request }) {
    const { id } = await useCloud<typeof RepoIndex>("repo-index").getRepo({
        owner: "JacobZwang",
        name: params.repo,
    }).catch(() => ({
        id: undefined,
    }));

    if (!id) {
        return new Response("Repo does not exist", {
            status: 404,
        });
    }
    

    console.log("got repo id", id);

    const map = new InMemoryStore();
    const store = new StoreFS(map);
    store.checkRootSync();
    fs.mount(`/${params.repo}`, store);

    const json = JSON.stringify(Array.from(map.entries()).map(([key, value]) => [key.toString(), Array.from(value)]));

    // console.log(json);

    await useCloud<typeof Repository>(id).setData({
        data: json,
    });

    console.log("set data");

    fs.readdirSync(`${id}/.git/objects/`).forEach(file => {
        fs.readdirSync(`${id}/.git/objects/${file}`).forEach(file2 => {
            console.log(file2);
        });
    });

    const heads = fs.readdirSync(`${id}/.git/refs/heads`);

    let refs = "";
    for (const head of heads) {
        refs += fs.readFileSync(`${id}/.git/refs/heads/${head}`).toString().trim() + `\trefs/heads/${head}`;
    }

    refs += "\n";

    fs.umount(`/${id}`);

    console.log("umounted");

    return new Response(refs);
}
