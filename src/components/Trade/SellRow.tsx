import { Dialog } from "@mui/material";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  useAccount,
  useContract,
  useContractRead,
  useNetwork,
  useSigner,
  useWaitForTransaction,
} from "wagmi";
import { useSell } from "../../utils/useSell";
import { Button } from "../Button/Button";
import { DataProviderContext, RawToken } from "../DataProvider/DataProvider";
import styles from "./styles.module.scss";
import { Token } from "./Trade";
import abi from "../../assets/lpabi.json";
import BigNumber from "bignumber.js";
import { useLpContractRead } from "../../utils/useLpContractRead";

export const SellRow = React.memo(
  ({ token, updateTokens }: { token: Token | RawToken; updateTokens: any }) => {
    const { getAllData } = useContext(DataProviderContext);
    const { address } = useAccount();
    const { chain } = useNetwork();
    const { data: signer } = useSigner({ chainId: chain?.id });

    const contractRead = useLpContractRead();
    const [fee, updateFee] = useState("");

    const getFeeAndSetState = useCallback(async () => {
      const fee = await contractRead?.calculatePendingPayment(token.tokenId);
      const feeBn = new BigNumber(fee.toString()).div(10 ** 18);
      if (feeBn.gt(0)) {
        updateFee(feeBn.toFixed());
      }
    }, [contractRead, token.tokenId]);

    React.useEffect(() => {
      getFeeAndSetState();
    }, [getFeeAndSetState]);

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

    const [claimHash, updateClaimHash] = useState<any>();
    useWaitForTransaction({
      hash: claimHash,
      onSuccess: async () => {
        getFeeAndSetState();
      },
    });

    const onSell = useCallback(
      async (e: React.MouseEvent) => {
        e.stopPropagation();

        try {
          const overrides = {
            from: address,
          };
          console.log(overrides);
          const estimatedGas = await contract?.estimateGas.sell(
            token.tokenId,
            overrides
          );
          const gasLimit = new BigNumber(estimatedGas?.toString() ?? "0");
          const gasLimitStr = gasLimit
            .plus(gasLimit.times("0.25").toFixed(0))
            .toFixed();
          const tx = await contract?.sell(token.tokenId, {
            ...overrides,
            gasLimit: gasLimitStr,
          });
          updateHash(tx.hash);
        } catch (e) {
          console.log(e);
        }
      },
      [address, contract, token.tokenId]
    );

    const onClaim = useCallback(
      async (e: React.MouseEvent) => {
        e.stopPropagation();

        try {
          const overrides = {
            from: address,
          };
          const estimatedGas = await contract?.estimateGas.claim(
            token.tokenId,
            overrides
          );
          const gasLimit = new BigNumber(estimatedGas?.toString() ?? "0");
          const gasLimitStr = gasLimit
            .plus(gasLimit.times("0.25").toFixed(0))
            .toFixed();
          const tx = await contract?.claim(token.tokenId, {
            ...overrides,
            gasLimit: gasLimitStr,
          });
          updateClaimHash(tx.hash);
        } catch (e) {
          console.log(e);
        }
      },
      [address, contract, token.tokenId]
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
          <Button onClick={onSell} style={{ width: "100%" }}>
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
        <div>
          <p className="type-0 color-3">{token.name}</p>
          <p className="type-0 color-3">Claimable: {fee || "0"} ETH</p>
        </div>
        <Button
          onClick={onSell}
          style={{ width: "100px", justifySelf: "flex-end" }}
        >
          Sell
        </Button>
        <Button
          onClick={onClaim}
          disabled={!fee}
          style={{ justifySelf: "flex-end" }}
        >
          Claim Fee
        </Button>
      </div>
    );
  },
  (prevProps, nextProps) => prevProps?.token?.image === nextProps?.token?.image
);
