import React from "react";
import { LinkIcon } from "./icons/link";
import type { RepoMetadata } from "../cloudstate/simple-repo";

export const RepoSidebar = (props: { repoMetadata: RepoMetadata }) => {
    const { repoMetadata } = props;
    return (
        <div>
            <h2 className="font-bold mb-4">
                About
            </h2>
            <p className="mb-4">
                {repoMetadata.description}
            </p>
            <div className="flex flex-row fill-white items-center">
                <LinkIcon className="h-4 w-4 mr-4" />

                <a
                    href={repoMetadata.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:text-blue-400 transition-all font-semibold"
                >
                    {new URL(repoMetadata.link).hostname +
                        new URL(repoMetadata.link).pathname}
                </a>
            </div>
        </div>
    );
};
