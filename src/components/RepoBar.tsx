import type { RepoMetadata } from "../cloudstate/simple-repo";
import Button from "./Button";
import CountIndicator from "./CountIndicator";
import IconRepoForked from "./icons/Fork";
import IconStar from "./icons/Star";
import { emojiBlast } from "emoji-blast";

export const RepoBar = (props: { repoMetadata: RepoMetadata }) => {
  const { repoMetadata } = props;
  return (
    <div className="px-6 sm:px-12 pt-4">
      <div className="flex flex-row justify-between">
        <h1 className="dark:text-white text-xl font-semibold">
          <a
            className=" hover:underline"
            href={`/${repoMetadata.owner}/${repoMetadata.name}`}
          >
            {repoMetadata.name}
          </a>
        </h1>
        <div className="flex flex-row space-x-2">
          <Button style="secondary" spacing="compact" disabled>
            <IconRepoForked />
            Fork
            <CountIndicator count={repoMetadata.forkCount} />
          </Button>
          <Button
            style="secondary"
            spacing="compact"
            onClick={(evt) => {
              emojiBlast({
                position: { x: evt.clientX, y: evt.clientY },
                emojiCount: 100,
                emojis: ["⭐"],
              });
            }}
          >
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
