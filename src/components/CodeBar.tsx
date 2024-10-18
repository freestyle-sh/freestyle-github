import React from "react";
import Button from "./Button";
import IconGitBranch from "./icons/GitBranch";
import IconCode from "./Code";
import Input from "./Input";
import IconSearch from "./icons/Search";
import type { RepoMetadata } from "../cloudstate/simple-repo";
import IconCopy from "./icons/Copy";
import { toast, Toaster } from "sonner";
export const CodeBar = (props: { repoMetadata: RepoMetadata }) => {
  const [fileQuery, setFileQuery] = React.useState("");
  const [isCodeDropdownOpen, setIsCodeDropdownOpen] = React.useState(false);
  return (
    <div className="flex flex-row justify-between gap-4">
      <div className="flex flex-row space-x-2">
        <Button dropdown>
          <IconGitBranch />
          main
        </Button>
        <div className="hidden sm:block">
          <Button style="icon">
            <IconGitBranch />
          </Button>
        </div>
      </div>
      <div className="flex flex-row space-x-2">
        <div className="hidden sm:block">
          <Input
            leadingIcon={<IconSearch />}
            placeholder="Go to file"
            value={fileQuery}
            onChange={(e) => setFileQuery(e.target.value)}
          />
        </div>
        <div className="relative">
          <Button
            style="primary"
            dropdown
            onClick={() => {
              setIsCodeDropdownOpen(!isCodeDropdownOpen);
            }}
          >
            <IconCode size={16} />
            Code
          </Button>
          {isCodeDropdownOpen && (
            <div className="absolute z-50 top-full right-0 bg-[#151b23] h-32 rounded-lg mt-1 border border-[#30363d] flex flex-col p-4">
              <div className="text-md font-bold flex flex-row items-center">
                <IconCode size={16} /> <span className="ml-2">Clone</span>
              </div>
              <div className="flex flex-row h-10 my-2">
                <div className="whitespace-nowrap p-2 rounded-lg border border-[#30363d] select-all h-full">
                  git clone http://{window.location.host}/git/repos/{props.repoMetadata.owner}/{props
                    .repoMetadata.name}
                </div>
                <button className="ml-2 px-2 rounded-lg hover:bg-[#2a2f36] transition duration-75 h-10 w-10" onClick={()=>{
                  navigator.clipboard.writeText(`git clone http://${window.location.host}/git/repos/${props.repoMetadata.owner}/${props.repoMetadata.name}`)
                  toast("Copied to clipboard", {
                    style: {
                      backgroundColor: "#2a2f36",
                      color: "#fff",
                      borderColor: "#30363d",
                    }
                  })
                }}>
                  <IconCopy />
                </button>
              </div>
              <div>
                <div className="text-gray-400">Clone using the web URL.</div>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
