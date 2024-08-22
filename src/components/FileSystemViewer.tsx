import React from "react";
import type { FileSystemMetadata } from "../cloudstate/simple-repo";
import { format } from "timeago.js";
import { FileRow } from "./FileRow";

export const FileSystemViewer = (props: {
    fileSystemMetadata: FileSystemMetadata;
    children: React.ReactNode;
}) => {
    const { fileSystemMetadata } = props;
    return (
        <div className="rounded-lg border border-[#30363d] overflow-hidden">
            <div className="bg-[#161b22] p-2 border-b border-gray-700 flex flex-row justify-between items-center">
                {props.children}
            </div>
            {Object.entries(fileSystemMetadata).map((
                [path, file],
                index,
                all,
            ) => (
                <FileRow
                    key={path}
                    fileMetadata={{ ...file, path }}
                    isLast={index !== all.length - 1}
                />
            ))}
        </div>
    );
};
