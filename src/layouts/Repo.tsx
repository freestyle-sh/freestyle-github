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
      <div className="grid grid-cols-1 sm:grid-cols-[2fr,1fr] w-full h-full px-6 sm:px-12 py-4">
        <div className="mb-8 sm:mb-0 sm:pr-4">
          <CodeBar />
          <div className="mt-4" />
          <CodebaseViewer codeMetadata={codeMetadata} />
        </div>
        <div className="sm:pl-4">
          <RepoSidebar repoMetadata={repoMetadata} />
        </div>
      </div>
    </div>
  );
}
