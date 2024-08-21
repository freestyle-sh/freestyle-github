import fs from "@zenfs/core";
import { cloudstate } from "freestyle-sh";
import { createFS } from "./filesystem";

export interface RepoMetadata {
  name: string;
  description: string;
  link: string;
  starCount: number;
  forkCount: number;
}

export type CodebaseMetadata = {
  latestCommit: {
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

export interface FileMetadata {
  fileType: FileType;
  lastestCommitMessage: string;
  lastestCommitDate: number;
}

@cloudstate
export class Repository {
  owner: string;
  name: string;
  repoId: string;
  rawData: Blob;

  constructor(owner: string, name: string, data: Blob) {
    this.owner = owner;
    this.name = name;
    this.repoId = `${owner}/${name}`;
    this.rawData = data;
  }

  mount() {
    const FS = createFS();
    return fs.mount(this.repoId, FS);
  }

  unmount() {
    fs.umount(this.repoId);
  }

  [Symbol.dispose]() {
    this.unmount();
  }
}

@cloudstate
export class RepoIndex {
  static readonly id = "repo-index";

  repos: Map<string, Repository> = new Map();

  addRepo(repo: Repository) {
    this.repos.set(repo.repoId, repo);
  }

  getRepo(name: string) {
    return this.repos.get(name);
  }
}

@cloudstate
export class SimpleRepo {
  static readonly id = "simple-repo";
  name = "Simple-Repo".toLowerCase();
  description = "A simple repo that stores a simple codebase";
  link = "https://www.freestyle.sh";
  codebase = {
    filename: "simple-repo.ts",
  };
  starCount = 0;
  forkCount = 0;

  getInfo() {
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
        message: "Initial commit",
        date: Date.now(),
        shortHash: "123456",
      },
      totalCommits: 1,
      files: {
        "filename.ts": {
          fileType: "file",
          lastestCommitMessage: "Initial commit",
          lastestCommitDate: Date.now(),
        },
        src: {
          fileType: "dir",
          lastestCommitMessage:
            "Initial commitafgasdgsdg this one is super long and will not be allowed to go to two lines god damn you",
          lastestCommitDate: Date.now(),
        },
        components: {
          fileType: "dir",
          lastestCommitMessage: "Initial commit",
          lastestCommitDate: Date.now(),
        },
        icons: {
          fileType: "dir",
          lastestCommitMessage: "Initial commit",
          lastestCommitDate: Date.now(),
        },
        layouts: {
          fileType: "dir",
          lastestCommitMessage: "Initial commit",
          lastestCommitDate: Date.now(),
        },
        "package.json": {
          fileType: "file",
          lastestCommitMessage: "Initial commit",
          lastestCommitDate: Date.now(),
        },
      },
    };
  }
}
