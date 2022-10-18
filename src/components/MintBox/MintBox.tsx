import { Grid } from '@mui/material';
import React from 'react'
import { Button } from '../Button/Button';
import styles from './styles.module.scss';

export function MintBox() {
    return (
        <div className={styles.wrap}>
            <Grid container>
                <Grid item xs={12} md={6}>
                    <p className='color-2 type-1'>Dutch auction</p>
                    <p className='color-2 type-1'>Max price: 5 ETH</p>
                    <p className='color-2 type-1'>Min price: 0.025 ETH</p>

                    <p className="color-3 type-1">Current price: 1 ETH</p>
                    <p className="color-3 type-1">Total minted: 420</p>
                    <p className="color-3 type-1">30d 22h 04s remain</p>
                </Grid>
                <Grid item xs={12} md={6}>
                    <div className={styles.btnWrap}>
                        <Button>Connect Wallet</Button>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}