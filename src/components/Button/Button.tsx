import React from "react";
import styles from "./styles.module.scss";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

export function Button({ children, onClick }: ButtonProps) {
  return (
    <button onClick={onClick} className={styles.btn}>
      {children}
    </button>
  );
}
