import React from "react";
import { useStoreState } from "../store/globalStore";
import DepositModal from "./DepositModal";
import FutureStats from "./FutureStats";

// hooks and services

// components, styles and UI

// interfaces
export interface FutureProps {
  days: number;
  futureID: number;
  status: string;
}

const Future: React.FunctionComponent<FutureProps> = ({
  days,
  futureID,
  status,
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
            U-a{currentToken}-{days}-1
          </div>
        </div>
        <div className="buttons">
          <DepositModal
            currentToken={currentToken}
            days={days}
            futureId={futureID}
          />
        </div>
      </div>

      <FutureStats status={status} />
    </div>
  );
};

export default Future;
