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
          owner: "JacobZwang",
          name: "bs",
        })
        .then(async (repo) => {
          console.log(repo);

          const repository = useCloud<typeof Repository>(repo.id);
          const data = await repository.getData();
          const mounted = await getOrMountRepo(repo.id, new Blob([data.data]));
          const files = fs.readFileSync(
            `/ca9821ce-32d8-478f-822d-9bee7cb02351/.git/objects/60/e5a64c402b13e887d1616932a49150046d81a3`,
            {},
          );
          console.log("FILES", files);

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
