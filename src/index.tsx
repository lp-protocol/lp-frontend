import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";
import { ConnectKitProvider, getDefaultClient } from "connectkit";
import { WagmiConfig, createClient, configureChains, chain } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { infuraProvider } from "wagmi/providers/infura";
import { DataProvider } from "./components/DataProvider/DataProvider";
console.log(chain.hardhat);
const { chains, provider } = configureChains(
  [chain.hardhat],
  [
    // infuraProvider({ apiKey: process.env.REACT_APP_INFURA_KEY }),

    jsonRpcProvider({
      rpc: (_chain) => {
        if (_chain.id === chain.goerli.id) {
          return {
            http: `https://goerli.infura.io/v3/be4dac94367a40168af1aadd4423eead`,
            webSocket: `wss://goerli.infura.io/ws/v3/be4dac94367a40168af1aadd4423eead`,
          };
        }
        return {
          http: `http://127.0.0.1:8545`,
          webSocket: `ws://127.0.0.1:8545`,
        };
      },
    }),
  ]
);

const client = createClient(
  getDefaultClient({
    appName: "The LP",
    infuraId: process.env.REACT_APP_INFURA_KEY,
    chains,
    provider,
  })
);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <WagmiConfig client={client}>
    <ConnectKitProvider>
      <DataProvider>
        <App />
      </DataProvider>
    </ConnectKitProvider>
  </WagmiConfig>
);
