import React from "react";
import { useStoreState } from "../store/globalStore";
import Future from "./Future";

// hooks and services

// components, styles and UI

// interfaces
export interface FutureContainerProps {}

const FutureContainer: React.FunctionComponent<FutureContainerProps> = () => {
  const { currentToken } = useStoreState((state) => state);

  return (
    <div className="futures-container">
      {currentToken === "DAI" ? (
        <>
          <Future days={7} futureID={0} status={"live"} />
          <Future days={30} futureID={1} status={"ended"} />
        </>
      ) : (
        <div className="coming-soon">{currentToken} futures coming soon...</div>
      )}
    </div>
  );
};

export default FutureContainer;
