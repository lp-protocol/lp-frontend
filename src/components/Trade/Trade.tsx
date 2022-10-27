import React, { useContext, useState } from "react";
import ethDiamond from "../../assets/eth-diamond.png";
import styles from "../../App.module.scss";
import { DataProviderContext } from "../DataProvider/DataProvider";
import { BigNumber } from "bignumber.js";
import { useLpContractRead } from "../../utils/useLpContractRead";
import tradestyles from "./styles.module.scss";
import { Button } from "../Button/Button";

type Token = { name: string; image: string; description: string };

let metadataCache: {
  [tokenId: string]: Token;
} = {};

const LS_KEY = "__LP_METADATA_CACHE__";

export function Trade() {
  const { tokensForSale, ownedTokens, buyPrice, sellPrice } =
    useContext(DataProviderContext);
  const [tokens, updateTokens] = useState<null | Token[]>(null);
  const lpContractRead = useLpContractRead();
  React.useEffect(() => {
    try {
      const cache = window.localStorage.getItem(LS_KEY);
      if (cache) {
        metadataCache = JSON.parse(cache);
      }
    } catch {}
    const fn = async () => {
      const all = await Promise.all(
        tokensForSale?.map((token: BigNumber) => {
          const _fn = async () => {
            const tokenId = token.toString();
            console.log("TOKEN ID:", tokenId);
            if (metadataCache[tokenId]) {
              return metadataCache[tokenId];
            }
            let uri = await lpContractRead?.tokenURI(tokenId);
            [, uri] = uri.split("base64,");
            const metadata = JSON.parse(atob(uri));
            metadataCache[tokenId] = metadata;
            return metadata;
          };
          return _fn();
        })
      );

      try {
        window.localStorage.setItem(LS_KEY, JSON.stringify(metadataCache));
      } catch {}
      return all;
    };

    fn().then((t) => {
      updateTokens(t);
    });
  }, [tokensForSale]);

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
              {!tokens && <p>Loading...</p>}
              {tokens?.map((token) => (
                <div className={tradestyles.tradeRow}>
                  <img src={token.image} />
                  <img className={tradestyles.lgImg} src={token.image} />
                  <p className="type-1 color-3">{token.name}</p>
                  <Button style={{ width: "100px", justifySelf: "flex-end" }}>
                    Buy
                  </Button>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}
