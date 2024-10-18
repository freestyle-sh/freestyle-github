// import {InMemoryStore, StoreFS} from '@zenfs/core';
import { configure, InMemory, InMemoryStore, StoreFS } from "@zenfs/core";
import git from "isomorphic-git";
import { fs } from "@zenfs/core";
import { useCloud } from "freestyle-sh";
import {
  getOrMountRepo,
  type Repository,
  type RepoIndex,
} from "../../../../../../cloudstate/simple-repo";
import { CloudStore } from "../../../../../../cloudstate/filesystem";
import type { APIRoute } from "astro";

// import fs from "node:fs";

// await configure({
//     mounts: {
//         "/": InMemory
//     }
// });

export async function GET({ params, request }: Parameters<APIRoute>[0]) {
  const { id } = await useCloud<typeof RepoIndex>("repo-index")
    .getRepo({
      owner: params.user!,
      name: params.repo!,
    })
    .catch(() => ({
      id: undefined,
    }));

  if (!id) {
    return new Response("Repo does not exist", {
      status: 404,
    });
  }

  console.log("got repo id", id);

  const data = await useCloud<typeof Repository>(id).getData();
  await getOrMountRepo(id, new Blob([data.data]));

  fs.readdirSync(`${id}/.git/objects/`).forEach((file) => {
    fs.readdirSync(`${id}/.git/objects/${file}`).forEach((file2) => {
      console.log(file2);
    });
  });

  const heads = fs.readdirSync(`${id}/.git/refs/heads`);

  let refs = "";
  for (const head of heads) {
    refs +=
      fs.readFileSync(`${id}/.git/refs/heads/${head}`).toString().trim() +
      `\trefs/heads/${head}`;
  }

  refs += "\n";

  // try {
  //     fs.umount(`/${id}`);
  // } catch (e) {}

  console.log("umounted");

  return new Response(refs);
}
