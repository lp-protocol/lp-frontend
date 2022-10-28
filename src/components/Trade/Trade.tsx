import React, { useContext, useEffect, useState } from "react";
import ethDiamond from "../../assets/eth-diamond.png";
import styles from "../../App.module.scss";
import { DataProviderContext } from "../DataProvider/DataProvider";
import { BigNumber } from "bignumber.js";
import { useLpContractRead } from "../../utils/useLpContractRead";
import tradestyles from "./styles.module.scss";
import { Button } from "../Button/Button";
// @ts-ignore
import { FixedSizeList as List } from "react-window";
import { useSell } from "../../utils/useSell";
import {
  ConnectButton,
  ConnectButtonBase,
} from "../ConnectButton/ConnectButton";
import { useAccount, useWaitForTransaction } from "wagmi";
import { BuyRow } from "./BuyRow";
import { SellRow } from "./SellRow";

export type Token = {
  tokenId: string;
  name: string;
  image: string;
  description: string;
};

let metadataCache: {
  [tokenId: string]: Token;
} = {};

const LS_KEY = "__LP_METADATA_CACHE__";

export function Trade() {
  const { tokensForSale, ownedTokens, buyPrice, sellPrice } =
    useContext(DataProviderContext);
  const [tokens, updateTokens] = useState<undefined | Token[]>(undefined);
  const [loading, updateLoading] = useState(true);
  const [ownedTokensWithDetail, updateOwnedTokens] = useState<
    undefined | Token[]
  >(undefined);
  const lpContractRead = useLpContractRead();
  React.useEffect(() => {
    try {
      const cache = window.localStorage.getItem(LS_KEY);
      if (cache) {
        metadataCache = JSON.parse(cache);
      }
    } catch {}
    const fn = async () => {
      const cb = (token: BigNumber) => {
        const _fn = async () => {
          const tokenId = token.toString();
          if (metadataCache[tokenId]) {
            return metadataCache[tokenId];
          }
          let uri = await lpContractRead?.tokenURI(tokenId);
          [, uri] = uri.split("base64,");
          const metadata = { ...JSON.parse(atob(uri)), tokenId };
          metadataCache[tokenId] = metadata;
          return metadata;
        };
        return _fn();
      };
      const forSale = tokensForSale
        ? await Promise.all(tokensForSale?.map(cb))
        : void 0;
      const owned = ownedTokens
        ? await Promise.all(ownedTokens?.map(cb))
        : void 0;

      try {
        window.localStorage.setItem(LS_KEY, JSON.stringify(metadataCache));
      } catch {}
      return [forSale, owned];
    };

    fn().then(([forSale, owned]) => {
      updateTokens(forSale);
      updateOwnedTokens(owned);
      updateLoading(false);
    });
  }, [tokensForSale, ownedTokens, lpContractRead]);

  const [tab, updateTab] = useState<"LISTINGS" | "WALLET">("LISTINGS");

  const onTabClick = (e: any) => {
    if (e.target.dataset?.tab) {
      updateTab(e.target.dataset?.tab);
    }
  };
  return (
    <>
      <div
        className="wrap"
        style={{
          maxWidth: "800px",
          marginLeft: "auto",
          marginRight: "auto",
          marginBottom: "500px",
        }}
      >
        <div className="spacer">
          <div onClick={onTabClick} className={tradestyles.tabWrap}>
            <p
              data-tab="LISTINGS"
              className={`color-4 type-2 ${tab === "LISTINGS" ? "active" : ""}`}
            >
              Listings
            </p>
            <p
              data-tab="WALLET"
              className={`color-4 type-2 ${tab === "WALLET" ? "active" : ""}`}
            >
              Your NFTs
            </p>
          </div>

          {loading && (
            <p className="color-1 type-2">
              Loading on-chain data...This may take a moment
            </p>
          )}

          {tab === "WALLET" && (
            <>
              <div>
                <p className="color-1 type-1">
                  <>
                    Sell Price{" "}
                    {new BigNumber(sellPrice?.toString())
                      .div(10 ** 18)
                      .toFixed()}{" "}
                    ETH
                  </>
                </p>
              </div>
              <ConnectButtonBase>
                {({
                  isConnected,
                  isConnecting,
                  show,
                  hide,
                  address,
                  ensName,
                }) => {
                  return (
                    <>
                      {!isConnected && (
                        <Button onClick={show}>Connect wallet</Button>
                      )}
                      {isConnected && (
                        <>
                          <List
                            height={800}
                            itemCount={ownedTokensWithDetail?.length ?? 0}
                            itemSize={70}
                            width={"100%"}
                          >
                            {({ index, style }: any) => (
                              <div style={style}>
                                {ownedTokensWithDetail?.[index] && (
                                  <SellRow
                                    token={ownedTokensWithDetail[index]}
                                  />
                                )}
                              </div>
                            )}
                          </List>
                        </>
                      )}
                    </>
                  );
                }}
              </ConnectButtonBase>
            </>
          )}

          {tab === "LISTINGS" && (
            <>
              {tokens && (
                <div>
                  <p className="color-1 type-1">
                    <>
                      Buy Price{" "}
                      {new BigNumber(buyPrice?.[0].toString())
                        .div(10 ** 18)
                        .toFixed()}{" "}
                      ETH
                    </>
                  </p>
                  <p
                    style={{ fontSize: "12px", fontFamily: "arial" }}
                    className="color-1"
                  >
                    5% will be added upon purchase to account for slippage. Any
                    extra will be refunded.
                  </p>
                </div>
              )}

              <List
                height={800}
                itemCount={tokens?.length ?? 0}
                itemSize={70}
                width={"100%"}
              >
                {({ index, style }: any) => (
                  <div style={style}>
                    {tokens?.[index] && (
                      <BuyRow buyPrice={buyPrice?.[0]} token={tokens[index]} />
                    )}
                  </div>
                )}
              </List>
            </>
          )}
        </div>
      </div>
    </>
  );
}
