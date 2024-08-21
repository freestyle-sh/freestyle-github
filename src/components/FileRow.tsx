import { format } from "timeago.js";
import type { FileMetadata } from "../cloudstate/simple-repo";
import { FileIcon } from "../lib/icon-map";
import IconFileDirectory from "./icons/FileDirectory";
import IconFile from "./icons/File";

export const FileRow = (props: {
  fileMetadata: FileMetadata & {
    path: string;
  };
  isLast?: boolean;
}) => {
  const {
    fileMetadata: file,
    fileMetadata: { path },
  } = props;
  const isLast = props.isLast ?? false;

  return (
    <div
      key={path}
      className={
        (isLast ? "border-b" : "") +
        " p-2 border-gray-700 grid grid-cols-[2fr,1fr,1fr] hover:bg-[#151b23]"
      }
    >
      <div className="text-gray-400 w-full flex flex-row items-center ">
        {file.fileType === "dir" ? (
          <IconFileDirectory isFilled />
        ) : (
          <IconFile />
        )}
        <span>{path}</span>
      </div>
      <div className="text-xs text-gray-400 text-nowrap overflow-ellipsis overflow-hidden items-center flex">
        {file.lastestCommitMessage}
      </div>
      <div className="text-xs text-gray-400 text-end w-full flex flex-row items-center justify-end">
        {format(file.lastestCommitDate)}
      </div>
    </div>
  );
};
