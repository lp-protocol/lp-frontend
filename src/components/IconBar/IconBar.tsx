import React from 'react';
import twitter from '../../assets/twitter.png';
import discord from '../../assets/discord.png';
import etherscan from '../../assets/etherscan.png';
import github from '../../assets/github.png';
import styles from './styles.module.scss';

const data = [
  { href: 'https://twitter.com/TheLPxyz', img: twitter },
  { href: 'https://discord.gg/GNUHtbyFyB', img: discord },
  {
    href: 'https://etherscan.io/address/0x38930aae699c4cd99d1d794df9db41111b13092b',
    img: etherscan,
  },
  { href: 'https://github.com/lp-protocol', img: github },
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
