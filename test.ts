import { fs } from "npm:@zenfs/core";
import { getOrMountRepo } from "./src/cloudstate/simple-repo.ts";
import git from "npm:isomorphic-git";

await getOrMountRepo("test");

await git.init({
  fs,
  dir: "/test",
});

await git.branch({
  fs,
  dir: "/test",
  ref: "main",
  checkout: true,
});

fs.writeFileSync("/test/test.txt", "test");

await git.add({
  fs,
  dir: "/test",
  filepath: "test.txt",
});

{
  for (const prefix of fs.readdirSync(`${"test"}/.git/objects`)) {
    for (const file of fs.readdirSync(`${"test"}/.git/objects/${prefix}`)) {
      console.log(
        prefix,
        file,
        fs.readFileSync(`${"test"}/.git/objects/${prefix}/${file}`).toString(),
      );
    }
  }
}
