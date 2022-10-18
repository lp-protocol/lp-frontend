import React from "react";
import logo from "./logo.svg";
import "./App.scss";
import { Grid } from "@mui/material";
import { MintBox } from "./components/MintBox/MintBox";
import { Player } from "./components/Player/Player";

function App() {
  return (
    <>
      <Player>
        {({ play, pause, playing }) => (
          <div className="animation-wrap">
            <img onClick={() => {
              if(playing) {
                pause()
              } else {
                play();
              }
            }} className="animation" src="/animation.gif" />
            <a href="#info" className="scroll">
              <div className="scroll-down">Scroll</div>
            </a>
          </div>
        )}
      </Player>

      <div className="wrap" id="info">
        <Grid container>
          <Grid item xs={12} md={6}>
            <h1 className="jumbo">
              {`AN EXPERIMENTAL APPROACH\nTO BOOTSTRAPPING\nNFT LIQUIDITY\nAND REWARDING HOLDERS`}
            </h1>
            <h2 style={{ fontWeight: 'normal'}} className="type-2 color-3">On-Chain. CC0.</h2>
          </Grid>
          <Grid item xs={12} md={6}>
            <MintBox />
          </Grid>
        </Grid>
      </div>
    </>
  );
}

export default App;
