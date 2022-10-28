import BigNumber from "bignumber.js";
import React from "react";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import abi from "../assets/lpabi.json";

export function useBuy(
  tokenId: string,
  writeConfig?: any,
  enabled?: boolean,
  onSuccess?: () => void
) {
  const { config } = usePrepareContractWrite({
    address: process.env.REACT_APP_LP_CONTRACT,
    abi,
    functionName: "buy",
    enabled: enabled,
    args: [tokenId],
    onSuccess,
  });

  let gasLimit = new BigNumber(config?.request?.gasLimit.toString() ?? "0");
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
