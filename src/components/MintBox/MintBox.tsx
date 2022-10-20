import { Grid } from "@mui/material";
import React from "react";
import { useAccount } from "wagmi";
import { Button } from "../Button/Button";
import { ConnectButton } from "../ConnectButton/ConnectButton";
import { Randomizer } from "../Randomizer/Randomizer";
import { TextInput } from "../TextInput/TextInput";
import styles from "./styles.module.scss";

export function MintBox() {
  const { isConnected } = useAccount();

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
