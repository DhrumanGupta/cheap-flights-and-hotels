import React from "react";

function Card({ children, className }) {
  return (
    <div
      className={`bg-slate-800 shadow rounded lg:w-1/3  md:w-1/2 w-full p-10 ${className} `}
    >
      {children}
    </div>
  );
}

export default Card;
