import { cloudstate } from "freestyle-sh";

export interface RepoMetadata {
  id: string;
  name: string;
  description: string;
  link?: string;
  starCount: number;
  forkCount: number;
  owner: string;
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
export type FileMetadata =
  & {
    fileType: FileType;
    link: string;
    lastestCommitMessage: string;
    lastestCommitDate: number;
  }
  & (
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
  description: string;
  data: Blob;
  link: string | undefined;

  constructor({
    owner,
    name,
    data,
    description,
    link,
  }: {
    owner: string;
    name: string;
    data: Blob;
    description?: string;
    link?: string;
  }) {
    this.id = crypto.randomUUID();
    this.owner = owner;
    this.name = name;
    this.data = data;
    this.description = description ?? "";
    this.link = link;
  }

  setData({ data }: { data: string }) {
    console.log("setting data");
    this.data = new Blob([data]);
  }

  async getData() {
    console.log("getting data");
    return { data: await this.data.text() };
  }

  metadata(): RepoMetadata {
    return {
      id: this.id,
      owner: this.owner,
      name: this.name,
      description: this.description,
      link: this.link,
      starCount: 0,
      forkCount: 0,
    };
  }
}

@cloudstate
export class RepoIndex {
  static readonly id = "repo-index";

  repos: Map<string, Repository> = new Map();
  repoByOwnerName: Map<string, string> = new Map();

  listRepos() {
    return Array.from(this.repos.values()).map((r) => r.metadata());
  }

  getOrCreateRepo(repo: { owner: string; name: string }) {
    const existingRepo = Array.from(this.repos.values()).find(
      (r) => r.name === repo.name && r.owner === repo.owner,
    );
    if (existingRepo) {
      return { id: existingRepo.id };
    }
    return this.createRepo(repo);
  }

  createRepo(repo: { owner: string; name: string; description?: string }) {
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
      description: repo.description,
      link: undefined,
    });
    this.repos.set(newRepo.id, newRepo);
    this.repoByOwnerName.set(`${repo.owner}/${repo.name}`, newRepo.id);
    return { id: newRepo.id };
  }

  getRepoMetadata(repoLocation: { owner: string; name: string }) {
    const ownerName = `${repoLocation.owner}/${repoLocation.name}`;
    const repoId = this.repoByOwnerName.get(ownerName);
    if (!repoId) {
      console.log("repo does not exist on index", ownerName);
      return;
    }
    const repo = this.repos.get(repoId);
    if (!repo) {
      console.log("repo does not exist on index", repoId);
      return;
    }
    return repo.metadata();
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
      owner: existingRepo.owner,
      name: existingRepo.name,
      description: existingRepo.description,
      link: existingRepo.link,
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
      id: "simple-repo",
      owner: "kevgug",
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
