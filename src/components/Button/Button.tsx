import React from 'react';
import styles from './styles.module.scss';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  style?: React.CSSProperties;
  disabled?: boolean;
};

export function Button({ disabled, children, onClick, style }: ButtonProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={style}
      className={styles.btn}
    >
      {children}
    </button>
  );
}
