import { MarkdownViewer } from "react-github-markdown";

export function Markdown(props: { value: string }) {
  return (
    <div
      slot="markdown-viewer"
      className="text-sm rounded-lg border border-[#30363d] w-100 overflow-ellipsis overflow-hidden mt-4"
    >
      <div className="px-4 py-3.5 border-b border-gray-700 flex flex-row justify-between items-center">
        <MarkdownViewer value={props.value} isDarkTheme />
      </div>
    </div>
  );
}
