import React from "react";

// hooks and services

// components, styles and UI

// interfaces
export interface FutureStatsProps {}

const FutureStats: React.FunctionComponent<FutureStatsProps> = () => {
  return (
    <div className="stats">
      <div className="stat">
        <div className="title">aDAI balance</div>
        <div className="value">1100</div>
      </div>

      <div className="stat">
        <div className="title">Total Yield</div>
        <div className="value">100</div>
      </div>

      <div className="stat">
        <div className="title">Time Remaining</div>
        <div className="value">28 days</div>
      </div>

      <div className="stat">
        <div className="title">Pool Share</div>
        <div className="value">6%</div>
      </div>

      {/* <div className="stat">
        <div className="title right-align">contract</div>
        <div className="value">0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266</div>
      </div> */}
    </div>
  );
};

export default FutureStats;
