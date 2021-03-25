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
    { value: "DAI", label: "DAI" },
    { value: "USDT", label: "USDT" },
    { value: "USDC", label: "USDC" },
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
      />
    </div>
  );
};

export default TokensTab;
