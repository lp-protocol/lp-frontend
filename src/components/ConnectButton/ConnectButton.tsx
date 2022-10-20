import { ConnectKitButton } from "connectkit";
import { Button } from "../Button/Button";
import { useEnsName, useAccount } from "wagmi";

export function truncateAddress(address: string) {
  return `${address.substring(0, 4)}...${address.substring(
    address.length - 4
  )}`;
}

export function ConnectButton({ className }: { className?: any }) {
  const { address } = useAccount();

  const { data, isError, isLoading } = useEnsName({
    address,
  });
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, isConnecting, show, hide, address, ensName }) => {
        return (
          <>
            {!isConnected && <Button onClick={show}>Connect wallet</Button>}
            {isConnected && (
              <p style={{ fontSize: "18px" }} className="color-2 type-1">
                Connected as {data ?? truncateAddress(address as string)}
              </p>
            )}
          </>
        );
      }}
    </ConnectKitButton.Custom>
  );
}
