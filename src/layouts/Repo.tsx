import type { RepoMetadata } from "../cloudstate/simple-repo";
import { RepoBar } from "../components/RepoBar";
import { RepoSidebar } from "../components/SideBar";
import { CodeBar } from "../components/CodeBar";

// const { ThemeProvider } = await import('@primer/react');

export function RepoLayout(props: {
  repoMetadata: RepoMetadata;
}) {
  const { repoMetadata } = props;

  return (
    <div className="w-full flex flex-col">
      <RepoBar repoMetadata={repoMetadata} />
      <div className="grid grid-cols-[2fr,1fr] w-full h-full px-8 py-4">
        <div className="pr-4">
          <CodeBar />
        </div>
        <div className="pl-4">
          <RepoSidebar repoMetadata={repoMetadata} />
        </div>
      </div>
    </div>
  );
}
