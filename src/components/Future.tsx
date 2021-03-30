import React from "react";
import { useStoreState } from "../store/globalStore";
import DepositModal from "./DepositModal";

// hooks and services

// components, styles and UI
import FutureStats from "./FutureStats";

// interfaces
export interface FutureProps {
  duration: number;
  futureID: number;
  futureAddress: string;
}

const Future: React.FunctionComponent<FutureProps> = ({
  duration,
  futureID,
  futureAddress,
}) => {
  const { currentToken } = useStoreState((state) => state);

  return (
    <div className="futures">
      <div className="interactions">
        <div className="token">
          <div
            className="token-image"
            style={{
              backgroundImage: `url(/assets/${currentToken}.png)`,
              backgroundSize: "cover",
            }}
          ></div>
          <div className="token-name">
            U-a{currentToken}-{duration}-{futureID}
          </div>
        </div>
        <div className="buttons">
          <DepositModal
            futureAddress={futureAddress}
            duration={duration}
            futureId={futureID}
          />
        </div>
      </div>

      <FutureStats futureAddress={futureAddress} />
    </div>
  );
};

export default Future;
