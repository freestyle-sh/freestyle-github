import React, { type FormEventHandler } from "react";

export type InputProps = {
  placeholder?: string;
  name?: string;
  value?: string;
  className?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: FormEventHandler<HTMLInputElement>;
  leadingIcon?: React.ReactNode;
};

const Input = (props: InputProps) => {
  return (
    <div className="relative flex items-center">
      {props.leadingIcon && (
        <div className="absolute left-3 text-gray-400">{props.leadingIcon}</div>
      )}
      <input
        type="text"
        placeholder={props.placeholder}
        value={props.value}
        onSubmit={props.onSubmit}
        name={props.name}
        onChange={props.onChange}
        className={
          "bg-transparent rounded-lg border border-[#30363d] text-sm py-1.5 pr-3 focus:outline-none focus:border-blue-500 " +
          (props.leadingIcon ? "pl-9" : "pl-3") +
          " " +
          props.className
        }
      />
    </div>
  );
};

export default Input;
