import { cloudstate } from "freestyle-sh";

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

export interface FileMetadata {
    isDir: boolean;
    isFile: boolean;
    lastestCommitMessage: string;
    lastestCommitDate: number;
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
          isDir: false,
          isFile: true,
          lastestCommitMessage: "Initial commit",
          lastestCommitDate: Date.now(),
        },
        src: {
          isDir: true,
          isFile: false,
          lastestCommitMessage: "Initial commitafgasdgsdg this one is super long and will not be allowed to go to two lines god damn you",
          lastestCommitDate: Date.now(),
        },
        components: {
          isDir: true,
          isFile: false,
          lastestCommitMessage: "Initial commit",
          lastestCommitDate: Date.now(),
        },
        icons: {
          isDir: true,
          isFile: false,
          lastestCommitMessage: "Initial commit",
          lastestCommitDate: Date.now(),
        },
        layouts: {
          isDir: true,
          isFile: false,
          lastestCommitMessage: "Initial commit",
          lastestCommitDate: Date.now(),
        },
        "package.json": {
          isDir: false,
          isFile: true,
          lastestCommitMessage: "Initial commit",
          lastestCommitDate: Date.now(),
        },
      },
    };
  }

}
