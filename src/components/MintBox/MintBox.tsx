import { Grid } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
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

export function MintBox() {
  const { chain } = useNetwork();
  const { isConnected, address } = useAccount();
  const [amount, updateAmount] = useState("");
  const bnAmount = new BigNumber(amount || "0");

  const provider = useProvider({ chainId: chain?.id });
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
      gasLimit: gasLimit.toFixed(),
    },
  } as any);

  React.useEffect(() => {
    const fn = async () => {
      const { timestamp: currentBlockTimeStamp } = await provider.getBlock(
        "latest"
      );
      const startTime = await contractRead?.startTime();
      const endTime = await contractRead?.endTime();
      const currentMintPrice = await contractRead?.getCurrentMintPrice();

      updateHasStarted(
        ethers.BigNumber.from(currentBlockTimeStamp).gte(startTime)
      );
      updateData({
        startTime: startTime.toString(),
        endTime: endTime.toString(),
        currentMintPrice: currentMintPrice,
        currentMintPriceDisplay: new BigNumber(currentMintPrice.toString())
          .div(10 ** 18)
          .toFixed(4),
      });
    };
    fn();
  }, [contractRead, provider]);

  const startInfo = useCountDown(data?.startTime);
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
          <p className="color-2 type-1">Max price: 3.33 ETH</p>
        </Grid>
        <Grid item xs={12} sm={4}>
          <p className="color-2 type-1">Min price: 0.0333 ETH</p>
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
                <p className="color-3 type-1">Total remaining</p>
                <p className="color-1 type-1">10000 / 10000</p>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <div className={styles.btnWrap}>
              {isConnected && (
                <>
                  {!hasStarted && (
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
          {hasStarted === false && (
            <div>
              <p className="color-3 type-1">Starts in</p>
              <p className="color-1 type-1">
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
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
