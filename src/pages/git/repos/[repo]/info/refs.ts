// import {InMemoryStore, StoreFS} from '@zenfs/core';
import { configure, InMemory, InMemoryStore, StoreFS } from '@zenfs/core';
import git from "isomorphic-git";
import {fs} from "@zenfs/core"
import { useCloud } from 'freestyle-sh';
import { Repository, SimpleRepo, type RepoIndex } from '../../../../../cloudstate/simple-repo';
import { CloudStore } from '../../../../../cloudstate/filesystem';

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

    console.log("mounted");
    
    await git.init({
        fs,
        dir: `/${params.repo}`,
    });

    console.log("initialized");

    await git.branch({
        fs,
        dir: `/${params.repo}`,
        ref: "main",
        checkout: true,
    });

    fs.writeFileSync( `/${params.repo}` + "/test.txt", "test");

    await git.add({
        fs,
        dir: `/${params.repo}`,
        filepath: "test.txt",
    });

    await git.commit({
        fs,
        dir: `/${params.repo}`,
        message: "first commit",
        author: {
            name: "Jacob Zwang",
            email: "59858341+JacobZwang@users.noreply.github.com",
        },
    });

    console.log("committed");

    const json = JSON.stringify(Array.from(map.entries()).map(([key, value]) => [key.toString(), Array.from(value)]));

    // console.log(json);

    await useCloud<typeof Repository>(id).setData({
        data: json,
    });

    console.log("set data");

    fs.readdirSync(`${params.repo}/.git/objects/`).forEach(file => {
        fs.readdirSync(`${params.repo}/.git/objects/${file}`).forEach(file2 => {
            console.log(file2);
        });
    });

    const heads = fs.readdirSync(`${params.repo}/.git/refs/heads`);

    let refs = "";
    for (const head of heads) {
        refs += fs.readFileSync(`${params.repo}/.git/refs/heads/${head}`).toString().trim() + `\trefs/heads/${head}`;
    }

    refs += "\n";

    fs.umount(`/${params.repo}`);

    console.log("umounted");

    return new Response(refs);
}
