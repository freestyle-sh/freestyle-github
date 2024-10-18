import React from "react";
import type { CodebaseMetadata } from "../cloudstate/simple-repo";
import { format } from "timeago.js";
import { FileRow } from "./FileRow";
import { FileSystemViewer } from "./FileSystemViewer";
import Avatar from "./Avatar";

export const CodebaseViewer = (props: { codeMetadata: CodebaseMetadata }) => {
  const { codeMetadata } = props;
  return (
    <FileSystemViewer fileSystemMetadata={codeMetadata.files}>
      <div className="flex flex-row gap-2.5 items-center">
        <div className="flex flex-row gap-2 items-center">
          <div className="cursor-pointer">
            <a href={`/${codeMetadata.latestCommit.author.username}`}>
              <Avatar
                src={codeMetadata.latestCommit.author.avatar}
                alt="kevgug"
              />
            </a>
          </div>
          <div className="text-gray-100 font-bold hover:underline cursor-pointer">
            {codeMetadata.latestCommit.author.username}
          </div>
        </div>
        <div className="text-gray-400 hover:text-blue-500 hover:underline cursor-pointer">
          {codeMetadata.latestCommit.message}
        </div>
      </div>
      <div className="text-gray-400 text-xs">
        <span className="hover:text-blue-500 hover:underline cursor-pointer">
          {codeMetadata.latestCommit.shortHash}
        </span>{" "}
        • {format(codeMetadata.latestCommit.date)}
      </div>
    </FileSystemViewer>
  );
};
