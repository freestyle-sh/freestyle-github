import { cloudstate, invalidate, useCloud, useLocal } from "freestyle-sh";
import { fs, InMemoryStore, StoreFS, umount } from "@zenfs/core";
import git from "isomorphic-git";
import type { AuthCS } from "./auth";
import type { UserCS } from "./user";

export interface RepoMetadata {
  id: string;
  name: string;
  owner: string;
  description: string;
  link?: string;
  starCount: number;
  // forkCount: number;
}

export type CodebaseMetadata = {
  latestCommit: {
    author: {
      username: string;
      avatar: string;
    };
    message: string;
    date: number;
    shortHash: string;
  };
  totalCommits: number;
  files: FileSystemMetadata;
  readme?: string;
};

export interface FileSystemMetadata {
  [path: string]: FileMetadata;
}

export type FileType = "dir" | "file";
export type FileMetadata = {
  fileType: FileType;
  link: string;
  lastestCommitMessage: string;
  lastestCommitDate: number;
  path: string;
} & (
  | {
      fileType: "dir";
      children: FileSystemMetadata;
    }
  | {
      fileType: "file";
    }
);

@cloudstate
export class Repository {
  readonly id: string;
  owner: string;
  name: string;
  data: Blob;
  description: string;
  stars: UserCS[] = [];

  constructor({
    owner,
    name,
    data,
    description,
  }: {
    owner: string;
    name: string;
    data: Blob;
    description: string;
  }) {
    this.id = crypto.randomUUID();
    this.owner = owner;
    this.name = name;
    this.data = data;
    this.description = description;
  }

  setData({ data }: { data: string }) {
    console.log("setting data");
    this.data = new Blob([data]);
  }

  async getFile(str: string) {
    await getOrMountRepo(this.id, this.data);
    const file = fs.readFileSync(`/${this.id}/${str}`, {});
    umount(`/${this.id}`);
    const fileText = new TextDecoder().decode(file);
    return fileText;
  }

  async getData() {
    console.log("getting data");
    return { data: await this.data.text() };
  }

  star() {
    invalidate(useCloud<typeof Repository>(this.id).getPublicInfo);
    if (
      !this.stars.some(
        (user) =>
          user.id === useLocal<typeof AuthCS>("auth").getCurrentUser()?.id
      )
    ) {
      this.stars.push(useLocal<typeof AuthCS>("auth").getDefiniteCurrentUser());
      return true;
    } else {
      this.stars = this.stars.filter(
        (user) =>
          user.id !== useLocal<typeof AuthCS>("auth").getCurrentUser()?.id
      );
      return false;
    }
  }

  currentUserStarred() {
    return this.stars.some(
      (star) => star.id === useLocal<typeof AuthCS>("auth").getCurrentUser()?.id
    );
  }

  getPublicInfo() {
    return {
      starCount: this.stars.length,
      currentUserStarred: this.currentUserStarred(),
    };
  }

  async getLatestCodebaseMetadata(): Promise<CodebaseMetadata> {
    await getOrMountRepo(this.id, this.data);

    console.log("getting latest codebase metadata");

    // console.log(fs.readdirSync(`/${this.id}`));

    // ! crashes
    // const files = await git.listFiles({
    //   fs,
    //   dir: `/${this.id}`,
    //   ref: "main",
    // }).catch(e => console.log(e));

    const files = fs.readdirSync(`/${this.id}`);

    console.log("files", files);

    const meta: FileSystemMetadata = {};

    const logs = await git.log({
      fs,
      dir: `/${this.id}`,
      ref: "main",
    });

    let readme = undefined;
    try {
      readme = fs.readFileSync(`/${this.id}/README.md`).toString();
    } catch (e) {
      console.log(e);
      readme = undefined;
    }

    console.log("readme", readme);

    for (const file of files.filter((file) => file !== ".git")) {
      const log = await git
        .log({
          fs,
          dir: `/${this.id}`,
          ref: "main",
          filepath: file,
        })
        .then((logs) => logs.at(-1)!);

      meta[file] = {
        fileType: "file",
        link: `/${this.owner}/${this.name}/blob/main/${file}`,
        lastestCommitMessage: log.commit.message,
        lastestCommitDate: log.commit.committer.timestamp * 1000,
        path: file,
      };
    }

    console.log(meta);

    const lastCommit = logs.at(-1)!;
    return {
      latestCommit: {
        author: {
          username: lastCommit.commit.author.name,
          avatar: "https://picsum.photos/id/1015/200/200",
        },
        message: lastCommit.commit.message,
        date: lastCommit.commit.committer.timestamp * 1000,
        shortHash: lastCommit.oid.slice(0, 7),
      },
      totalCommits: logs.length,
      files: meta,
      readme: readme,
    };
  }
}

export async function getOrMountRepo(id: string, data?: Blob) {
  const existingMount = Array.from(fs.mounts.entries()).find(
    ([name, mount]) => name === `/${id}`
  );
  if (existingMount) {
    try {
      fs.umount(`/${id}`);
    } catch (e) {}
  }

  // if (!existingMount) {
  const store = new InMemoryStore();
  if (data) {
    const text = await data.text();
    const entries = JSON.parse(text).map(([key, value]: [string, number]) => [
      BigInt(key),
      new Uint8Array(value),
    ]);
    for (const [key, value] of entries) {
      store.set(key, value);
    }
  }
  const storefs = new StoreFS(store);
  storefs.checkRootSync();
  fs.mount(`/${id}`, storefs);
  return store;
  // } else {
  //   return fs.mounts.entries()
  // }
}

export async function inMemoryStoreToBlob(store: InMemoryStore) {
  const json = JSON.stringify(
    Array.from(store.entries()).map(([key, value]) => [
      key.toString(),
      Array.from(value),
    ])
  );
  return new Blob([json]);
}

Response.prototype.arrayBuffer = async function () {
  // console.log(this.constructor.prototype);
  const encoder = new TextEncoder();
  const arrayBuffer = encoder.encode(await this.text()).buffer;
  return arrayBuffer;
};

@cloudstate
export class RepoIndex {
  static readonly id = "repo-index";

  repos: Map<string, Repository> = new Map();

  listRepos() {
    return Array.from(this.repos.values()).map((r) => ({
      id: r.id,
      name: r.name,
      owner: r.owner,
      description: r.description,
      starCount: r.stars.length,
      // forkCount: r.forkCount,
    }));
  }

  async createRepo(repo: { name: string; description: string }) {
    const owner = useLocal<typeof AuthCS>("auth").getUserInfo()?.username;
    if (!owner) {
      throw new Error("No user logged in");
    }

    console.log("creating repo", owner + "/" + repo.name);

    // @ts-ignore
    Blob.prototype.stream = undefined;
    const existingRepo = Array.from(this.repos.values()).find(
      (r) => r.name === repo.name && r.owner === owner
    );

    console.log("existing repo", existingRepo);

    if (existingRepo) {
      throw new Error("Repo already exists");
    }

    const newRepo = new Repository({
      owner: owner,
      name: repo.name,
      data: new Blob(),
      description: repo.description,
    });
    this.repos.set(newRepo.id, newRepo);

    const store = await getOrMountRepo(newRepo.id);

    await git.init({
      fs,
      dir: `/${newRepo.id}`,
    });

    console.log("initialized");

    await git.branch({
      fs,
      dir: `/${newRepo.id}`,
      ref: "main",
      checkout: true,
    });

    fs.writeFileSync(
      `/${newRepo.id}/README.md`,
      `# ${newRepo.name}\n\n${newRepo.description}`
    );
    console.log("wrote file");

    await git.add({
      fs,
      dir: `/${newRepo.id}`,
      filepath: "README.md",
    });

    {
      for (const prefix of fs.readdirSync(`${newRepo.id}/.git/objects`)) {
        for (const file of fs.readdirSync(
          `${newRepo.id}/.git/objects/${prefix}`
        )) {
          console.log(
            "LOgging file",
            prefix,
            file,
            fs
              .readFileSync(`${newRepo.id}/.git/objects/${prefix}/${file}`)
              .toString()
          );
        }
      }
    }

    const commit = await git.commit({
      fs,
      dir: `/${newRepo.id}`,
      message: "first commit",
      author: {
        name: useLocal<typeof AuthCS>("auth").getUserInfo()?.username,
        email: useLocal<typeof AuthCS>("auth").getUserInfo()?.username,
      },
    });

    console.log("commit", commit);

    const blob = await inMemoryStoreToBlob(store);

    newRepo.data = blob;

    return { id: newRepo.id };
  }

  getRepo(repo: { name: string }): RepoMetadata {
    const owner = useLocal<typeof AuthCS>("auth").getUserInfo()?.username;
    if (!owner) {
      throw new Error("No user logged in");
    }

    console.log(owner, repo);

    const existingRepo = Array.from(this.repos.values()).find(
      (r) => r.name === repo.name && r.owner === owner
    );

    if (!existingRepo) {
      throw new Error("Repo does not exist");
    }

    return {
      id: existingRepo.id,
      name: existingRepo.name,
      owner: existingRepo.owner,
      description: existingRepo.description,
      starCount: existingRepo.stars.length,
      // forkCount: existingRepo.forkCount,
    };
  }
}
