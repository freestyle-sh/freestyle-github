import { useCloud } from "freestyle-sh";
import type { RepoMetadata, Repository } from "../cloudstate/simple-repo";
import Button from "./Button";
import CountIndicator from "./CountIndicator";
import IconRepoForked from "./icons/Fork";
import IconStar from "./icons/Star";
import { emojiBlast } from "emoji-blast";
import { useCloudQuery } from "freestyle-sh/react";

export const RepoBar = (props: { repoMetadata: RepoMetadata }) => {
  const { data: repoInfo } = useCloudQuery(
    useCloud<typeof Repository>(props.repoMetadata.id).getPublicInfo
  );
  const repo = useCloud<typeof Repository>(props.repoMetadata.id);
  const { data: hasStarred } = useCloudQuery(repo.currentUserStarred);

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
          {/* <Button style="secondary" spacing="compact" disabled>
            <IconRepoForked />
            Fork
            <CountIndicator count={repoMetadata.forkCount} />
          </Button> */}
          <Button
            style="secondary"
            spacing="compact"
            onClick={async (evt) => {
              await repo.star().then((res) => {
                if (res) {
                  emojiBlast({
                    position: { x: evt.clientX, y: evt.clientY },
                    emojiCount: 100,
                    emojis: ["⭐"],
                  });
                } else {
                  emojiBlast({
                    position: { x: evt.clientX, y: evt.clientY },
                    emojiCount: 100,
                    emojis: ["💔"],
                  });
                }
              });
            }}
          >
            <IconStar starred={repoInfo?.currentUserStarred ?? hasStarred} />
            Star
            <CountIndicator
              count={repoInfo?.starCount ?? repoMetadata.starCount}
            />
          </Button>
        </div>
      </div>
      <div className="mt-4 h-[0.5px] w-full bg-slate-700" />
    </div>
  );
};
