import type { RepoMetadata } from "../cloudstate/simple-repo";

// create require

// const { ThemeProvider } = await import('@primer/react');

export function RepoLayout(props: {
  repoMetadata: RepoMetadata;
}) {
  const { repoMetadata } = props;
  return (
    <div className="w-full">
      <div className="px-8 py-4">
        <div className="flex flex-row justify-between">
          <h1 className="dark:text-white text-xl font-semibold">
            {repoMetadata.name}
          </h1>
          <div className="flex flex-row space-x-2">
            <button>
              Fork
            </button>
            <button>
              Star
            </button>
          </div>
        </div>
      </div>
      <br className="h-[0.5px] w-full bg-white"/>
      <div>
        <p className="px-8 py-4 dark:text-white">
          {repoMetadata.description}
        </p>
      </div>
    </div>
  );
}
