import React from "react";
import styles from "./styles.module.scss";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
};

export function Button({ children, onClick, style }: ButtonProps) {
  return (
    <button onClick={onClick} style={style} className={styles.btn}>
      {children}
    </button>
  );
}
