import React from "react";
import Button from "./button";
import IconGitBranch from "./icons/GitBranch";
import IconCode from "./icons/Code";
import Input from "./Input";
import IconSearch from "./icons/Search";
export const CodeBar = () => {
  const [fileQuery, setFileQuery] = React.useState("");

  return (
    <div className="flex flex-row justify-between gap-4">
      <div className="flex flex-row space-x-2">
        <Button isDropdown>
          <IconGitBranch />
          main
        </Button>
        <div className="hidden sm:block">
        <Button style="icon" >
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
        <Button style="primary" isDropdown>
          <IconCode />
          Code
        </Button>
      </div>
    </div>
  );
};
