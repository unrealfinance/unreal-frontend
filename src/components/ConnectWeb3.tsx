import React, { useEffect } from "react";
import Web3Modal from "web3modal";
import Web3 from "web3";
import { useStoreActions, useStoreState } from "../store/globalStore";
import makeBlockie from "ethereum-blockies-base64";
import Authereum from "authereum";
import WalletConnectProvider from "@walletconnect/web3-provider";

const ConnectWeb3: React.FunctionComponent = () => {
  const { setAccount, setNetwork, setWeb3, setConnected } = useStoreActions(
    (actions) => actions
  );

  const { web3, connected, account, network } = useStoreState((state) => state);

  let providerOptions = {
    metamask: {
      id: "injected",
      name: "MetaMask",
      type: "injected",
      check: "isMetaMask",
      package: null,
    },
    authereum: {
      package: Authereum,
    },
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: "INFURA_ID",
        network: "rinkeby",
        qrcodeModalOptions: {
          mobileLinks: [
            "rainbow",
            "metamask",
            "argent",
            "trust",
            "imtoken",
            "pillar",
          ],
        },
      },
    },
  };

  const web3Modal = new Web3Modal({
    cacheProvider: true,
    providerOptions,
    theme: "dark",
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
    provider.on("networkChanged", async (x: any) => {
      const web3: any = new Web3(provider);
      const network = await web3.eth.net.getNetworkType();
      await setNetwork(network);
    });
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

  useEffect(() => {
    onConnect();
    //eslint-disable-next-line
  }, []);

  return (
    <div className="connect-web3">
      <div className="account-info">
        {network && "(" + network + ")"} {account.slice(0, 6)}
        {account && "......"}
        {account.slice(38, 42)}
      </div>
      {account && (
        <img
          src={makeBlockie(account)}
          height="35rem"
          className="account-blockie"
          alt="blockie"
        />
      )}
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
