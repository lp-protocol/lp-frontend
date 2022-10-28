import React, { useCallback, useState } from "react";
import { chain, useAccount, useContract, useNetwork, useProvider } from "wagmi";
import abi from "../../assets/lpabi.json";

export const DataProviderContext = React.createContext<any>({});

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
      ownedTokens = await contractRead?.tokensOfOwner(address);
    }

    const tokensForSale = await contractRead?.tokensOfOwner(
      process.env.REACT_APP_LP_CONTRACT
    );

    console.log(tokensForSale, ownedTokens);

    updateData((d: any) => ({
      ...d,
      ownedTokens,
      tokensForSale,
    }));

    return { tokensForSale, ownedTokens };
  }, [contractRead, address, isConnected]);

  const getAllData = useCallback(async () => {
    const buyPrice = await contractRead?.getBuyPrice();
    const sellPrice = await contractRead?.getSellPrice();
    const lockedIn = await contractRead?.lockedIn();
    await getAllTokens();
    updateData((d: any) => ({
      ...d,
      buyPrice,
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
