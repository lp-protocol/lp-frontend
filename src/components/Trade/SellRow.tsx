import React, { useContext, useEffect } from "react";
import { useAccount, useWaitForTransaction } from "wagmi";
import { useSell } from "../../utils/useSell";
import { Button } from "../Button/Button";
import { DataProviderContext } from "../DataProvider/DataProvider";
import styles from "./styles.module.scss";
import { Token } from "./Trade";

export const SellRow = ({ token }: { token: Token }) => {
  const { getAllData } = useContext(DataProviderContext);

  const { write, isLoading, data } = useSell(token.tokenId, {});

  useWaitForTransaction({
    hash: data?.hash,
    onSuccess: async () => {
      getAllData();
    },
  });

  return (
    <div className={`${styles.sellRow} ${styles.tradeRow}`}>
      <img src={token.image} />
      <img className={styles.lgImg} src={token.image} />
      <p className="type-1 color-3">{token.name}</p>
      <Button
        disabled={isLoading}
        onClick={write}
        style={{ width: "100px", justifySelf: "flex-end" }}
      >
        Sell
      </Button>
      <Button style={{ justifySelf: "flex-end" }}>Claim Fee</Button>
    </div>
  );
};
