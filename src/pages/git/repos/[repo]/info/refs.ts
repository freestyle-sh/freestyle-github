// import {InMemoryStore, StoreFS} from '@zenfs/core';
import { configure, InMemory } from '@zenfs/core';
import git from "isomorphic-git";
import {fs} from "@zenfs/core"
import type { APIRoute } from 'astro';

await configure({
    mounts: {
        "/": InMemory
    }
});

export async function GET({ params, request }: Parameters<APIRoute>[0]) {
    await git.init({
        fs,
        dir: `/${params.repo}`,
    });

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

    return new Response(refs);
}
