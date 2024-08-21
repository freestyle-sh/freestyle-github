import React from 'react';

export type ButtonStyle = "primary" | "secondary";

export type ButtonProps = {
  onClick?: () => void;
  style?: ButtonStyle;
  children: React.ReactNode;
};

export default function Button({ onClick, style = "primary", children }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${
        style === "primary"
          ? "bg-[#1f883d] hover:bg-[#358e4e] text-white"
          : "bg-gray-700 hover:bg-gray-600 active:opacity-80 border border-gray-600 text-white/75 py-1 px-4 text-xs font-medium"
      } rounded-lg flex flex-row gap-2 items-center justify-center transition duration-75`}
    >
      {children}
    </button>
  );
}