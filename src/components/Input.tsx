import React from "react";

export type InputProps = {
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  leadingIcon?: React.ReactNode;
};

const Input = (props: InputProps) => {
  return (
    <div className="relative flex items-center">
      {props.leadingIcon && (
        <div className="absolute left-3 text-gray-400">{props.leadingIcon}</div>
      )}
      <input
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        className="bg-transparent rounded-lg border border-[#30363d] pl-9 text-sm py-2 pr-3 w-full focus:outline-none focus:border-blue-500"
      />
    </div>
  );
};

export default Input;
