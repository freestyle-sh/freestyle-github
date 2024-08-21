import { cloudstate} from 'freestyle-sh';


export interface RepoMetadata {
    name: string;
    description: string;
    link: string;
}

@cloudstate
export class SimpleRepo {
    static readonly id = "simple-repo";
    name = "Simple Repo";
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

}