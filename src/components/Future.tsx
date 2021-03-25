import React from "react";
import FutureStats from "./FutureStats";

// hooks and services

// components, styles and UI

// interfaces
export interface FutureProps {}

const Future: React.FunctionComponent<FutureProps> = () => {
  return (
    <div className="futures">
      <div className="interactions">
        <div className="token">
          <div className="token-image"></div>
          <div className="token-name">U-aDAI-30-1</div>
        </div>
        <div className="buttons">
          <div className="button sub">subscribe</div>
          {/* <div className="button unsub">unsubscribe</div> */}
        </div>
      </div>

      <FutureStats />
    </div>
  );
};

export default Future;
