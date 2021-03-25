import "./App.css";

import globalStore, { IGlobalStore } from "./store/globalStore";
import { createStore, StoreProvider } from "easy-peasy";

import ConnectWeb3 from "./components/ConnectWeb3";
import ProtocolTabs from "./components/ProtocolTabs";
import Sidebar from "./components/Sidebar";
import TokensTab from "./components/TokensTab";
import FutureContainer from "./components/FuturesContainer";

const store = createStore<IGlobalStore>(globalStore);

function App() {
  return (
    <StoreProvider store={store}>
      <div className="App">
        <Sidebar />

        <div className="main-content">
          <div className="navbar">
            <ProtocolTabs />
            <ConnectWeb3 />
          </div>

          <TokensTab />
          <FutureContainer />
        </div>
      </div>
    </StoreProvider>
  );
}

export default App;
