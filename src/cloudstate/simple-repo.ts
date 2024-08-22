import fs, { type StoreFS } from "@zenfs/core";
import { cloudstate } from "freestyle-sh";
import { type CloudStore, createFS } from "./filesystem";

export interface RepoMetadata {
  name: string;
  description: string;
  link: string;
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
  store: StoreFS<CloudStore>;

  constructor(owner: string, name: string, store: StoreFS<CloudStore>) {
    this.id = `${owner}/${name}`;
    this.owner = owner;
    this.name = name;
    this.store = store;
  }

  mount() {
    const FS = createFS();
    return fs.mount(this.id, FS);
  }

  unmount() {
    fs.umount(this.id);
  }

  [Symbol.dispose]() {
    this.unmount();
  }
}

@cloudstate
export class RepoIndex {
  static readonly id = "repo-index";

  repos: Map<string, Repository> = new Map();

  getOrCreateRepo(repo: { owner: string; name: string }) {
    const repoId = `${repo.owner}/${repo.name}`;
    const existingRepo = this.repos.get(repoId);
    if (existingRepo) {
      return existingRepo.id;
    }
    const newRepo = new Repository(repo.owner, repo.name, createFS());
    this.repos.set(repoId, newRepo);
    return newRepo.id;
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
        author: {
          username: "kevgug",
          avatar: "https://avatars.githubusercontent.com/u/37193648?v=4",
        },
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
        "package.json": {
          fileType: "file",
          lastestCommitMessage: "Initial commit",
          lastestCommitDate: Date.now(),
        },
        "package-lock.json": {
          fileType: "file",
          lastestCommitMessage: "Initial commit",
          lastestCommitDate: Date.now(),
        },
        "slambam.c": {
          fileType: "file",
          lastestCommitMessage: "Initial commit",
          lastestCommitDate: Date.now(),
        },
        'pnpm-lock.yaml': {
          fileType: 'file',
          lastestCommitMessage: 'Initial commit',
          lastestCommitDate: Date.now(),
        },
        src: {
          fileType: "dir",
          lastestCommitMessage:
            "Initial commitafgasdgsdg this one is super long and will not be allowed to go to two lines god damn you",
          lastestCommitDate: Date.now(),
          children: {
            cloudstate: {
              fileType: "dir",
              lastestCommitMessage: "Initial commit",
              lastestCommitDate: Date.now(),
              children: {
                "simple-repo.ts": {
                  fileType: "file",
                  lastestCommitMessage: "Initial commit",
                  lastestCommitDate: Date.now(),
                },
              },
            },
            components: {
              fileType: "dir",
              lastestCommitMessage: "Initial commit",
              lastestCommitDate: Date.now(),
              children: {
                "RepoBar.tsx": {
                  fileType: "file",
                  lastestCommitMessage: "Initial commit",
                  lastestCommitDate: Date.now(),
                },
                "RepoSidebar.tsx": {
                  fileType: "file",
                  lastestCommitMessage: "Initial commit",
                  lastestCommitDate: Date.now(),
                },
                "CodeBar.tsx": {
                  fileType: "file",
                  lastestCommitMessage: "Initial commit",
                  lastestCommitDate: Date.now(),
                },
                "FileRow.tsx": {
                  fileType: "file",
                  lastestCommitMessage: "Initial commit",
                  lastestCommitDate: Date.now(),
                },
                "CodebaseViewer.tsx": {
                  fileType: "file",
                  lastestCommitMessage: "Initial commit",
                  lastestCommitDate: Date.now(),
                },
              },
            },
            lib: {
              fileType: "dir",
              lastestCommitMessage: "Initial commit",
              lastestCommitDate: Date.now(),
              children: {
                "icon-map.ts": {
                  fileType: "file",
                  lastestCommitMessage: "Initial commit",
                  lastestCommitDate: Date.now(),
                },
              },
            },
          },
        },
      },
    };
  }
}
