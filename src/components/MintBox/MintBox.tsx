import { Grid } from "@mui/material";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  useAccount,
  useContract,
  useContractRead,
  useNetwork,
  useProvider,
  chain,
  useSigner,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { Button } from "../Button/Button";
import { ConnectButton } from "../ConnectButton/ConnectButton";
import { Randomizer } from "../Randomizer/Randomizer";
import { TextInput } from "../TextInput/TextInput";
import styles from "./styles.module.scss";
import abi from "../../assets/lpabi.json";
import { ethers } from "ethers";
import { useCountDown } from "../../utils/useCountDown";
import BigNumber from "bignumber.js";
import { DataProviderContext } from "../DataProvider/DataProvider";

const wait = () =>
  new Promise((resolve) =>
    setTimeout(() => {
      resolve(void 0);
    }, 1000)
  );

export function MintBox() {
  const { chain } = useNetwork();
  const { isConnected, address } = useAccount();
  const [amount, updateAmount] = useState("");
  const bnAmount = new BigNumber(amount || "0");

  const provider = useProvider({ chainId: chain?.id });
  const { totalMinted, getAllData } = useContext(DataProviderContext);
  const { data: signer } = useSigner({ chainId: chain?.id });
  const contractRead = useContract({
    address: process.env.REACT_APP_LP_CONTRACT,
    abi,
    signerOrProvider: provider,
  });

  const [hasStarted, updateHasStarted] = useState<boolean | null>(null);

  const [data, updateData] = useState<any>();
  const enabled = Boolean(
    data?.currentMintPrice && !bnAmount.isNaN() && bnAmount.gt(0)
  );

  const { config, isError } = usePrepareContractWrite({
    address: process.env.REACT_APP_LP_CONTRACT,
    abi,
    functionName: "mint",
    enabled,
    args: [bnAmount.toFixed()],
    overrides: enabled
      ? {
          value: data?.currentMintPrice.mul(amount),
        }
      : void 0,
  });

  let gasLimit = new BigNumber(config?.request?.gasLimit.toString() ?? "0");
  gasLimit = gasLimit.plus(gasLimit.times(0.25));

  const {
    data: mintTxData,
    isLoading,
    isSuccess,
    write,
  } = useContractWrite({
    ...config,
    overrides: enabled
      ? {
          value: data?.currentMintPrice?.mul(amount),
        }
      : void 0,
    request: {
      ...config.request,
      gasLimit: gasLimit.toFixed(0),
    },
  } as any);

  const [loading, updateLoading] = useState(true);

  const getData = useCallback(
    async (recurseStart?: boolean): Promise<any> => {
      const { timestamp: currentBlockTimeStamp } = await provider.getBlock(
        "latest"
      );
      const startTime = await contractRead?.startTime();
      const endTime = await contractRead?.endTime();
      const maxPubSale = await contractRead?.MAX_PUB_SALE();
      const maxTeamMint = await contractRead?.MAX_TEAM();
      let currentMintPrice;
      try {
        currentMintPrice = await contractRead?.getCurrentMintPrice();
      } catch {}

      const hasStarted = ethers.BigNumber.from(currentBlockTimeStamp).gte(
        startTime
      );

      if (recurseStart && !hasStarted) {
        await wait();
        return getData(true);
      }

      updateHasStarted(hasStarted);
      updateData({
        maxPubSale: maxPubSale.toString(),
        maxTeamMint: maxTeamMint.toString(),
        startTime: startTime.toString(),
        endTime: endTime.toString(),
        currentMintPrice: currentMintPrice,
        currentMintPriceDisplay: currentMintPrice
          ? new BigNumber(currentMintPrice.toString()).div(10 ** 18).toFixed(4)
          : void 0,
      });
      updateLoading(false);
    },
    [contractRead, provider]
  );

  useWaitForTransaction({
    hash: mintTxData?.hash,
    onSuccess: async () => {
      await getAllData?.();
      await getData();
    },
  });

  React.useEffect(() => {
    getData();
  }, [getData]);

  const startInfo = useCountDown(data?.startTime, () => getData(true));
  const timeLeftInfo = useCountDown(data?.endTime);

  const mint = useCallback(async () => {
    try {
      if (bnAmount.isNaN()) {
        return alert("Please enter a valid amount");
      }
      write?.();
    } catch (e: any) {
      alert(e.message);
    }
  }, [amount, write, data?.currentMintPrice]);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <p className="color-2 type-1">Dutch auction</p>
        </Grid>
        <Grid item xs={12} sm={4}>
          <p className="color-2 type-1">Max price: 1.11 ETH</p>
        </Grid>
        <Grid item xs={12} sm={4}>
          <p className="color-2 type-1">Min price: 0.0111 ETH</p>
        </Grid>
      </Grid>
      <div className={styles.wrap}>
        <Grid spacing={2} container>
          <Grid item xs={12} md={6}>
            <div className="spacer">
              <div>
                <p className="color-3 type-1">Current price</p>
                <p className="color-1 type-1">
                  {data?.currentMintPriceDisplay ?? "--"} ETH
                </p>
              </div>
              <div>
                <p className="color-3 type-1">Total remaining (public sale)</p>
                <p className="color-1 type-1">
                  {totalMinted != null
                    ? new BigNumber(data?.maxPubSale ?? 0)
                        .minus(totalMinted)
                        .plus(data?.maxTeamMint ?? 0)
                        .toFixed()
                    : "--"}{" "}
                  / {data?.maxPubSale}
                </p>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <div className={styles.btnWrap}>
              {isConnected && (
                <>
                  {!hasStarted && !loading && (
                    <p className="type-1 color-1">Mint has not started yet.</p>
                  )}
                  {hasStarted && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        mint();
                      }}
                    >
                      <div className="spacer">
                        <label className="type-1 color-1">
                          How many would you like to mint?
                        </label>
                        <TextInput
                          value={amount}
                          onChange={(e) => updateAmount(e.currentTarget.value)}
                        />
                        <Button>Mint Now</Button>
                      </div>
                    </form>
                  )}
                </>
              )}
              <ConnectButton />
            </div>
          </Grid>
        </Grid>

        <div style={{ marginTop: "2rem" }}>
          {hasStarted === true && (
            <div>
              <p className="color-3 type-1">Time left</p>
              <p className="color-1 type-1">
                <>
                  {timeLeftInfo.months !== 0 && `${timeLeftInfo.months} month `}
                  {timeLeftInfo.days !== 0 &&
                    `${timeLeftInfo.days} ${
                      timeLeftInfo.days === 1 ? "day" : "days"
                    } `}
                  {timeLeftInfo.hours !== 0 &&
                    `${timeLeftInfo.hours} ${
                      timeLeftInfo.hours === 1 ? "hour" : "hours"
                    } `}
                  {`${timeLeftInfo.minutes} ${
                    timeLeftInfo.minutes === 1 ? "minute" : "minutes"
                  } `}
                  {`${timeLeftInfo.seconds} ${
                    timeLeftInfo.seconds === 1 ? "second" : "seconds"
                  } `}
                </>
              </p>
            </div>
          )}
          {!hasStarted && !loading && (
            <div>
              <p className="color-3 type-1">Starts in</p>
              <p className="color-1 type-1">
                {startInfo.pastEndTime && (
                  <>Starting shortly. Waiting for block.</>
                )}
                {!startInfo.pastEndTime && (
                  <>
                    {startInfo.days !== 0 &&
                      `${startInfo.days} ${
                        startInfo.days === 1 ? "day" : "days"
                      } `}
                    {startInfo.hours !== 0 &&
                      `${startInfo.hours} ${
                        startInfo.hours === 1 ? "hour" : "hours"
                      } `}
                    {`${startInfo.minutes} ${
                      startInfo.minutes === 1 ? "minute" : "minutes"
                    } `}
                    {`${startInfo.seconds} ${
                      startInfo.seconds === 1 ? "second" : "seconds"
                    } `}
                  </>
                )}
              </p>
            </div>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <a
            href="https://github.com/a16z/a16z-contracts/blob/master/licenses/pdf/06%20-%20a16z%20CBE%20Form%20License%20(CBE-Public).pdf"
            className="color-2 type-1"
            target="_blank"
            style={{
              display: "inline-block",
              marginTop: "20px",
              fontSize: "16px",
              textAlign: "center",
            }}
            rel="noreferrer"
          >
            By minting you agree to the CC0 CBE-PUBLIC terms.
          </a>
        </div>
      </div>
    </>
  );
}
