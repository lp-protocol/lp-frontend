import React, { useCallback, useContext, useMemo, useState } from "react";
import {
  useAccount,
  useContract,
  useNetwork,
  useSigner,
  useWaitForTransaction,
} from "wagmi";
import { useBuy } from "../../utils/useBuy";
import { Button } from "../Button/Button";
import { DataProviderContext, RawToken } from "../DataProvider/DataProvider";
import styles from "./styles.module.scss";
import { Token } from "./Trade";
import BigNumber from "bignumber.js";
import { Dialog } from "@mui/material";
import abi from "../../assets/lpabi.json";

type BuyRowProps = {
  token: Token | RawToken;
  buyPrice?: string;
  updateTokens: any;
};

export const BuyRow = React.memo(
  function BuyRow({ token, buyPrice, updateTokens }: BuyRowProps) {
    const { getAllData } = useContext(DataProviderContext);
    const { address } = useAccount();
    const bn = useMemo(() => new BigNumber(buyPrice ?? 0), [buyPrice]);
    const { chain } = useNetwork();
    const { data: signer } = useSigner({ chainId: chain?.id });
    const contract = useContract({
      address: process.env.REACT_APP_LP_CONTRACT,
      abi,
      signerOrProvider: signer,
    });
    const [hash, updateHash] = useState<any>();
    useWaitForTransaction({
      hash,
      onSuccess: async () => {
        getAllData?.();
        updateTokens((tokens: any) => {
          const out = { ...tokens };
          delete out[token.tokenId];
          return out;
        });
      },
    });

    const [showDetail, updateShowDetail] = useState(false);

    const onBuy = useCallback(
      async (e: React.MouseEvent) => {
        try {
          e.stopPropagation();
          const overrides = {
            from: address,
            value: bn.plus(bn.times("0.05").toFixed(0)).toFixed(0),
          };
          console.log(overrides);
          const estimatedGas = await contract?.estimateGas.buy(
            token.tokenId,
            overrides
          );
          const gasLimit = new BigNumber(estimatedGas?.toString() ?? "0");
          const gasLimitStr = gasLimit
            .plus(gasLimit.times("0.25").toFixed(0))
            .toFixed();
          const tx = await contract?.buy(token.tokenId, {
            ...overrides,
            gasLimit: gasLimitStr,
          });
          updateHash(tx.hash);
        } catch (e) {
          console.log(e);
        }
      },
      [token.tokenId, address, bn, contract]
    );
    const onRowClick = useCallback(() => {
      if (!token.image) return;
      updateShowDetail((c) => !c);
    }, [token.image]);
    return (
      <div onClick={onRowClick} className={styles.tradeRow}>
        <Dialog classes={{ paper: styles.modalPaper }} open={showDetail}>
          <img className={styles.lgImg} src={token?.image} />
          <Button
            // disabled={isLoading}
            onClick={onBuy}
            style={{ width: "100%" }}
          >
            Buy
          </Button>
        </Dialog>
        {!token.image && (
          <div
            style={{ background: "#000", height: "60px" }}
            className={styles.loading}
          >
            <p className="color-1">LOADING IMAGE</p>
          </div>
        )}
        {token.image && <img src={token.image} />}
        <p className="type-1 color-3">
          {token?.name ?? `The LP #${token.toString()}`}
        </p>
        <Button
          // disabled={isLoading}
          onClick={onBuy}
          style={{ width: "100px", justifySelf: "flex-end" }}
        >
          Buy
        </Button>
      </div>
    );
  },
  (prev, next) => prev.token?.image === next.token?.image
);
