import React from "react";

const InputBox = ({ name, placeholder, type, id, value, className }) => {
  return (
    <div className="relative w-full">
      <input
        type={type}
        placeholder={placeholder}
        id={id}
        name={name}
        defaultValue={value}
        className={` border-2 w-full rounded-xl pl-10 py-2`}
      />
      <i className={`absolute left-4 top-3 ${className}`}></i>
    </div>
  );
};

export default InputBox;
