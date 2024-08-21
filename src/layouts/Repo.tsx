import type { CodebaseMetadata, RepoMetadata } from "../cloudstate/simple-repo";
import { RepoBar } from "../components/RepoBar";
import { RepoSidebar } from "../components/SideBar";
import { CodeBar } from "../components/CodeBar";
import { format } from "timeago.js";
import { FileIcon, getIconForFile } from "../lib/icon-map";
import { FileRow } from "../components/FileRow";
import { CodebaseViewer } from "../components/CodebaseViewer";
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
          <CodebaseViewer codeMetadata={codeMetadata} />
        </div>
        <div className="pl-4">
          <RepoSidebar repoMetadata={repoMetadata} />
        </div>
      </div>
    </div>
  );
}
