import React, { useEffect, useState } from "react";
import useContracts from "../hooks/useContracts";
import { ethers } from "ethers";
import { useStoreState } from "../store/globalStore";

// hooks and services

// components, styles and UI

// interfaces
export interface FutureStatsProps {
  futureAddress: string;
}

const FutureStats: React.FunctionComponent<FutureStatsProps> = ({
  futureAddress,
}) => {
  const {
    getFutureExpired,
    getAtokenBalance,
    getTotalYield,
    getFutureRemainingTime,
    getShare,
  } = useContracts();

  const { shouldUpdate } = useStoreState((state) => state);

  const [expired, setExpired] = useState<boolean>(true);
  const [aTokenBalance, setATokenBalance] = useState<string>("-.-");
  const [yieldTotal, setYield] = useState("-.-");
  const [remaining, setRemaining] = useState(0);
  const [share, setShare] = useState("0");

  const fetchData = async () => {
    setExpired(await getFutureExpired(futureAddress));
    setATokenBalance(
      ethers.utils.formatEther(await getAtokenBalance(futureAddress))
    );

    setYield(ethers.utils.formatEther(await getTotalYield(futureAddress)));
    setRemaining(await getFutureRemainingTime(futureAddress));
    let shares = await getShare(futureAddress);
    setShare(shares.percentage);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [futureAddress]);

  useEffect(() => {
    shouldUpdate && fetchData();
    // eslint-disable-next-line
  }, [shouldUpdate]);

  return (
    <div className="stats">
      <div className="stat">
        <div className="title">status</div>
        <div className="value status">
          <div className={`dot ${expired ? "ended" : "live"}`} />
          {expired ? "ended" : "live"}
        </div>
      </div>

      <div className="stat">
        <div className="title">locked aDAI</div>
        <div className="value">
          {aTokenBalance.split(".")[0]}
          <span className="decimals">
            .{aTokenBalance.split(".")[1].slice(0, 6)}
          </span>
        </div>
      </div>

      <div className="stat">
        <div className="title">Total Yield</div>
        <div className="value">
          {yieldTotal.split(".")[0]}
          <span className="decimals">
            .{yieldTotal.split(".")[1].slice(0, 6)}
          </span>
        </div>
      </div>

      <div className="stat">
        <div className="title">Time Remaining</div>
        <div className="value">
          {Math.round(remaining / 5760).toString()} days
        </div>
      </div>

      <div className="stat">
        <div className="title">Pool Share</div>
        <div className="value">{share}%</div>
      </div>

      {/* <div className="stat">
        <div className="title right-align">contract</div>
        <div className="value">0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266</div>
      </div> */}
    </div>
  );
};

export default FutureStats;
