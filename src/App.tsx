import "./App.css";

import globalStore, { IGlobalStore } from "./store/globalStore";
import { createStore, StoreProvider } from "easy-peasy";

import ConnectWeb3 from "./components/ConnectWeb3";
import Future from "./components/Future";
import Tabs from "./components/Tabs";

const store = createStore<IGlobalStore>(globalStore);

function App() {
  return (
    <StoreProvider store={store}>
      <div className="App">
        <div className="navbar">
          <div className="header">Unreal.Finance</div>
          <ConnectWeb3 />
        </div>

        <Tabs />

        <div className="app-body">
          <Future />
          <Future />
        </div>
      </div>
    </StoreProvider>
  );
}

export default App;
