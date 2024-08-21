import type { RepoMetadata } from "../cloudstate/simple-repo";
import { RepoBar} from '../components/RepoBar';
// create require

// const { ThemeProvider } = await import('@primer/react');

export function RepoLayout(props: {
  repoMetadata: RepoMetadata;
}) {
  const { repoMetadata } = props;
  return (
    <div className="w-full flex flex-col">
      <RepoBar repoMetadata={repoMetadata}/>
      <div className="h-[0.5px] w-full bg-slate-700"/>
      <div>
        
        <p className="px-8 py-4 dark:text-white">
          {repoMetadata.description}
        </p>
      </div>
    </div>
  );
}
