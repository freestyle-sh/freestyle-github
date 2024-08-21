import type { CodebaseMetadata, RepoMetadata } from "../cloudstate/simple-repo";
import { RepoBar } from "../components/RepoBar";
import { RepoSidebar } from "../components/SideBar";
import { CodeBar } from "../components/CodeBar";

// const { ThemeProvider } = await import('@primer/react');

export function RepoLayout(props: {
  repoMetadata: RepoMetadata;
  codeMetadata: CodebaseMetadata
}) {
  const { repoMetadata } = props;

  return (
    <div className="w-full flex flex-col">
      <RepoBar repoMetadata={repoMetadata} />
      <div className="grid grid-cols-[2fr,1fr] w-full h-full px-8 py-4">
        <div className="pr-4">
          <CodeBar />
          <div className="mt-4"/>
          <div className="rounded-lg border border-[#30363d] overflow-hidden">
            <div className="bg-[#161b22] p-2 border-b border-gray-700">
            This is testing colors and what not
            </div>
            <div className="px-4 py-2">
              File 1
            </div>

          </div>
        </div>
        <div className="pl-4">
          <RepoSidebar repoMetadata={repoMetadata} />
        </div>
      </div>
    </div>
  );
}
