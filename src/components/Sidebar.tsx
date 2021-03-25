import React from "react";

// hooks and services

// components, styles and UI

// interfaces
export interface SidebarProps {}

const Sidebar: React.FunctionComponent<SidebarProps> = () => {
  return (
    <div className="sidebar">
      <div className="title">Unreal.Finance</div>
      <div className="links">
        <div className="link">Governance</div>
        <div className="link">Docs</div>
        <div className="link">Program</div>

        <div className="socials">
          <div className="social"></div>
          <div className="social"></div>
          <div className="social"></div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
