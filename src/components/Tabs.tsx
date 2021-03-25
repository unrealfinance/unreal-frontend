import React from "react";

// hooks and services

// components, styles and UI

// interfaces
export interface TabsProps {}

const Tabs: React.FunctionComponent<TabsProps> = () => {
  return (
    <div className="tabs">
      <div className="protocol active">
        <div className="icon"></div>
        <div className="name">AAVE</div>
      </div>
      <div className="protocol">
        <div className="icon"></div>
        <div className="name">Compound</div>
      </div>
    </div>
  );
};

export default Tabs;
