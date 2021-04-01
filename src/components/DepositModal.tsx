import React, { useEffect, useState } from "react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import useContracts from "../hooks/useContracts";
import { ethers } from "ethers";
import { useStoreState } from "../store/globalStore";
import SubscriptionsInput from "./InputsAndButtons/SubscriptionsInput";
import ClaimsInput from "./InputsAndButtons/ClaimsInput";

// components, styles and UI

// interfaces
export interface DepositModalProps {
  futureId: number;
  futureAddress: string;
  duration: number;
}

const DepositModal: React.FunctionComponent<DepositModalProps> = ({
  futureId,
  futureAddress,
  duration,
}) => {
  const { account, shouldUpdate, currentToken } = useStoreState(
    (state) => state
  );

  const {
    getFutureRemainingTime,
    getShare,
    getUnderlyingBalance,
    getOTBalance,
    getYTBalance,
    getAllowanceLimit,
    getFutureExpired,
    getTotalYield,
  } = useContracts();

  const [expired, setExpired] = useState<boolean>(true);
  const [open, setOpen] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const [share, setShare] = useState("-.-");
  const [shareAmount, setShareAmount] = useState("-.-");
  const [OTbalance, setOTBalance] = useState(ethers.BigNumber.from("0"));
  const [YTbalance, setYTBalance] = useState(ethers.BigNumber.from("0"));
  const [underlyingBalance, setUnderlyingBalance] = useState("-.-");
  const [allowance, setAllowance] = useState(ethers.BigNumber.from("0"));

  const fetchData = async () => {
    setRemaining(await getFutureRemainingTime(futureAddress));
    let shares = await getShare(futureAddress);
    setShare(shares.percentage);

    let totalYield = await getTotalYield(futureAddress);
    let userYield =
      (parseFloat(totalYield.toString()) * parseFloat(shares.percentage)) /
      10 ** 20;
    setShareAmount(userYield.toFixed(6));

    setExpired(await getFutureExpired(futureAddress));

    setOTBalance(await getOTBalance(futureAddress, account));
    setYTBalance(await getYTBalance(futureAddress, account));
    setUnderlyingBalance(
      ethers.utils.formatEther(await getUnderlyingBalance(account))
    );

    setAllowance(await getAllowanceLimit(account, futureAddress));
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
    <>
      {expired === false ? (
        <div className="button sub" onClick={() => setOpen(true)}>
          subscribe
        </div>
      ) : (
        <div className="button claim" onClick={() => setOpen(true)}>
          claim
        </div>
      )}

      <Modal
        classNames={{
          modal: "deposit-modal",
        }}
        open={open}
        onClose={() => setOpen(false)}
        center
        showCloseIcon={false}
      >
        <div className="header">
          <div className="title">Subscribe</div>
          <div className="sub-title">Receive UToken and UOS</div>
        </div>

        <div className="future-details">
          <div className="name">
            <div
              className="token-image"
              style={{
                backgroundImage: `url(/assets/${currentToken}.png)`,
                backgroundSize: "cover",
              }}
            ></div>
            <div>
              AAVE-{currentToken}-{duration}-days
            </div>
          </div>
          <div className="card-container">
            <div className="card">
              <div className="content">
                <div className="title">${currentToken} balance</div>
                <div className="value">
                  {underlyingBalance.split(".")[0]}
                  <span className="decimals">
                    .{underlyingBalance.split(".")[1].slice(0, 4)}
                  </span>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="content">
                <div className="title">UYT Balance</div>
                <div className="value">
                  {ethers.utils.formatEther(YTbalance).split(".")[0]}
                  <span className="decimals">
                    .
                    {ethers.utils
                      .formatEther(YTbalance)
                      .split(".")[1]
                      .slice(0, 6)}
                  </span>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="content">
                <div className="title">UOT Balance</div>
                <div className="value">
                  {ethers.utils.formatEther(OTbalance).split(".")[0]}
                  <span className="decimals">
                    .
                    {ethers.utils
                      .formatEther(OTbalance)
                      .split(".")[1]
                      .slice(0, 6)}
                  </span>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="content">
                <div className="title">Yield Share</div>
                <div className="value">{share}%</div>
              </div>
            </div>
            <div className="card">
              <div className="content">
                <div className="title">Your Yield (aDAI)</div>
                <div className="value">
                  {shareAmount.split(".")[0]}
                  <span className="decimals">
                    .{shareAmount.split(".")[1].slice(0, 6)}
                  </span>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="content">
                <div className="title">Expiry</div>
                <div className="value">
                  {Math.round(remaining / 5760).toString()} days
                </div>
              </div>
            </div>
          </div>

          {expired === false ? (
            <SubscriptionsInput
              futureAddress={futureAddress}
              duration={duration}
              futureId={futureId}
              allowance={allowance}
            />
          ) : (
            <ClaimsInput
              futureAddress={futureAddress}
              duration={duration}
              futureId={futureId}
              maxOT={OTbalance}
              maxYT={shareAmount}
            />
          )}
        </div>
      </Modal>
    </>
  );
};

export default DepositModal;
