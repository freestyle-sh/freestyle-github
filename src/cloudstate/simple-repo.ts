import { cloudstate} from 'freestyle-sh';


export interface RepoMetadata {
    name: string;
    description: string;
    link: string;
}

export type CodebaseMetadata = {
    [path: string]: {
        isDir: boolean;
        isFile: boolean;
        lastestCommitMessage: string
        lastestCommitDate: number;
    };
}

@cloudstate
export class SimpleRepo {
    static readonly id = "simple-repo";
    name = "Simple-Repo".toLowerCase();
    description = "A simple repo that stores a simple codebase";
    link = 'https://www.freestyle.sh'
    codebase = {
        filename: 'simple-repo.ts',

    }

    getInfo() {
        return {
            name: this.name,
            description: this.description,
            link: this.link
        }
    }

    getLatestCodebaseMetadata(path: string): CodebaseMetadata {
        return {
            "filename.ts": {
                isDir: false,
                isFile: true,
                lastestCommitMessage: "Initial commit",
                lastestCommitDate: Date.now(),
            },
            "src": {
                isDir: true,
                isFile: false,
                lastestCommitMessage: "Initial commit",
                lastestCommitDate: Date.now(),
            },
            "components": {
                isDir: true,
                isFile: false,
                lastestCommitMessage: "Initial commit",
                lastestCommitDate: Date.now(),
            },
            "icons": {
                isDir: true,
                isFile: false,
                lastestCommitMessage: "Initial commit",
                lastestCommitDate: Date.now(),
            },
            "layouts": {
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
        }
    }

}