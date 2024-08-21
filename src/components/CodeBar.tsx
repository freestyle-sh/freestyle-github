import React from "react";
import Button from "./button";
import IconGitBranch from "./icons/GitBranch";
import IconCode from "./icons/Code";
export const CodeBar = () => {
  return (
    <div className="flex flex-row justify-between">
      <div className="flex flex-row space-x-2">
        <Button isDropdown>
          <IconGitBranch />
          main
        </Button>
        <Button style="icon">
          <IconGitBranch />
        </Button>
      </div>
      <div className="flex flex-row space-x-2">
        <input placeholder="Search files" className="bg-none " />
        <Button style="primary" isDropdown>
          <IconCode />
          Code
        </Button>
      </div>
    </div>
  );
};
