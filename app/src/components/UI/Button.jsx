import React from "react";

function Button({ children, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={`my-2 block px-6 py-3 text-sm transition-colors duration-300 rounded shadow-md text-white bg-slate-500 hover:bg-slate-600 shadow-slate-400/30 ${
        className ? className : ""
      }`}
    >
      {children}
    </button>
  );
}

export default Button;
