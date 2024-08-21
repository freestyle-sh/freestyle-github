import type { RepoMetadata } from "../cloudstate/simple-repo";
import Button from "./button";
import CountIndicator from "./count-indicator";
import { IconRepoForked, IconStar } from "./icons";

export const RepoBar = (props: {
    repoMetadata: RepoMetadata;
}) => {
    const { repoMetadata } = props;
    return (
        <div className="px-8 py-4">
            <div className="flex flex-row justify-between">
                <h1 className="dark:text-white text-xl font-semibold">
                    {repoMetadata.name}
                </h1>
                <div className="flex flex-row space-x-2">
                    <Button style="secondary">
                        <IconRepoForked/>
                        Fork
                        <CountIndicator count={repoMetadata.forkCount}/>
                    </Button>
                    <Button style="secondary">
                        <IconStar isStarred={false}/>
                        Star
                        <CountIndicator count={repoMetadata.starCount}/>
                    </Button>
                </div>
            </div>
        </div>
    );
};
