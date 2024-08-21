import type { RepoMetadata } from "../cloudstate/simple-repo";
import React from "react";

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
                    <button>
                        Fork
                    </button>
                    <button>
                        Star
                    </button>
                </div>
            </div>
        </div>
    );
};
