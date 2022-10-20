import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";
import { ConnectKitProvider, getDefaultClient } from "connectkit";
import { WagmiConfig, createClient, configureChains, chain } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { infuraProvider } from "wagmi/providers/infura";

const { chains, provider } = configureChains(
  [chain.mainnet, chain.localhost],
  [
    // infuraProvider({ apiKey: process.env.REACT_APP_INFURA_KEY }),

    jsonRpcProvider({
      rpc: (_chain) => {
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
      <App />
    </ConnectKitProvider>
  </WagmiConfig>
);
