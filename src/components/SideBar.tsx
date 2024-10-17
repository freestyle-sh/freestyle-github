import React from "react";
import { IconLink } from "./icons/Link";
import type { RepoMetadata } from "../cloudstate/simple-repo";

export const RepoSidebar = (props: { repoMetadata: RepoMetadata }) => {
  const { repoMetadata } = props;
  return (
    <div>
      <h2 className="font-bold mb-4">About</h2>
      <p className="mb-4">{repoMetadata.description} | {repoMetadata.link}</p>
      {repoMetadata.link ?
        (
          <>
            <div className="flex flex-row fill-white items-center">
              <IconLink className="h-4 w-4 mr-4" />

              <a
                href={repoMetadata.link}
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 hover:opacity-85 transition-all duration-75 font-semibold"
              >
                {new URL(repoMetadata.link!).hostname +
                  new URL(repoMetadata.link!).pathname}
              </a>
            </div>
          </>
        ): ""}
      <div className="h-4" />
    </div>
  );
};
