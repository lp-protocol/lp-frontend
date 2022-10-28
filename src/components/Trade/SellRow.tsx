import { Dialog } from "@mui/material";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useAccount, useWaitForTransaction } from "wagmi";
import { useSell } from "../../utils/useSell";
import { Button } from "../Button/Button";
import { DataProviderContext, RawToken } from "../DataProvider/DataProvider";
import styles from "./styles.module.scss";
import { Token } from "./Trade";

export const SellRow = React.memo(({ token }: { token: Token | RawToken }) => {
  const { getAllData } = useContext(DataProviderContext);

  const { write, isLoading, data } = useSell(token.tokenId, {});
  useWaitForTransaction({
    hash: data?.hash,
    onSuccess: async () => {
      getAllData?.();
    },
  });

  const onSell = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      write?.();
    },
    [write]
  );

  const [showDetail, updateShowDetail] = useState(false);

  const onRowClick = useCallback(() => {
    if (!token.image) return;
    updateShowDetail((c) => !c);
  }, [token.image]);
  return (
    <div
      onClick={onRowClick}
      className={`${styles.sellRow} ${styles.tradeRow}`}
    >
      <Dialog classes={{ paper: styles.modalPaper }} open={showDetail}>
        <img className={styles.lgImg} src={token?.image} />
        <Button disabled={isLoading} onClick={onSell} style={{ width: "100%" }}>
          Sell
        </Button>
      </Dialog>
      {token.image && <img src={token.image} />}
      {!token.image && (
        <div
          style={{ background: "#000", height: "60px" }}
          className={styles.loading}
        >
          <p className="color-1">LOADING IMAGE</p>
        </div>
      )}
      <p className="type-1 color-3">{token.name}</p>
      <Button
        disabled={isLoading}
        onClick={onSell}
        style={{ width: "100px", justifySelf: "flex-end" }}
      >
        Sell
      </Button>
      <Button style={{ justifySelf: "flex-end" }}>Claim Fee</Button>
    </div>
  );
});
