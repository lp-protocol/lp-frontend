import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";
import { ConnectKitProvider, getDefaultClient } from "connectkit";
import { WagmiConfig, createClient } from "wagmi";

const client = createClient(
  getDefaultClient({
    appName: "The LP",
    infuraId: process.env.REACT_APP_INFURA_KEY,
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
