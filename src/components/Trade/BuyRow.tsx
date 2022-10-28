import React, { useContext } from "react";
import { useAccount, useWaitForTransaction } from "wagmi";
import { useBuy } from "../../utils/useBuy";
import { Button } from "../Button/Button";
import { DataProviderContext } from "../DataProvider/DataProvider";
import styles from "./styles.module.scss";
import { Token } from "./Trade";
import BigNumber from "bignumber.js";

type BuyRowProps = {
  token: Token;
  buyPrice?: string;
};

export function BuyRow({ token, buyPrice }: BuyRowProps) {
  const { getAllData } = useContext(DataProviderContext);
  const bn = new BigNumber(buyPrice?.toString() ?? 0);

  const { write, isLoading, data } = useBuy(token.tokenId, {
    overrides: {
      value: bn.plus(bn.times("0.05").toFixed(0)).toFixed(0),
    },
  });

  useWaitForTransaction({
    hash: data?.hash,
    onSuccess: async () => {
      getAllData();
    },
  });
  return (
    <div className={styles.tradeRow}>
      <img src={token.image} />
      <img className={styles.lgImg} src={token.image} />
      <p className="type-1 color-3">{token.name}</p>
      <Button
        disabled={isLoading}
        onClick={write}
        style={{ width: "100px", justifySelf: "flex-end" }}
      >
        Buy
      </Button>
    </div>
  );
}
