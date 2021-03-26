import React from "react";

// hooks and services
import Select from "react-select";
import { useStoreActions } from "../store/globalStore";

// components, styles and UI

// interfaces
export interface TokensTabProps {}

const TokensTab: React.FunctionComponent<TokensTabProps> = () => {
  const { setCurrentToken } = useStoreActions((action) => action);

  const options = [
    {
      value: "DAI",
      label: (
        <div className="select-div">
          <img alt="token" src="/assets/DAI.png" width="20px" /> <div>DAI</div>
        </div>
      ),
    },
    {
      value: "USDC",
      label: (
        <div className="select-div">
          <img alt="token" src="/assets/USDC.png" width="20px" />
          <div>USDC</div>
        </div>
      ),
    },
    {
      value: "USDT",
      label: (
        <div className="select-div">
          <img alt="token" src="/assets/USDT.png" width="20px" />
          <div>USDT</div>
        </div>
      ),
    },
  ];

  return (
    <div className="tokens-tab">
      <div className="title">Available futures :</div>
      <Select
        className="token"
        options={options}
        placeholder="select token"
        defaultValue={options[0]}
        onChange={(e: any) => setCurrentToken(e.value)}
        isSearchable={false}
      />
    </div>
  );
};

export default TokensTab;
