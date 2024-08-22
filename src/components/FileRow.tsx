import { format } from "timeago.js";
import type { FileMetadata } from "../cloudstate/simple-repo";
import IconFileDirectory from "./icons/FileDirectory";
import IconFile from "./icons/File";

export const FileRow = (props: {
  fileMetadata: FileMetadata & {
    path: string;
  };
}) => {
    
  const {
    fileMetadata: file,
    fileMetadata: { path },
  } = props;

  return (
    <div
      key={path}
      className={
        "text-sm px-4 py-3 border-b border-gray-700 last:border-0 grid grid-cols-[1fr,auto] md:grid-cols-[1fr,1fr,auto] gap-10 hover:bg-[#151b23]"
      }
    >
      <div className="text-gray-400 w-full flex items-center overflow-hidden shrink-0 gap-2">
        {file.fileType === "dir" ? (
          <IconFileDirectory isFilled />
        ) : (
          <IconFile />
        )}
        <span className="text-gray-100 truncate hover:text-blue-500 hover:underline cursor-pointer">
          {path}
        </span>
      </div>
      <div className="text-gray-400 items-center overflow-hidden truncate hidden md:block hover:text-blue-500 hover:underline cursor-pointer">
        {file.lastestCommitMessage}
      </div>
      <div className="text-gray-400 flex items-center justify-end overflow-hidden truncate">
        {format(file.lastestCommitDate)}
      </div>
    </div>
  );
};
