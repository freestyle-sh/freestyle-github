import React from "react";
import IconTriangleDown from "./icons/TriangleDown";

export type ButtonStyle = "primary" | "secondary" | "icon";
export type ButtonSpacing = "compact" | "normal";

export type ButtonProps = {
  onClick?: () => void | Promise<void>;
  disabled?: boolean;
  style?: ButtonStyle;
  spacing?: ButtonSpacing;
  dropdown?: boolean;
  type?: "button" | "submit" | "reset";
  children: React.ReactNode;
};

export default function Button({
  onClick,
  disabled = false,
  style = "secondary",
  spacing = "normal",
  type = "button",
  dropdown = false,
  children,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`${
        style === "primary"
          ? "bg-[#1f883d] border border-[#2a4e33] enabled:hover:bg-[#358e4e] enabled:active:bg-[#225630] disabled:bg-[#27412c] text-white disabled:text-white/50"
          : style === "secondary"
            ? "bg-[#21262d] enabled:hover:bg-[#292e36] enabled:active:opacity-80 border border-[#30363d] text-white/75 disabled:bg-transparent disabled:text-white/35"
            : "bg-transparent enabled:hover:bg-[#21262d] enabled:active:bg-[#21262d] text-white/75"
      } ${
        spacing === "compact"
          ? "py-1 px-4 text-xs font-medium gap-2"
          : "py-1.5 px-4 text-sm font-medium gap-2"
      } ${dropdown ? "pr-3" : ""} rounded-lg flex flex-row items-center justify-center transition duration-75 disabled:cursor-default`}
    >
      {children}
      {dropdown && <IconTriangleDown />}
    </button>
  );
}
