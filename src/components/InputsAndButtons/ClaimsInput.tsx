import { ethers } from "ethers";
import React from "react";
import useContracts from "../../hooks/useContracts";
import { useStoreState } from "../../store/globalStore";

// hooks and services

// components, styles and UI

// interfaces
export interface ClaimsInputProps {
  futureAddress: string;
  futureId: number;
  duration: number;
  maxOT: ethers.BigNumber;
  maxYT: string;
  cid: number;
}

const ClaimsInput: React.FunctionComponent<ClaimsInputProps> = ({
  futureAddress,
  futureId,
  duration,
  maxOT,
  maxYT,
  cid,
}) => {
  const { currentToken } = useStoreState((state) => state);
  const { unsubscribeAndWithdraw, harvestYield } = useContracts();

  //   const [amountOT, setAmountOT] = useState<number>(0);
  //   const [amountYT, setAmountYT] = useState<number>(0);

  const handleClaimOwnership = async () => {
    unsubscribeAndWithdraw(futureAddress, cid);
  };

  const handleClaimYield = async () => {
    harvestYield(futureAddress, cid);
  };

  return (
    <div className="claim-buttons">
      <div className="claim-amount">
        {/* <input
          type="number"
          placeholder="amount"
          value={amountOT.toString()}
          onChange={(e) => {
            if (e.target.value) {
              setAmountOT(parseFloat(e.target.value));
            } else {
              setAmountOT(0.0);
            }
          }}
        /> */}
        <span className="available">
          available: {ethers.utils.formatEther(maxOT.toString())} {currentToken}
        </span>
        <div
          className="submit-button text-transform-override "
          onClick={handleClaimOwnership}
        >
          CLAIM {currentToken}
        </div>
      </div>

      <div className="claim-amount">
        {/* <input
          type="number"
          placeholder="amount"
          value={amountYT.toString()}
          onChange={(e) => {
            if (e.target.value) {
              setAmountYT(parseFloat(e.target.value));
            } else {
              setAmountYT(0.0);
            }
          }}
        /> */}
        <span className="available">
          available: {maxYT} a{currentToken}
        </span>
        <div
          className="submit-button text-transform-override "
          onClick={handleClaimYield}
        >
          CLAIM a{currentToken}
        </div>
      </div>
    </div>
  );
};

export default ClaimsInput;
