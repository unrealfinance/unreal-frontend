import React from "react";
import { useStoreActions, useStoreState } from "../store/globalStore";

// hooks and services

// components, styles and UI

// interfaces
export interface ProtocolTabsProps {}

const ProtocolTabs: React.FunctionComponent<ProtocolTabsProps> = () => {
  const { currentProtocol } = useStoreState((state) => state);
  const { setCurrentProtocol } = useStoreActions((action) => action);

  return (
    <div className="tabs">
      <div
        className={`protocol ${currentProtocol === "AAVE" && "active"}`}
        onClick={() => setCurrentProtocol("AAVE")}
      >
        <div
          className="icon"
          style={{
            backgroundImage: `url(/assets/aave-logo.png)`,
            backgroundSize: "cover",
          }}
        ></div>
        <div className="name">AAVE</div>
      </div>
      <div
        className={`protocol ${currentProtocol === "COMP" && "active"}`}
        // onClick={() => setCurrentProtocol("COMP")}
      >
        <div
          className="icon"
          style={{
            backgroundImage: `url(/assets/compound-logo.png)`,
            backgroundSize: "cover",
          }}
        ></div>
        <div className="name tooltip">
          Compound
          <span className="tooltiptext">Coming Soon</span>
        </div>
      </div>
    </div>
  );
};

export default ProtocolTabs;
