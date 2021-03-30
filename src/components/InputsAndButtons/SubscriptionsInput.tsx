import React, { useState } from "react";
import { ethers } from "ethers";

// hooks and services
import useContracts from "../../hooks/useContracts";

// components, styles and UI

// interfaces
export interface SubscriptionsInputProps {
  futureAddress: string;
  futureId: number;
  duration: number;
  allowance: ethers.BigNumber;
}

const SubscriptionsInput: React.FunctionComponent<SubscriptionsInputProps> = ({
  futureAddress,
  futureId,
  duration,
  allowance,
}) => {
  const {
    subscribe,
    getUnderlyingAddress,
    approveFutureForSpending,
  } = useContracts();

  const [amount, setAmount] = useState<number>(0);

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
      duration * 5760,
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
  );
};

export default SubscriptionsInput;
