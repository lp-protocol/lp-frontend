import React from "react";
import { useContract, useNetwork, useProvider, useSigner } from "wagmi";
import abi from "../assets/lpabi.json";

export function useLpContractRead() {
  const { chain } = useNetwork();
  const provider = useProvider({ chainId: chain?.id });
  const { data: signer } = useSigner({ chainId: chain?.id });
  const contractRead = useContract({
    address: process.env.REACT_APP_LP_CONTRACT,
    abi,
    signerOrProvider: provider,
  });
  return contractRead;
}
