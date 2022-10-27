import React, { useState } from "react";
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

  React.useEffect(() => {
    const fn = async () => {
      console.log(`${isConnected}, IS CONNECTED`);
      if (isConnected) {
        const ownedTokens = await contractRead?.tokensOfOwner(address);
        const tokensForSale = await contractRead?.tokensOfOwner(
          process.env.REACT_APP_LP_CONTRACT
        );
        const buyPrice = await contractRead?.getBuyPrice();
        const sellPrice = await contractRead?.getSellPrice();
        const lockedIn = await contractRead?.lockedIn();
        updateData({
          ownedTokens,
          tokensForSale,
          buyPrice,
          sellPrice,
          lockedIn,
        });
      }
    };

    fn();
  }, [isConnected, address, contractRead]);
  console.log(data);
  return (
    <DataProviderContext.Provider value={data}>
      {children}
    </DataProviderContext.Provider>
  );
}
