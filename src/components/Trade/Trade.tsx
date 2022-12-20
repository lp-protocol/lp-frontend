import React, { memo, useContext, useEffect, useMemo, useState } from "react";
import ethDiamond from "../../assets/eth-diamond.png";
import styles from "../../App.module.scss";
import {
  DataProviderContext,
  RawToken,
  Tokens,
} from "../DataProvider/DataProvider";
import { BigNumber } from "bignumber.js";
import { useLpContractRead } from "../../utils/useLpContractRead";
import tradestyles from "./styles.module.scss";
import { Button } from "../Button/Button";
// @ts-ignore
import { areEqual, FixedSizeList as List } from "react-window";
import { useSell } from "../../utils/useSell";
import {
  ConnectButton,
  ConnectButtonBase,
} from "../ConnectButton/ConnectButton";
import { useAccount, useWaitForTransaction } from "wagmi";
import { BuyRow } from "./BuyRow";
import { SellRow } from "./SellRow";
import isequal from "lodash.isequal";
import { Slider } from "@mui/material";
import { ClaimMany } from "./ClaimMany";

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

const SellRowListItem = memo(
  ({ index, style, data }: any) => (
    <div key={data.ownedKeys[index].tokenId} style={style}>
      {data.ownedTokensWithDetail?.[data.ownedKeys[index]] && (
        <SellRow
          updateTokens={data.updateOwnedTokens}
          token={data.ownedTokensWithDetail[data.ownedKeys[index]]}
        />
      )}
    </div>
  ),
  (prev, next) => isequal(prev.data, next.data)
);

const BuyRowListItem = memo(
  ({ index, style, data }: any) => (
    <div key={data.listingKeys[index].tokenId} style={style}>
      {data.tokens?.[data.listingKeys[index]] && (
        <BuyRow
          slippage={data.slippage}
          updateTokens={data.updateTokens}
          buyPrice={data.buyPrice}
          token={data.tokens[data.listingKeys[index]]}
        />
      )}
    </div>
  ),
  (prev, next) => isequal(prev.data, next.data)
);

export function Trade() {
  const {
    tokensForSale,
    ownedTokens,
    buyPrice,
    sellPrice,
    insufficientLiquidity,
  } = useContext(DataProviderContext);
  const [tokens, updateTokens] = useState<undefined | Tokens>(tokensForSale);
  const [ownedTokensWithDetail, updateOwnedTokens] = useState<
    undefined | Tokens
  >(ownedTokens);
  const lpContractRead = useLpContractRead();
  React.useEffect(() => {
    try {
      const cache = window.localStorage.getItem(LS_KEY);
      if (cache) {
        metadataCache = JSON.parse(cache);
      }
    } catch {}

    const getMetadata = async (tokenId: string): Promise<RawToken> => {
      if (metadataCache[tokenId]) {
        return metadataCache[tokenId];
      }
      const res = await fetch(
        `https://pxg-prod.herokuapp.com/lp/${tokenId}`
      ).then((res) => res.json());
      let uri = res.data;
      [, uri] = uri.split("base64,");
      const metadata = { ...JSON.parse(atob(uri)), tokenId };
      metadataCache[tokenId] = metadata;
      return metadata;
    };

    const loadTokensForSale = async () => {
      if (tokensForSale) {
        let p = [];
        const loadP = async (p: any) => {
          const out = await Promise.all(p);
          updateTokens((all) =>
            out.reduce(
              (a, token) => {
                a[token.tokenId] = token;
                return a;
              },
              { ...all }
            )
          );
        };
        const keys = Object.keys(tokensForSale);
        for (let i = 0; i < keys.length; i++) {
          const tokenId = tokensForSale[keys[i]].tokenId;
          p.push(getMetadata(tokenId));
          if (p.length === 10) {
            await loadP(p);
            p = [];
          }
        }

        if (p.length) {
          loadP(p);
        }
      }
    };

    const loadOwnedTokens = async () => {
      if (ownedTokens) {
        let p = [];
        const loadP = async (p: any) => {
          const out = await Promise.all(p);
          updateOwnedTokens((all) =>
            out.reduce(
              (a, token) => {
                a[token.tokenId] = token;
                return a;
              },
              { ...all }
            )
          );
        };
        const keys = Object.keys(ownedTokens);
        for (let i = 0; i < keys.length; i++) {
          const tokenId = ownedTokens[keys[i]].tokenId;
          p.push(getMetadata(tokenId));
          if (p.length === 10) {
            await loadP(p);
            p = [];
          }
        }

        if (p.length) {
          loadP(p);
        }
      }
    };

    Promise.all([loadTokensForSale(), loadOwnedTokens()]).then(() => {});
  }, [tokensForSale, ownedTokens, lpContractRead]);

  const [tab, updateTab] = useState<"LISTINGS" | "WALLET">("LISTINGS");

  const onTabClick = (e: any) => {
    if (e.target.dataset?.tab) {
      updateTab(e.target.dataset?.tab);
    }
  };

  const listingKeys = useMemo(() => Object.keys(tokens ?? {}), [tokens]);
  const ownedKeys = useMemo(
    () => Object.keys(ownedTokens ?? {}),
    [ownedTokens]
  );

  const [slippage, updateSlippage] = useState(5);

  const listData = useMemo(
    () => ({
      tokens,
      listingKeys,
      buyPrice,
      slippage,
      updateTokens,
      updateOwnedTokens,
      ownedKeys,
      ownedTokensWithDetail,
    }),
    [tokens, listingKeys, slippage, buyPrice, ownedKeys, ownedTokensWithDetail]
  );
  return (
    <>
      <div
        className="wrap"
        style={{
          maxWidth: "800px",
          marginLeft: "auto",
          marginRight: "auto",
          marginBottom: "200px",
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

          {tab === "WALLET" && (
            <>
              <div>
                <p className="color-1 type-1">
                  <>
                    Sell Price{" "}
                    {new BigNumber(sellPrice ?? 0).div(10 ** 18).toFixed()} ETH
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
                          {!ownedTokens && (
                            <p className="color-1 type-1">
                              Loading. Please wait...
                            </p>
                          )}
                          <ClaimMany tokenIds={ownedKeys} />
                          {ownedKeys.length > 0 && (
                            <div className={tradestyles.listWrap}>
                              <List
                                height={800}
                                itemCount={ownedKeys.length}
                                itemSize={70}
                                width={"100%"}
                                itemData={listData}
                              >
                                {SellRowListItem}
                              </List>
                            </div>
                          )}
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
              {!tokens && (
                <p className="color-1 type-1">
                  Loading listings. Please wait...
                </p>
              )}
              {tokens && (
                <div className="spacer">
                  <p className="color-1 type-1">
                    <>
                      Buy Price{" "}
                      {insufficientLiquidity
                        ? "Insufficient liquidity to buy"
                        : `${new BigNumber(buyPrice ?? 0)
                            .div(10 ** 18)
                            .toFixed()} ETH`}
                    </>
                  </p>
                  <div style={{ maxWidth: "300px", width: "100%" }}>
                    <p className="color-1 type-0">Slippage {slippage}%</p>
                    <p
                      className="color-1"
                      style={{ fontFamily: "arial", fontSize: "12px" }}
                    >
                      Increase slippage to account for price increases during
                      transaction. Additional amounts will be refunded.
                    </p>
                    <Slider
                      aria-label="Volume"
                      value={slippage}
                      onChange={(evt, value) => {
                        updateSlippage(value as number);
                      }}
                    />
                  </div>
                </div>
              )}

              {listingKeys.length > 0 && (
                <div className={tradestyles.listWrap}>
                  <List
                    height={800}
                    itemCount={listingKeys.length}
                    itemSize={70}
                    itemData={listData}
                    width={"100%"}
                  >
                    {BuyRowListItem}
                  </List>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
