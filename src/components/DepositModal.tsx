import React, { useEffect, useState } from "react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import useContracts from "../hooks/useContracts";
import { ethers } from "ethers";
import { useStoreState } from "../store/globalStore";

// components, styles and UI

// interfaces
export interface DepositModalProps {
  currentToken: string;
  futureId: number;
  futureAddress: string;
  duration: number;
}

const DepositModal: React.FunctionComponent<DepositModalProps> = ({
  currentToken,
  futureId,
  futureAddress,
  duration,
}) => {
  const { account, shouldUpdate } = useStoreState((state) => state);

  const {
    subscribe,
    getUnderlyingAddress,
    getFutureRemainingTime,
    getShare,
    getUnderlyingBalance,
    getOTBalance,
    getYTBalance,
    getAllowanceLimit,
    approveFutureForSpending,
  } = useContracts();

  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState<number>(0);
  const [remaining, setRemaining] = useState(0);
  const [share, setShare] = useState("-.-");
  const [shareAmount, setShareAmount] = useState("-.-");
  const [OTbalance, setOTBalance] = useState("-.-");
  const [YTbalance, setYTBalance] = useState("-.-");
  const [underlyingBalance, setUnderlyingBalance] = useState("-.-");
  const [allowance, setAllowance] = useState(ethers.BigNumber.from("0"));

  const fetchData = async () => {
    setRemaining(await getFutureRemainingTime(futureAddress));
    let shares = await getShare(futureAddress);
    setShare(shares.percentage.toString());
    setShareAmount(ethers.utils.formatEther(shares.amount));

    setOTBalance(
      ethers.utils.formatEther(await getOTBalance(futureAddress, account))
    );
    setYTBalance(
      ethers.utils.formatEther(await getYTBalance(futureAddress, account))
    );
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

  const handleApprove = async () => {
    let underlying = getUnderlyingAddress();

    await approveFutureForSpending(
      underlying,
      futureAddress,
      ethers.utils.parseEther(amount.toString())
    );
  };

  const handleSubscribe = async () => {
    let underlying = getUnderlyingAddress();

    await subscribe(
      underlying,
      futureId,
      futureAddress,
      duration,
      ethers.utils.parseEther(amount.toString())
    );
  };

  const handleSubmit = async () => {
    if (allowance.gte(ethers.utils.parseEther(amount.toString()))) {
      await handleSubscribe();
    } else {
      await handleApprove();
    }
  };

  return (
    <>
      <div className="button sub" onClick={() => setOpen(true)}>
        subscribe
      </div>

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
              u-{currentToken}-{duration}-1
            </div>
          </div>
          <div className="card-container">
            <div className="card">
              <div className="content">
                <div className="title">Underlying balance</div>
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
                <div className="title">Yield token Balance</div>
                <div className="value">
                  {YTbalance.split(".")[0]}
                  <span className="decimals">
                    .{YTbalance.split(".")[1].slice(0, 6)}
                  </span>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="content">
                <div className="title">Ownership Token Balance</div>
                <div className="value">
                  {OTbalance.split(".")[0]}
                  <span className="decimals">
                    .{OTbalance.split(".")[1].slice(0, 6)}
                  </span>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="content">
                <div className="title">Yield Percentage</div>
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
                <div className="title">Time remaining</div>
                <div className="value">{remaining.toString()} blocks</div>
              </div>
            </div>
          </div>

          <div className="input-amount">
            <input
              type="number"
              placeholder="amount"
              value={amount.toString()}
              onChange={(e) => {
                if (e.target.value) {
                  setAmount(parseFloat(e.target.value));
                } else {
                  setAmount(0.0);
                }
              }}
            />
            <div className="submit-button" onClick={handleSubmit}>
              {allowance.gte(ethers.utils.parseEther(amount.toString()))
                ? "subscribe"
                : "approve"}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DepositModal;
