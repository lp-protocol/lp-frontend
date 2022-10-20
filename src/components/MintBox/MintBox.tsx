import { Grid } from "@mui/material";
import React from "react";
import { Button } from "../Button/Button";
import { Randomizer } from "../Randomizer/Randomizer";
import styles from "./styles.module.scss";

export function MintBox() {
  return (
    <div className={styles.wrap}>
      <Grid container>
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
            <Button>Connect Wallet</Button>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
