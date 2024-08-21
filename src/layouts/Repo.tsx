import type { RepoMetadata } from "../cloudstate/simple-repo";

// create require


// const { ThemeProvider } = await import('@primer/react');


export function RepoLayout(props: {
  repoMetadata: RepoMetadata;
}) {
  const { repoMetadata } = props;
  return <div className="px-8 py-4">
        <h1 className="dark:text-white text-xl font-semibold">
          {repoMetadata.name}
        </h1>
        <br />
      </div>
}