import type { FileMetadata } from "../cloudstate/simple-repo";
import React from "react";
import { FolderIcon } from "../components/icons/Folder";

export const IconMap: {
  [ext: string]: {
    icon: string;
  };
} = {
  ts: {
    icon: "devicon-typescript-plain",
  },
  js: {
    icon: "devicon-javascript-plain",
  },
  jsx: {
    icon: "devicon-react-original",
  },
  tsx: {
    icon: "devicon-react-original",
  },
  json: {
    icon: "devicon-json-plain",
  },
  py: {
    icon: "devicon-python-plain",
  },
  go: {
    icon: "devicon-go-plain",
  },
  java: {
    icon: "devicon-java-plain",
  },
  c: {
    icon: "devicon-c-plain",
  },
  cpp: {
    icon: "devicon-cplusplus-plain",
  },
  h: {
    icon: "devicon-c-plain",
  },
  css: {
    icon: "devicon-css3-plain",
  },
  scss: {
    icon: "devicon-sass-original",
  },
  sass: {
    icon: "devicon-sass-original",
  },
  npmrc: {
    icon: "devicon-npm-original-wordmark",
  },
  dockerfile: {
    icon: "devicon-docker-plain",
  },
  yml: {
    icon: "devicon-yaml-plain",
  },
  yaml: {
    icon: "devicon-yaml-plain",
  },
  rs: {
    icon: "devicon-rust-original",
  },
  dart: {
    icon: "devicon-dart-plain",
  },
  astro: {
    icon: "devicon-astro-original",
  },
};

export function getIconForFile(path: string) {
  const ext = path.split(".").pop();
  if (ext) {
    return IconMap[ext]?.icon;
  }
}

export const FileIcon = (props: {
  metadata: FileMetadata & {
    path: string;
  };
}) => {
  if (props.metadata.fileType === "dir") {
    return <FolderIcon />;
  }
  if (getIconForFile(props.metadata.path)) {
    return (
      <i
        className={getIconForFile(props.metadata.path) + " colored block mr-2"}
      />
    );
  }
  return <></>;
};
