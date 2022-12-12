import BigNumber from 'bignumber.js';
import React from 'react';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import abi from '../assets/lpabi.json';

export function useSell(tokenId: string, writeConfig?: any) {
  const { config, isError } = usePrepareContractWrite({
    address: process.env.REACT_APP_LP_CONTRACT,
    abi,
    functionName: 'sell',
    enabled: true,
    args: [tokenId],
  });

  let gasLimit = new BigNumber(config?.request?.gasLimit.toString() ?? '0');
  gasLimit = gasLimit.plus(gasLimit.times(0.25));

  const writeData = useContractWrite({
    ...config,
    request: {
      ...config.request,
      gasLimit: gasLimit.toFixed(),
    },
    ...writeConfig,
  } as any);

  return writeData;
}
