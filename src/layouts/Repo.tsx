import type { CodebaseMetadata, RepoMetadata } from "../cloudstate/simple-repo";
import { RepoBar } from "../components/RepoBar";
import { RepoSidebar } from "../components/SideBar";
import { CodeBar } from "../components/CodeBar";
import { format } from "timeago.js";
import { FileRow } from "../components/FileRow";
import { CodebaseViewer } from "../components/CodebaseViewer";
import Avatar from "../components/Avatar";

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
          <div className="text-sm rounded-lg border border-[#30363d] w-100 overflow-ellipsis">
            <div className="bg-[#161b22] px-4 py-3.5 border-b border-gray-700 flex flex-row justify-between items-center">
              <div className="flex flex-row gap-2.5 items-center">
                <div className="flex flex-row gap-2 items-center">
                  <div className="cursor-pointer">
                    <Avatar
                      src={codeMetadata.latestCommit.author.avatar}
                      alt="kevgug"
                    />
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
            </div>
            {Object.entries(codeMetadata.files).map(
              ([path, file], index, all) => (
                <FileRow key={path} fileMetadata={{ ...file, path }} />
              )
            )}
          </div>
          <CodebaseViewer codeMetadata={codeMetadata} />
        </div>
        <div className="pl-4">
          <RepoSidebar repoMetadata={repoMetadata} />
        </div>
      </div>
    </div>
  );
}
