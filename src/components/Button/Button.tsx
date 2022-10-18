import React from 'react';
import styles from './styles.module.scss';

type ButtonProps = {
    children: React.ReactNode;
}

export function Button({ children }: ButtonProps) {
    return (
        <button className={styles.btn}>
            {children}
        </button>
    )
}