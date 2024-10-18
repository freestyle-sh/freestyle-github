import type { APIRoute } from "astro";
import { useCloud } from "freestyle-sh";
import {
  getOrMountRepo,
  type RepoIndex,
  type Repository,
} from "../cloudstate/simple-repo";
import fs from "@zenfs/core";

export const GET = async ({ params, request }: Parameters<APIRoute>[0]) => {
  const repoIndex = useCloud<typeof RepoIndex>("repo-index");
  return new Response(
    JSON.stringify(
      await repoIndex
        .getRepo({
          owner: "bas",
          name: "bas",
        })
        .then(async (repo) => {
          console.log(repo);

          const repository = useCloud<typeof Repository>(repo.id);
          const data = await repository.getData();
          const mounted = await getOrMountRepo(repo.id, new Blob([data.data]));
          // print all files in the repo
        let files = fs.readdirSync('/');
        while (files.length) {
            const file: string = files.pop() as string;
            console.log(file);
            if (fs.statSync(file).isDirectory()) {
                fs.readdirSync(file).forEach((f) => files.push(`${file}/${f}`));
            }
        }
        

          return repo;
        }),
    ),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};
