import type { RepoMetadata } from "../cloudstate/simple-repo";
import Button from "./Button";
import CountIndicator from "./CountIndicator";
import IconRepoForked from "./icons/Fork";
import IconStar from "./icons/Star";

export const RepoBar = (props: { repoMetadata: RepoMetadata }) => {
  const { repoMetadata } = props;
  return (
    <div className="px-12 pt-4">
      <div className="flex flex-row justify-between">
        <h1 className="dark:text-white text-xl font-semibold">
          {repoMetadata.name}
        </h1>
        <div className="flex flex-row space-x-2">
          <Button style="secondary" spacing="compact">
            <IconRepoForked />
            Fork
            <CountIndicator count={repoMetadata.forkCount} />
          </Button>
          <Button style="secondary" spacing="compact">
            <IconStar starred={false} />
            Star
            <CountIndicator count={repoMetadata.starCount} />
          </Button>
        </div>
      </div>
      <div className="mt-4 h-[0.5px] w-full bg-slate-700" />
    </div>
  );
};
