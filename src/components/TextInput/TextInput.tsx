import React from "react";
import styles from "./styles.module.scss";

type TextInputProps = {
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

export function TextInput({ value, onChange }: TextInputProps) {
  return (
    <input
      className={styles.input}
      type="text"
      value={value}
      placeholder="Enter mint amount.."
      onChange={onChange}
    />
  );
}
