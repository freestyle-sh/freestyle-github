import { cloudstate } from "freestyle-sh";

export interface RepoMetadata {
    name: string;
    description: string;
    link: string;
    starCount: number;
    forkCount: number;
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
}
