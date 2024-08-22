import React from "react";
import Button from "./Button";
import IconGitBranch from "./icons/GitBranch";
import IconCode from "./icons/Code";
import Input from "./Input";
import IconSearch from "./icons/Search";
export const CodeBar = () => {
  const [fileQuery, setFileQuery] = React.useState("");

  return (
    <div className="flex flex-row justify-between gap-4">
      <div className="flex flex-row space-x-2">
        <Button dropdown>
          <IconGitBranch />
          main
        </Button>
        <Button style="icon">
          <IconGitBranch />
        </Button>
      </div>
      <div className="flex flex-row space-x-2">
        <Input
          leadingIcon={<IconSearch />}
          placeholder="Go to file"
          value={fileQuery}
          onChange={(e) => setFileQuery(e.target.value)}
        />
        <Button style="primary" dropdown>
          <IconCode />
          Code
        </Button>
      </div>
    </div>
  );
};
