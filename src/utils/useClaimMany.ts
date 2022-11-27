import React, { useMemo } from "react";
import { BigNumber } from "ethers";
import { useContractWrite, usePrepareContractWrite } from "wagmi";

const claimManyAbi = [
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "nftIds",
        type: "uint256[]",
      },
    ],
    name: "claimMany",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export function useClaimMany(
  tokenIds: string[],
  writeConfig?: ReturnType<
    typeof useContractWrite<typeof claimManyAbi, "claimMany">
  >
) {
  const tokens = useMemo(
    () => tokenIds.map((tokenId) => BigNumber.from(tokenId)),
    [tokenIds]
  );
  const { config } = usePrepareContractWrite({
    address: process.env.REACT_APP_LP_CONTRACT,
    abi: claimManyAbi,
    functionName: "claimMany",
    enabled: tokenIds.length > 0,
    args: [tokens],
  });

  const gasLimit = BigNumber.from(config?.request?.gasLimit.toString() ?? "0");

  const writeData = useContractWrite({
    ...config,
    request: {
      ...config.request,
      gasLimit: gasLimit.add(gasLimit.div(4)),
    },
    ...writeConfig,
  });

  return writeData;
}
