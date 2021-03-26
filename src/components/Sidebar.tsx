import React from "react";

// hooks and services

// components, styles and UI

// interfaces
export interface SidebarProps {}

const Sidebar: React.FunctionComponent<SidebarProps> = () => {
  return (
    <div className="sidebar">
      <div className="title">
        <img alt="token" src="/assets/unreal-logo.png" width="180" />
      </div>
      <div className="links">
        <div className="link">Governance</div>
        <div className="link">Docs</div>
        <div className="link">Program</div>

        <div className="socials">
          <div
            className="social"
            style={{
              backgroundImage: `url(/assets/twitter.png)`,
              backgroundSize: "cover",
            }}
          ></div>
          <div
            className="social"
            style={{
              backgroundImage: `url(/assets/telegram.png)`,
              backgroundSize: "cover",
            }}
          ></div>
          <div
            className="social"
            style={{
              backgroundImage: `url(/assets/medium.png)`,
              backgroundSize: "cover",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
