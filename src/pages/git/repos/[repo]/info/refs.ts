// import {InMemoryStore, StoreFS} from '@zenfs/core';
import { configure, InMemory } from '@zenfs/core';
import git from "isomorphic-git";
import {fs} from "@zenfs/core"

// import fs from "node:fs";

await configure({
    mounts: {
        "/": InMemory
    }
});

export async function GET({ params, request }) {
    // return new Response(fs.readFileSync("/Users/jacobzwang/Documents/GitHub/freestyle-github/.git/info/refs").toString());

    await git.init({
        fs,
        dir: "/",
    });

    await git.branch({
        fs,
        dir: "/",
        ref: "main",
        checkout: true,
    });

    fs.writeFileSync("/test.txt", "test");

    await git.add({
        fs,
        dir: "/",
        filepath: "test.txt",
    });

    await git.commit({
        fs,
        dir: "/",
        message: "first commit",
        author: {
            name: "Jacob Zwang",
            email: "59858341+JacobZwang@users.noreply.github.com",
        },
    });

    console.log(await git.listFiles({
        fs,
        dir: "/",
        ref: "main",
    }));

    const heads = fs.readdirSync("/.git/refs/heads");

    let refs = "";
    for (const head of heads) {
        refs += fs.readFileSync(`/.git/refs/heads/${head}`).toString().trim() + `\trefs/heads/${head}`;
    }

    console.log(refs);

    return new Response(refs);
}
