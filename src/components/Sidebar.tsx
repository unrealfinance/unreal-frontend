import React from "react";

// hooks and services

// components, styles and UI

// interfaces
export interface SidebarProps {}

const Sidebar: React.FunctionComponent<SidebarProps> = () => {
  return (
    <div className="sidebar">
      <div className="title">
        <img alt="token" src="/assets/unreal-logo.png" width="150" />
      </div>
      <div className="links">
        <div className="link tooltip">
          <span className="tooltiptext">Coming Soon</span>Governance
        </div>
        <br />
        <div className="link tooltip">
          <span className="tooltiptext">Coming Soon</span>Docs
        </div>
        <br />
        <div className="link tooltip">
          <span className="tooltiptext">Coming Soon</span>Program
        </div>

        <div className="socials">
          <div
            className="social"
            style={{
              backgroundImage: `url(/assets/twitter.png)`,
              backgroundSize: "cover",
            }}
            onClick={() => window.open("https://twitter.com/UnrealFinance")}
          />

          <div
            className="social"
            style={{
              backgroundImage: `url(/assets/telegram.png)`,
              backgroundSize: "cover",
            }}
            onClick={() => window.open("https://t.me/unrealfinance")}
          />

          <div
            className="social"
            style={{
              backgroundImage: `url(/assets/medium.png)`,
              backgroundSize: "cover",
            }}
            onClick={() => window.open("https://unrealfinance.medium.com/")}
          />

          <div
            className="social"
            style={{
              backgroundImage: `url(/assets/reddit.png)`,
              backgroundSize: "cover",
            }}
            onClick={() =>
              window.open("https://www.reddit.com/r/unrealfinance/")
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
