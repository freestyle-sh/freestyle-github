import React from "react";
import type { FileSystemMetadata } from "../cloudstate/simple-repo";
import { format } from "timeago.js";
import { FileRow } from "./FileRow";

export const FileSystemViewer = (props: {
  fileSystemMetadata: FileSystemMetadata;
  children: React.ReactNode;
}) => {
  const { fileSystemMetadata } = props;
  const fsEntries = Object.entries(fileSystemMetadata);
  return (
    <div className="text-sm rounded-lg border border-[#30363d] w-100 overflow-ellipsis overflow-hidden">
      <div className="bg-[#161b22] px-4 py-3.5 border-b border-gray-700 flex flex-row justify-between items-center">
        {props.children}
      </div>

      {fsEntries.length
        ? fsEntries.map(([path, file]) => (
          <FileRow key={path} fileMetadata={{ ...file, path }} />
        ))
        : (
          <div>
            <div className="text-gray-400 px-4 py-3.5 text-center">
              No files found
            </div>
          </div>
        )}
    </div>
  );
};
