import { cloudstate } from "freestyle-sh";
import { fs, InMemoryStore, StoreFS } from "@zenfs/core";
import git from "isomorphic-git";

export interface RepoMetadata {
  name: string;
  description: string;
  link?: string;
  starCount: number;
  forkCount: number;
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
  description: string = "";
  data: Blob;

  constructor({
    owner,
    name,
    data,
  }: {
    owner: string;
    name: string;
    data: Blob;
  }) {
    this.id = crypto.randomUUID();
    this.owner = owner;
    this.name = name;
    this.data = data;
    this.description = `A repository for ${this.owner}/${this.name}`;
  }

  setData({ data }: { data: string }) {
    console.log("setting data");
    this.data = new Blob([data]);
  }

  async getData() {
    console.log("getting data");
    return { data: await this.data.text() };
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

    for (const file of files.filter((file) => file !== ".git")) {
      meta[file] = {
        fileType: "file",
        link: file,
        lastestCommitMessage: "Not a real commit",
        lastestCommitDate: Date.now(),
        path: file,
      };
    }

    console.log("meta", meta);

    return {
      latestCommit: {
        author: {
          username: "JacobZwang",
          avatar: "https://avatars.githubusercontent.com/u/37193648?v=4",
        },
        message: "Not a real commit",
        date: Date.now(),
        shortHash: "123456",
      },
      totalCommits: 1,
      files: meta,
    };
  }
}

export async function getOrMountRepo(id: string, data?: Blob) {
  const existingMount = Array.from(fs.mounts.entries()).find(
    ([name, mount]) => name === `/${id}`,
  );
  if (existingMount) {
    try {
      fs.umount(`/${id}`);
    } catch (e) {}
  }

  // if (!existingMount) {
  const store = new InMemoryStore();
  if (data) {
    const entries = JSON.parse(await data.text()).map(
      ([key, value]: [string, any]) => [BigInt(key), new Uint8Array(value)],
    );
    entries.forEach(([key, value]) => store.set(key, value));
  }
  const storefs = new StoreFS(store);
  try {
    fs.mount(`/${id}`, storefs);
  } catch (e) {}
  storefs.checkRootSync();
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
    ]),
  );
  return new Blob([json]);
}

Response.prototype.arrayBuffer = async function () {
  // console.log(this.constructor.prototype);
  const encoder = new TextEncoder();
  const arrayBuffer = encoder.encode(await this.text()).buffer;
  return await arrayBuffer;
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
      starCount: 0,
      forkCount: 0,
    }));
  }

  async createRepo(repo: { owner: string; name: string }) {
    const existingRepo = Array.from(this.repos.values()).find(
      (r) => r.name === repo.name && r.owner === repo.owner,
    );

    console.log("existing repo", existingRepo);

    if (existingRepo) {
      throw new Error("Repo already exists");
    }

    const newRepo = new Repository({
      owner: repo.owner,
      name: repo.name,
      data: new Blob(),
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

    fs.writeFileSync(`/${newRepo.id}` + "/test.txt", "test");

    console.log(fs.readdirSync(`/${newRepo.id}`));

    await git.add({
      fs,
      dir: `/${newRepo.id}`,
      filepath: "test.txt",
    });

    await git.commit({
      fs,
      dir: `/${newRepo.id}`,
      message: "first commit",
      author: {
        name: "Jacob Zwang",
        email: "59858341+JacobZwang@users.noreply.github.com",
      },
    });

    console.log("committed");

    const blob = await inMemoryStoreToBlob(store);

    newRepo.data = blob;

    return { id: newRepo.id };
  }

  getRepo(repo: { owner: string; name: string }) {
    const existingRepo = Array.from(this.repos.values()).find(
      (r) => r.name === repo.name && r.owner === repo.owner,
    );

    if (!existingRepo) {
      throw new Error("Repo does not exist");
    }

    return {
      id: existingRepo.id,
      name: existingRepo.name,
      owner: existingRepo.owner,
      description: existingRepo.description,
      starCount: 0,
      forkCount: 0,
    };
  }
}

@cloudstate
export class SimpleRepo {
  static readonly id = "simple-repo";
  name = "Simple-Repo".toLowerCase();
  description = "A simple repo that stores a simple codebase";
  link: string | undefined = "https://www.freestyle.sh";
  codebase = {
    filename: "simple-repo.ts",
  };
  starCount = 0;
  forkCount = 0;

  getInfo(): RepoMetadata {
    return {
      name: this.name,
      description: this.description,
      link: this.link,
      starCount: this.starCount,
      forkCount: this.forkCount,
    };
  }

  getLatestCodebaseMetadata(): CodebaseMetadata {
    return {
      latestCommit: {
        author: {
          username: "kevgug",
          avatar: "https://avatars.githubusercontent.com/u/37193648?v=4",
        },
        message: "Initial commit",
        date: Date.now(),
        shortHash: "123456",
      },
      totalCommits: 1,
      files: {},
      // files: {
      //   "filename.ts": {
      //     fileType: "file",
      //     // link: this.link+"/"
      //     lastestCommitMessage: "Initial commit",
      //     lastestCommitDate: Date.now(),
      //   },
      //   "package.json": {
      //     fileType: "file",
      //     lastestCommitMessage: "Initial commit",
      //     lastestCommitDate: Date.now(),
      //   },
      //   "package-lock.json": {
      //     fileType: "file",
      //     lastestCommitMessage: "Initial commit",
      //     lastestCommitDate: Date.now(),
      //   },
      //   "slambam.c": {
      //     fileType: "file",
      //     lastestCommitMessage: "Initial commit",
      //     lastestCommitDate: Date.now(),
      //   },
      //   'pnpm-lock.yaml': {
      //     fileType: 'file',
      //     lastestCommitMessage: 'Initial commit',
      //     lastestCommitDate: Date.now(),
      //   },
      //   src: {
      //     fileType: "dir",
      //     lastestCommitMessage:
      //       "Initial commitafgasdgsdg this one is super long and will not be allowed to go to two lines god damn you",
      //     lastestCommitDate: Date.now(),
      //     children: {
      //       cloudstate: {
      //         fileType: "dir",
      //         lastestCommitMessage: "Initial commit",
      //         lastestCommitDate: Date.now(),
      //         children: {
      //           "simple-repo.ts": {
      //             fileType: "file",
      //             lastestCommitMessage: "Initial commit",
      //             lastestCommitDate: Date.now(),
      //           },
      //         },
      //       },
      //       components: {
      //         fileType: "dir",
      //         lastestCommitMessage: "Initial commit",
      //         lastestCommitDate: Date.now(),
      //         children: {
      //           "RepoBar.tsx": {
      //             fileType: "file",
      //             lastestCommitMessage: "Initial commit",
      //             lastestCommitDate: Date.now(),
      //           },
      //           "RepoSidebar.tsx": {
      //             fileType: "file",
      //             lastestCommitMessage: "Initial commit",
      //             lastestCommitDate: Date.now(),
      //           },
      //           "CodeBar.tsx": {
      //             fileType: "file",
      //             lastestCommitMessage: "Initial commit",
      //             lastestCommitDate: Date.now(),
      //           },
      //           "FileRow.tsx": {
      //             fileType: "file",
      //             lastestCommitMessage: "Initial commit",
      //             lastestCommitDate: Date.now(),
      //           },
      //           "CodebaseViewer.tsx": {
      //             fileType: "file",
      //             lastestCommitMessage: "Initial commit",
      //             lastestCommitDate: Date.now(),
      //           },
      //         },
      //       },
      //       lib: {
      //         fileType: "dir",
      //         lastestCommitMessage: "Initial commit",
      //         lastestCommitDate: Date.now(),
      //         children: {
      //           "icon-map.ts": {
      //             fileType: "file",
      //             lastestCommitMessage: "Initial commit",
      //             lastestCommitDate: Date.now(),
      //           },
      //         },
      //       },
      //     },
      //   },
      // },
    };
  }
}
