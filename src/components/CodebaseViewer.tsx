import React from "react";
import type { CodebaseMetadata } from "../cloudstate/simple-repo";
import { format } from "timeago.js";
import { FileRow } from "./FileRow";
import { FileSystemViewer } from "./FileSystemViewer";

export const CodebaseViewer = (props: {
    codeMetadata: CodebaseMetadata;
}) => {
    const { codeMetadata } = props;
    return (
        <FileSystemViewer fileSystemMetadata={codeMetadata.files}>
            <div className="text-gray-400">
                {codeMetadata.latestCommit.message}
            </div>
            <div className="text-xs text-gray-400">
                {codeMetadata.latestCommit.shortHash} •{" "}
                {format(codeMetadata.latestCommit.date)}
            </div>
        </FileSystemViewer>
    );
};
