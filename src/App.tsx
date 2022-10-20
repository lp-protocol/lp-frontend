import React from "react";
import logo from "./logo.svg";
import "./App.scss";
import { Grid } from "@mui/material";
import { MintBox } from "./components/MintBox/MintBox";
import { Player } from "./components/Player/Player";
import ethDiamond from "./assets/eth-diamond.png";
import styles from "./App.module.scss";
import scImg from "./assets/smart-contract.png";
import stopImg from "./assets/stop-sign.png";
import { Randomizer } from "./components/Randomizer/Randomizer";

function App() {
  return (
    <>
      <Player>
        {({ play, pause, playing }) => (
          <div
            onClick={() => {
              if (playing) {
                pause();
              } else {
                play();
              }
            }}
            className="animation-wrap"
          >
            <img className="animation" src="/animation.gif" />
            <a href="#info" className="scroll">
              <div className="scroll-down">Scroll</div>
            </a>
          </div>
        )}
      </Player>

      <div style={{ paddingTop: "60px" }} className="wrap" id="info">
        <Grid spacing={4} container>
          <Grid item xs={12} md={6}>
            <h1 className="jumbo">
              {`AN EXPERIMENTAL APPROACH\nTO BOOTSTRAPPING\nNFT LIQUIDITY\nAND REWARDING HOLDERS`}
            </h1>
            <h2 style={{ fontWeight: "normal" }} className="type-2 color-3">
              100% On-Chain. CC0.
            </h2>
          </Grid>
          <Grid item xs={12} md={6}>
            <MintBox />
          </Grid>
        </Grid>
      </div>

      <div className="wrap">
        <div className={styles.howHeader}>
          <img className={styles.ethDiamond} src={ethDiamond} />
          <h1 className="jumbo">How it works</h1>
        </div>

        <Grid spacing={5} container>
          <Grid item xs={12} md={4}>
            <div className="spacer">
              <h2 className="type-2 color-3">Trustless Escrow</h2>
              <p className="type-1 color-2">
                Funds and NFTs are held in trustless escrow for no more than 33
                days. If the project doesn't sell out in 33 days the experiment
                ends and you can re-claim your ETH (minus gas fees).
              </p>

              <p className="type-1 color-2">
                <a href="#trustless-escrow">Learn more</a>
              </p>
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <div className="spacer">
              <h2 className="type-2 color-3">Instant Liquidity</h2>
              <p className="type-1 color-2">
                Half of mint proceeds and all external royalties are used to
                fuel instant NFT liquidity. Marketplace functionality is built
                directly into the LP smart contract enabling instant buys and
                sells.
              </p>

              <p className="type-1 color-2">
                <a href="#instant-liquidity">Learn more</a>
              </p>
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <div className="spacer">
              <h2 className="type-2 color-3">Holders Collect Fees</h2>
              <p className="type-1 color-2">
                Every time an LP NFT is sold within the LP smart contract a 10%
                fee is taken. 5% of that fee is put into a pool for holders to
                claim. The other 5% goes directly to the liquidity pool.
              </p>
              <p className="type-1 color-2">
                <a href="#fees">Learn more</a>
              </p>
            </div>
          </Grid>
        </Grid>
      </div>

      <div className="wrap">
        <Grid spacing={10} container>
          <Grid item xs={12} md={6}>
            <div className="spacer center">
              <img className={styles.scenarioImg} src={scImg} />
              <div>
                <h2 className="type-2 color-3">Scenario 1</h2>
                <p className="type-1 color-1">
                  All 10k LP NFTs are minted within 33 days
                </p>
              </div>
              <p className="type-1 color-2">
                At this point the second phase of the experiment begins. Your
                NFTs are unlocked. Buying, selling, and transferring can now
                occur. Until this happens ETH and minted NFTs cannot be
                transferred.
              </p>
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <div className="spacer center">
              <img className={styles.scenarioImg} src={stopImg} />
              <div>
                <h2 className="type-2 color-3">Scenario 2</h2>
                <p className="type-1 color-1">
                  All 10k LP NFTs are NOT minted within 33 days
                </p>
              </div>
              <p className="type-1 color-2">
                At this point the experiment ends and you can withdraw your
                funds (minus gas). The LP NFTs will remain in your wallet, but
                be locked forever on-chain.
              </p>
            </div>
          </Grid>
        </Grid>
      </div>

      <div style={{ maxWidth: "500px", userSelect: "none" }} className="wrap">
        <Randomizer />
      </div>

      <div style={{ maxWidth: "643px", userSelect: "text" }} className="wrap">
        <div className="spacer">
          <h2 id="trustless-escrow" className="type-1 color-1">
            Trustless Escrow
          </h2>

          <p className="type-1 color-2">
            When you mint your LP NFT the ETH you paid to mint will be held in
            The LP smart contract. Your NFTs will be minted and transferred to
            your wallet, but you will not be able to transfer them, or sell them
            until the escrow period ends. Often times NFT projects fail before
            they begin. If this is the case the LP doesn't want you left holding
            the bag.
          </p>
          <p className="type-1 color-2">
            The escrow period ends after all 10k are minted, or after 33 days -
            whichever comes first. If the initial 10,000 LP NFTs are not minted
            within 30 days then The LP considers the project a failure and it is
            scrapped. You'll be able to withdraw your funds from the smart
            contract (minus gas fees).
          </p>
          <h2 id="instant-liquidity" className="type-1 color-1">
            Instant Liquidity
          </h2>

          <p className="type-1 color-2">
            This is when things get interesting. Once all 10,000 LP NFTs are
            minted your NFTs become transferable. Half of the mint proceeds are
            locked in the smart contract to provide a pool of liquidity. All
            project royalties from external marketplaces like Opensea and
            LooksRare are added to this pool.
          </p>
          <p className="type-1 color-2">
            The LP smart contract contains its own trustless marketplace
            functionality. If you'd like to sell an LP NFT you own then you can
            instantly swap it for ETH because of the ETH liquidity pool from the
            initial mint proceeds, on-going royalties, and on-chain fees set in
            place by the LP smart contract itself. The amount of ETH you'll get
            is determined by the amount of ETH in the pool.
            <br />
            <br />
            <span className="color-3">
              Total ETH / Total Circulating Supply = Instant sell price.
            </span>
            <br />
            <br />
            <span className="color-3">
              Total Circulating Supply = Total Supply - LP NFTs held in smart
              contract
            </span>
          </p>
          <p className="type-1 color-2">
            LP NFTs that are sold at the instant sell price become available to
            buy from the smart contract. The price to buy any LP NFT in the
            smart contract will be the instant sell price plus 10%. Half of the
            10% fee will be added to the ETH pool within the LP smart contract
            and the other half will go to the holders of the LP NFTs.
          </p>
          <h2 id="fees" className="type-1 color-1">
            Holders Collect Fees
          </h2>

          <p className="type-1 color-2">
            Each LP NFT you own can be used to withdraw its pro-rata share of
            the earned fees. Any LP NFT that's purchased from the LP smart
            contract will earn a fee. All fees can be claimed by LP holders.
          </p>
          <h2 id="fees" className="type-1 color-1">
            100% On-Chain
          </h2>

          <p className="type-1 color-2">
            The LP NFT art and traits are stored completely on-chain. To put the
            art on-chain a sprite sheet containing all the LP traits was
            generated, converted to a data URL and stored on-chain using
            SSTORE2. When an LP NFT is minted the traits are "randomly" selected
            in the smart contract. Using the on-chain sprite sheet, a dynamic
            SVG is created layering each trait on top of the other while
            referencing the single on-chain sprite sheet. Since the LP art is
            pixelated we can use built in browser properties to render tiny
            pixel images at arbitrary sizes.
          </p>
        </div>
      </div>
    </>
  );
}

export default App;
