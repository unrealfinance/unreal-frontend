import React from "react";
import Future from "./Future";

// hooks and services

// components, styles and UI

// interfaces
export interface FutureContainerProps {}

const FutureContainer: React.FunctionComponent<FutureContainerProps> = () => {
  return (
    <div className="futures-container">
      <Future />
      <Future />
      <Future />
    </div>
  );
};

export default FutureContainer;
