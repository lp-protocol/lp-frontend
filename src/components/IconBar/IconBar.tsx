import React from "react";
import twitter from "../../assets/twitter.png";
import discord from "../../assets/discord.png";
import etherscan from "../../assets/etherscan.png";
import github from "../../assets/github.png";
import styles from "./styles.module.scss";

const data = [
  { href: "", img: twitter },
  { href: "", img: discord },
  { href: "", img: etherscan },
  { href: "", img: github },
];

export function IconBar() {
  return (
    <div className={styles.wrap}>
      {data.map((icon) => (
        <a key={icon.img} href={icon.href}>
          <img src={icon.img} />
        </a>
      ))}
    </div>
  );
}
