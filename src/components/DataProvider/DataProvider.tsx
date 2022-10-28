import { BigNumber } from "ethers";
import React, { useCallback, useState } from "react";
import { chain, useAccount, useContract, useNetwork, useProvider } from "wagmi";
import abi from "../../assets/lpabi.json";

export type RawToken = {
  tokenId: string;
  name: string;
  image: string;
  description: string;
};

export type Tokens = {
  [tokenId: string]: RawToken;
};

type Data = {
  ownedTokens?: Tokens;
  tokensForSale?: Tokens;
  buyPrice?: string;
  sellPrice?: string;
  getAllData?: () => Promise<void>;
  lockedIn?: boolean;
};

export const DataProviderContext = React.createContext<Data>({});

const tokenCb = (t: BigNumber): RawToken => {
  const id = t.toString();
  return {
    tokenId: id,
    name: `The LP #${id}`,
    image: "",
    description: "",
  };
};

const tokenReduce = (a: Tokens, token: RawToken) => {
  a[token.tokenId] = token;
  return a;
};

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { chain } = useNetwork();
  const provider = useProvider({ chainId: chain?.id });
  const { isConnected, address } = useAccount();
  const contractRead = useContract({
    address: process.env.REACT_APP_LP_CONTRACT,
    abi,
    signerOrProvider: provider,
  });

  const [data, updateData] = useState<any>({});

  const getAllTokens = useCallback(async () => {
    let ownedTokens: any;
    if (isConnected) {
      ownedTokens = (await contractRead?.tokensOfOwner(address))
        .map(tokenCb)
        .reduce(tokenReduce, {});
    }

    const tokensForSale = (
      await contractRead?.tokensOfOwner(process.env.REACT_APP_LP_CONTRACT)
    )
      .map(tokenCb)
      .reduce(tokenReduce, {});

    updateData((d: any) => ({
      ...d,
      ownedTokens,
      tokensForSale,
    }));

    return { tokensForSale, ownedTokens };
  }, [contractRead, address, isConnected]);

  const getAllData = useCallback(async () => {
    const buyPrice = await contractRead?.getBuyPrice();
    const sellPrice = (await contractRead?.getSellPrice()).toString();
    const lockedIn = await contractRead?.lockedIn();
    await getAllTokens();
    updateData((d: any) => ({
      ...d,
      buyPrice: buyPrice[0].toString(),
      sellPrice,
      lockedIn,
    }));
  }, [contractRead, getAllTokens]);

  React.useEffect(() => {
    getAllData();
  }, [getAllData]);
  return (
    <DataProviderContext.Provider
      value={{ ...data, updateData, getAllData, getAllTokens, contractRead }}
    >
      {children}
    </DataProviderContext.Provider>
  );
}
