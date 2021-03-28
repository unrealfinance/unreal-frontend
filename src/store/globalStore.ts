import { Action, action, createTypedHooks } from "easy-peasy";
import { Signer } from "ethers";

export interface IGlobalStore {
  web3: any;
  signer: Signer | "";
  account: string;
  network: string;
  connected: boolean;
  shouldUpdate: boolean;
  currentProtocol: "AAVE" | "COMP";
  currentToken: "DAI" | "USDT" | "USDC";
  onlySubscribed: boolean;

  // actions
  setWeb3: Action<IGlobalStore, any>;
  setSigner: Action<IGlobalStore, Signer | string>;
  setAccount: Action<IGlobalStore, string>;
  setNetwork: Action<IGlobalStore, string>;
  setConnected: Action<IGlobalStore, boolean>;
  setShouldUpdate: Action<IGlobalStore, boolean>;
  setCurrentProtocol: Action<IGlobalStore, string>;
  setCurrentToken: Action<IGlobalStore, string>;
  setOnlySubscribed: Action<IGlobalStore, boolean>;
}

const globalStore: IGlobalStore = {
  web3: null,
  signer: "",
  account: "",
  network: "",
  connected: false,
  shouldUpdate: false,
  currentProtocol: "AAVE",
  currentToken: "DAI",
  onlySubscribed: false,

  // actions
  setWeb3: action((state, payload: any) => {
    state.web3 = payload;
  }),

  setSigner: action((state, payload: Signer) => {
    state.signer = payload;
  }),

  setAccount: action((state, payload: string) => {
    state.account = payload;
  }),

  setNetwork: action((state, payload: string) => {
    state.network = payload;
  }),

  setConnected: action((state, payload: boolean) => {
    state.connected = payload;
  }),

  setShouldUpdate: action((state, payload: boolean) => {
    state.shouldUpdate = payload;
  }),

  setCurrentProtocol: action((state, payload: "AAVE" | "COMP") => {
    state.currentProtocol = payload;
  }),

  setCurrentToken: action((state, payload: "DAI" | "USDT" | "USDC") => {
    state.currentToken = payload;
  }),

  setOnlySubscribed: action((state, payload: boolean) => {
    state.onlySubscribed = payload;
  }),
};

export default globalStore;

const { useStoreActions, useStoreState } = createTypedHooks<IGlobalStore>();
export { useStoreActions, useStoreState };
