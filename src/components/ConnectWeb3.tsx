import React from "react";
import Web3Modal from "web3modal";
import Web3 from "web3";
import { useStoreActions, useStoreState } from "../store/globalStore";
import makeBlockie from "ethereum-blockies-base64";

export interface ConnectWeb3Props {}

const ConnectWeb3: React.FunctionComponent<ConnectWeb3Props> = () => {
  const { setAccount, setNetwork, setWeb3, setConnected } = useStoreActions(
    (actions) => actions
  );

  const { web3, connected, account, network } = useStoreState((state) => state);

  let providerOptions = {};

  const web3Modal = new Web3Modal({
    cacheProvider: true,
    providerOptions,
  });

  const resetApp = async () => {
    if (web3 && web3.currentProvider && web3.currentProvider.close) {
      await web3.currentProvider.close();
    }
    await web3Modal.clearCachedProvider();
    setAccount("");
    setWeb3(null);
    setNetwork("");
    setConnected(false);
  };

  const subscribeProvider = async (provider: any) => {
    if (!provider.on) {
      return;
    }
    provider.on("close", () => resetApp());
    provider.on("accountsChanged", async (accounts: string[]) => {
      await setAccount(accounts[0]);
    });
    provider.on("networkChanged", async (network: any) => {});
  };

  const onConnect = async () => {
    const provider = await web3Modal.connect();
    await subscribeProvider(provider);
    const web3: any = new Web3(provider);

    const accounts = await web3.eth.getAccounts();
    const address = accounts[0];
    const network = await web3.eth.net.getNetworkType();

    await setWeb3(web3);
    await setAccount(address);
    await setNetwork(network);
    await setConnected(true);
  };

  return (
    <div className="connect-web3">
      <div className="account-info">
        {network && "(" + network + ")"} {account}{" "}
      </div>
      {/* <div>{account && <img src={makeBlockie(account)} height="30px" />}</div> */}
      <div
        className="connect-button"
        onClick={connected ? resetApp : onConnect}
      >
        {connected ? "disconnect" : "connect wallet"}
      </div>
    </div>
  );
};

export default ConnectWeb3;
