import type { CodebaseMetadata, RepoMetadata } from "../cloudstate/simple-repo";
import { RepoBar } from "../components/RepoBar";
import { RepoSidebar } from "../components/SideBar";
import { CodeBar } from "../components/CodeBar";
import { format } from "timeago.js";
import { FileIcon, getIconForFile } from "../lib/icon-map";
import { FileRow } from "../components/FileRow";
// const { ThemeProvider } = await import('@primer/react');

export function RepoLayout(props: {
  repoMetadata: RepoMetadata;
  codeMetadata: CodebaseMetadata;
}) {
  const { repoMetadata, codeMetadata } = props;

  return (
    <div className="w-full flex flex-col">
      <RepoBar repoMetadata={repoMetadata} />
      <div className="grid grid-cols-[2fr,1fr] w-full h-full px-12 py-4">
        <div className="pr-4">
          <CodeBar />
          <div className="mt-4" />
          <div className="rounded-lg border border-[#30363d] overflow-hidden">
            <div className="bg-[#161b22] p-2 border-b border-gray-700 flex flex-row justify-between items-center">
              <div className="text-gray-400">
                {codeMetadata.latestCommit.message}
              </div>
              <div className="text-xs text-gray-400">
                {codeMetadata.latestCommit.shortHash} •{" "}
                {format(codeMetadata.latestCommit.date)}
              </div>
            </div>
            {Object.entries(codeMetadata.files).map((
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
        </div>
        <div className="pl-4">
          <RepoSidebar repoMetadata={repoMetadata} />
        </div>
      </div>
    </div>
  );
}
