import React, { useState } from "react";
import { ethers } from "ethers";

// hooks and services
import useContracts from "../../hooks/useContracts";
import { useStoreState } from "../../store/globalStore";
import Swal from "sweetalert2";

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
  const { account } = useStoreState((state) => state);

  const {
    subscribe,
    getUnderlyingAddress,
    approveFutureForSpending,
    getUnderlyingBalance,
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
    let underlyingBalance = await getUnderlyingBalance(account);
    let amountToSub = ethers.utils.parseEther(amount.toString());

    if (allowance.gte(ethers.utils.parseEther(amount.toString()))) {
      if (underlyingBalance.gte(amountToSub)) {
        await handleSubscribe();
      } else {
        Swal.fire(
          "Insufficient DAI balance",
          "please add some DAI or switch to an account which has more DAI than the requested amount",
          "error"
        );
      }
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
