import { Grid } from "@mui/material";
import React, { useState } from "react";
import {
  useAccount,
  useContract,
  useContractRead,
  useNetwork,
  useProvider,
} from "wagmi";
import { Button } from "../Button/Button";
import { ConnectButton } from "../ConnectButton/ConnectButton";
import { Randomizer } from "../Randomizer/Randomizer";
import { TextInput } from "../TextInput/TextInput";
import styles from "./styles.module.scss";
import abi from "../../assets/lpabi.json";
import { ethers } from "ethers";

// export function useAuctionCountdown() {
//     const endTime = useAppStore((store) => store.endTime);
//     const [flip, updateFlip] = useState(false);

//     useEffect(() => {
//       const timeout = setTimeout(() => {
//         updateFlip((f) => !f);
//       }, 1000);

//       return () => {
//         clearTimeout(timeout);
//       };
//     }, [flip]);

//     const end = new BN(endTime ?? "0");
//     const start = new BN(Math.floor(Date.now() / 1000));
//     const pastEndTime = start.gte(end);
//     return {
//       end,
//       start,
//       pastEndTime,
//       flip,
//     };
//   }

//   const endToMsDate = new Date(end.times(1000).toNumber());

//   const formatted = format(endToMsDate, "MMM dd 'at' h:mm:ss a");

export function MintBox() {
  const { isConnected } = useAccount();

  const provider = useProvider({ chainId: 1337 });

  const contract = useContract({
    address: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    abi,
    signerOrProvider: provider,
  });

  const { chain, chains } = useNetwork();
  const [hasStarted, updateHasStarted] = useState<boolean | null>(null);

  const [data, updateData] = useState<any>();

  console.log(chain, chains);

  React.useEffect(() => {
    const fn = async () => {
      const { timestamp: currentBlockTimeStamp } = await provider.getBlock(
        "latest"
      );
      const startTime = await contract?.startTime();
      console.log(startTime.toString());
      updateHasStarted(
        ethers.BigNumber.from(currentBlockTimeStamp).gte(startTime)
      );
      updateData({ startTime: startTime.toString() });
    };
    fn();
  }, []);

  return (
    <div className={styles.wrap}>
      <Grid spacing={5} container>
        <Grid item xs={12} md={6}>
          <div className="spacer">
            <p className="color-2 type-1">Dutch auction</p>
            <p className="color-2 type-1">Max price: 3.33 ETH</p>
            <p className="color-2 type-1">Min price: 0.0333 ETH</p>

            <p className="color-3 type-1">Current price: 1 ETH</p>
            <p className="color-3 type-1">Total remaining: 10000 / 10000</p>
            <p className="color-3 type-1">Time left: 30d 22h 04s</p>
            {hasStarted === false && (
              <p className="color-3 type-1">Starts in: {data?.startTime}</p>
            )}
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          <div className={styles.btnWrap}>
            {isConnected && (
              <>
                <label className="type-1 color-1">
                  How many would you like to mint?
                </label>
                <TextInput />
                <Button>Mint Now</Button>
              </>
            )}
            <ConnectButton />
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
