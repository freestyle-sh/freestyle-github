import React from "react";
import IconTriangleDown from "./icons/TriangleDown";

export type ButtonStyle = "primary" | "secondary" | "icon";
export type ButtonSpacing = "compact" | "normal";

export type ButtonProps = {
  onClick?: () => void;
  style?: ButtonStyle;
  spacing?: ButtonSpacing;
  isDropdown?: boolean;
  children: React.ReactNode;
};

export default function Button({
  onClick,
  style = "secondary",
  spacing = "normal",
  isDropdown = false,
  children,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${
        style === "primary"
          ? "bg-[#1f883d] hover:bg-[#358e4e] text-white"
          : style === "secondary"
            ? "bg-[#21262d] hover:bg-[#292e36] active:opacity-80 border border-[#30363d] text-white/75"
            : "bg-transparent hover:bg-[#21262d] active:bg-[#21262d] text-white/75"
      } ${
        spacing === "compact"
          ? "py-1 px-4 text-xs font-medium gap-2"
          : "py-2 px-4 text-sm font-medium gap-2"
      } rounded-lg flex flex-row items-center justify-center transition duration-75 ${isDropdown ? "pr-3" : ""}`}
    >
      {children}
      {isDropdown && <IconTriangleDown />}
    </button>
  );
}
