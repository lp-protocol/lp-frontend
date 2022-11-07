import React, { useContext, useState } from "react";
import "./App.scss";
import { Grid } from "@mui/material";
import { MintBox } from "./components/MintBox/MintBox";
import { Player } from "./components/Player/Player";
import ethDiamond from "./assets/eth-diamond.png";
import styles from "./App.module.scss";
import scImg from "./assets/smart-contract.png";
import stopImg from "./assets/stop-sign.png";
import { Randomizer } from "./components/Randomizer/Randomizer";
import { IconBar } from "./components/IconBar/IconBar";
import { DataProviderContext } from "./components/DataProvider/DataProvider";
import { Trade } from "./components/Trade/Trade";
import { MintPriceChart } from "./components/MintPriceChart/MintPriceChart";

function useMatchMedia() {
  const [isSm, updateIsSm] = useState(false);

  React.useEffect(() => {
    const handler = () => {
      let sm = window.matchMedia("(max-width: 600px)");
      updateIsSm(sm.matches);
    };
    window.addEventListener("resize", handler);
    handler();
    return () => {
      window.removeEventListener("resize", handler);
    };
  }, []);

  return { isSm };
}

function App() {
  const { isSm } = useMatchMedia();
  const { lockedIn } = useContext(DataProviderContext);
  return (
    <>
      <Player>
        {({ play, pause, playing }) => (
          <a
            href="#info"
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
            <div className="scroll">
              <div className="scroll-down">Scroll</div>
            </div>
          </a>
        )}
      </Player>

      <div style={{ padding: "6rem 1rem 0" }} className="wrap" id="info">
        <p style={{ marginBottom: "2rem" }} className="color-4 type-2">
          The LP
        </p>
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
            {!lockedIn && <MintBox />}
            {lockedIn && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    maxWidth: "400px",
                    borderRadius: "16px",
                    overflow: "hidden",
                  }}
                >
                  <Randomizer />
                </div>
              </div>
            )}
          </Grid>
        </Grid>

        <div style={{ maxWidth: "600px", margin: "auto", marginTop: "10rem" }}>
          <h2
            style={{ fontWeight: "normal", textAlign: "justify" }}
            className="type-1 color-2"
          >
            A new model to empower NFT creators that solves the NFT liquidity
            issue by using mint proceeds to bootstrap liquidity, provides
            instant buy/sell functionality, and rewards holders.
          </h2>
        </div>
        {!lockedIn && (
          <div style={{ marginTop: "10rem" }}>
            <h2 className="type-2 color-3">Mint price over time</h2>
            <MintPriceChart />
          </div>
        )}
      </div>

      {!lockedIn && (
        <>
          {!isSm && (
            <div style={{ width: "100%", display: "flex" }}>
              <div style={{ width: "16.66666667%" }}>
                <Randomizer />
              </div>
              <div style={{ width: "16.66666667%" }}>
                <Randomizer />
              </div>
              <div style={{ width: "16.66666667%" }}>
                <Randomizer />
              </div>
              <div style={{ width: "16.66666667%" }}>
                <Randomizer />
              </div>
              <div style={{ width: "16.66666667%" }}>
                <Randomizer />
              </div>
              <div style={{ width: "16.66666667%" }}>
                <Randomizer />
              </div>
            </div>
          )}

          {isSm && (
            <div style={{ width: "100%", display: "flex" }}>
              <div style={{ width: "100%" }}>
                <Randomizer />
              </div>
            </div>
          )}
        </>
      )}

      {lockedIn && <Trade />}

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
                Funds and NFTs are held in trustless escrow for no more than 11
                days. If the project doesn't sell out in 11 days the experiment
                ends and you can withdraw your ETH (minus gas fees).
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
                create instant NFT liquidity. After the first 9k LP NFTs are
                minted an additional 1,000 are minted to provide liquidity for
                instant buys and sells. Marketplace functionality is built
                directly into the LP smart contract.
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
                Every time an LP NFT is bought or sold from the internal
                liquidity pool a fee is taken. Half of that fee is put into a
                pool for holders to claim. The other half goes back to the
                liquidity pool.
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
                  First 9k LP NFTs are minted within 11 days
                </p>
              </div>
              <p className="type-1 color-2">
                At this point the second phase of the experiment begins. Your
                NFTs are unlocked. Buying, selling, and transferring can now
                occur. Until this happens ETH and minted NFTs cannot be
                transferred, or sold.
              </p>
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <div className="spacer center">
              <img className={styles.scenarioImg} src={stopImg} />
              <div>
                <h2 className="type-2 color-3">Scenario 2</h2>
                <p className="type-1 color-1">
                  First 9k LP NFTs are NOT minted within 11 days
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

      <div
        style={{ maxWidth: "643px", userSelect: "text", marginBottom: "10px" }}
        className="wrap"
      >
        <div className="spacer">
          <p className="type-1 color-2">
            The underlying LP smart contracts, The LP Protocol, give the power
            back to NFT creators. By owning the liquidity, fees, and listings
            projects are no longer at the mercy of the rules of centralized
            marketplaces. It is our hope that we as a community will build upon
            this protocol and that new NFT projects will adopt it.
          </p>
          <h2 id="trustless-escrow" className="type-1 color-1">
            Roadmap
          </h2>
          <p className="type-1 color-2">
            • Expand upon the LP Protocol by offering bounties to the community.
          </p>
          <p className="type-1 color-2">
            • Support projects using the LP protocol
          </p>
          <p className="type-1 color-2">
            • Create listing aggregator for projects using the LP protocol to
            support NFT liquidity.
          </p>
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
            The escrow period ends after the first 9k are minted, or after 11
            days - whichever comes first. If the initial 9,000 LP NFTs are not
            minted within 11 days then the project is scrapped. You'll be able
            to withdraw your funds from the smart contract (minus gas fees).
          </p>
          <h2 id="instant-liquidity" className="type-1 color-1">
            Instant Liquidity
          </h2>

          <p className="type-1 color-2">
            This is when things get interesting. Once the first 9,000 LP NFTs
            are minted half of the mint proceeds are locked in the smart
            contract and an additional 1,000 NFTs are instantly minted using
            ERC-2309 to provide a pool of liquidity which enables instant sells
            and buys. All project royalties from external marketplaces like
            Opensea and LooksRare are added to this pool.
          </p>
          <p className="type-1 color-2">
            The LP smart contract contains its own trustless marketplace
            functionality. If you'd like to sell an LP NFT you own then you can
            instantly swap it for ETH because of the liquidity pool from the
            initial mint proceeds, on-going royalties, and on-chain fees set in
            place by the LP smart contract itself. The buy and sell prices are
            derived from the following.
            <br />
            <br />
          </p>
          <p className="color-3 type-1">• A = The amount of ETH in the pool</p>
          <p className="color-3 type-1">
            • B = Number of NFTs owned by various people
          </p>
          <p className="color-3 type-1">• T = Total supply of NFTs</p>
          <p className="color-3 type-1">
            • T-B = Number of NFTs in liquidity pool
          </p>
          <p className="color-3 type-1">
            • K = (A)*(T-B) = Our constant product (changes due to accumulating
            fees)
          </p>
          <p className="color-3 type-1">• Buy Price = A/(T-B - 1) </p>
          <p className="color-3 type-1">• Sell Price = A/(T-B + 1) </p>
          <p className="color-3 type-1">• Fee = abs(A/(T-B) - A/(T-(B+-1))</p>

          <h2 id="fees" className="type-1 color-1">
            Holders Collect Fees
          </h2>

          <p className="type-1 color-2">
            Each LP NFT you own can be used to withdraw its pro-rata share of
            the earned fees. Any LP NFT that's purchased or sold from the LP
            smart contract will earn a fee. All fees can be claimed by LP
            holders.
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
            <br />
            <br />A note about the Safari Browser: Safari does not fully support
            the method used to render the on-chain image. It shows blurry at
            anything above 40px x 40px. If for some reason you are required to
            render your LP NFT image in Safari you can use a fallback canvas
            method, which we are using for the above preview images, to render a
            crisp image.
          </p>
          <h2 id="fees" className="type-1 color-1">
            Team mint
          </h2>
          <p className="type-1 color-2">
            When the LP smart contract was deployed 1,000 LP NFTs were minted to
            a team wallet.
          </p>
        </div>
      </div>
      <IconBar />
    </>
  );
}

export default App;
