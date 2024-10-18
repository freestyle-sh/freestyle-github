import React, { useEffect } from "react";
import Button from "./Button";
import Input from "./Input";
import { useCloud } from "freestyle-sh";
import type { RepoIndex } from "../cloudstate/simple-repo";
import Avatar from "./Avatar";
import IconInfo from "./icons/Info";
import { useCloudQuery } from "freestyle-sh/react";
import type { AuthCS } from "../cloudstate/auth";

export const CreateRepo = (props: { nameInspo: string }) => {
  const [repoName, setRepoName] = React.useState("");
  const [repoDescription, setRepoDescription] = React.useState("");
  const [isFormValid, setIsFormValid] = React.useState(false);

  useEffect(() => {
    if (repoName !== "") {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [repoName]);

  const auth = useCloud<typeof AuthCS>("auth");
  const { data: user } = useCloudQuery(auth.getUserInfo);

  return (
    <div className="py-8 px-4 flex flex-row justify-center items-center w-full text-gray-100 text-sm">
      <form
        className="flex flex-col mx-8 sm:max-w-[50%]"
        onSubmit={async (e) => {
          e.preventDefault();
          if (isFormValid) {
            await useCloud<typeof RepoIndex>("repo-index")
              .createRepo({
                name: repoName,
                description: repoDescription,
              })
              .then((repoId) => {
                window.location.href = `/${user?.username}/${repoName}`;
              });
          }
        }}
      >
        <h1 className="text-2xl font-semibold">Create a new repository</h1>
        <p className="text-[#8d96a0] mt-1">
          A repository contains all project files, including the revision
          history. We manage them with our own implemenatation of Git, written
          100% in TypeScript and{" "}
          <a
            className="text-blue-500 underline hover:opacity-90"
            href="https://freestyle.sh"
          >
            Freestyle
          </a>{" "}
          on the backend.
        </p>
        <div className="border-b w-full border-white/10 my-2.5" />
        <p className="text-sm italic mb-8">
          Required fields are marked with an asterisk (*).
        </p>
        <div className="flex flex-row items-end gap-2">
          <label>
            <h2 className="font-semibold mb-1">Owner *</h2>
            <Button style="secondary" spacing="normal" dropdown>
              <Avatar
                src="https://avatars.githubusercontent.com/u/7749131?v=4"
                alt=""
              />
              {user?.username}
            </Button>
          </label>
          <p className="text-[1.75rem] font-light mb-2">/</p>
          <label>
            <h2 className="font-semibold mb-1">Repository Name *</h2>
            <Input
              onChange={(e) => setRepoName(e.target.value)}
              name="repoName"
              value={repoName}
              placeholder=""
            />
          </label>
        </div>
        <p className="mt-4 mb-6">
          Great repository names are short and memorable. Need inspiration? How
          about{" "}
          <button
            className="text-green-500 font-bold hover:opacity-90"
            onClick={(e) => {
              e.preventDefault();
              setRepoName(props.nameInspo);
            }}
          >
            {props.nameInspo}
          </button>{" "}
          ?
        </p>
        <label className="mb-1.5">
          <h2 className="font-semibold mb-1">
            Description{" "}
            <span className="text-[#8d96a0] text-xs">(optional)</span>
          </h2>
          <Input
            className="w-full"
            onChange={(e) => setRepoDescription(e.target.value)}
            onSubmit={(e) => {}}
            name="repoDescription"
            placeholder=""
          />
        </label>
        <div className="border-b w-full border-white/10 my-3.5" />
        <div className="flex flex-row items-center gap-2 text-[#8d96a0] my-0.5">
          <IconInfo />
          <p>You are creating a public repository in your personal account.</p>
        </div>
        <div className="border-b w-full border-white/10 my-3.5" />
        <Button style="primary" type="submit" disabled={!isFormValid}>
          Create Repository
        </Button>
      </form>
    </div>
  );
};
