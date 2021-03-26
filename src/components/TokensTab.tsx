import React from "react";

// hooks and services
import Select from "react-select";
import { useStoreActions } from "../store/globalStore";

// components, styles and UI

// interfaces
export interface TokensTabProps {}

const TokensTab: React.FunctionComponent<TokensTabProps> = () => {
  const { setCurrentToken } = useStoreActions((action) => action);

  const customStyles = {
    control: (base: any, state: any) => ({
      ...base,
      padding: "0.3rem 0.8rem",
      width: "14rem",
      background: "#2e3449",
      borderRadius: 6,
      borderColor: state.isFocused ? null : null,
      boxShadow: state.isFocused ? null : null,
    }),
    option: (base: any, state: any) => ({
      ...base,
      color: "#f4f6fc",
      padding: "1rem",
      background: state.isSelected ? "#9194a3" : null,
      "&:hover": {
        background: "#9194a3",
      },
    }),
    menuList: (base: any) => ({
      ...base,
      background: "#2e3449",
    }),
    singleValue: (base: any) => ({
      ...base,
      color: "#f4f6fc",
    }),
  };

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
        options={options}
        placeholder="select token"
        defaultValue={options[0]}
        styles={customStyles}
        onChange={(e: any) => setCurrentToken(e.value)}
        isSearchable={false}
      />
    </div>
  );
};

export default TokensTab;
