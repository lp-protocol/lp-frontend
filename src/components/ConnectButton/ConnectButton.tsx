import { ConnectKitButton } from 'connectkit';
import { Button } from '../Button/Button';
import { useEnsName, useAccount } from 'wagmi';

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
    <ConnectButtonBase>
      {({ isConnected, isConnecting, show, hide, address, ensName }) => {
        return (
          <>
            {!isConnected && <Button onClick={show}>Connect wallet</Button>}
            {isConnected && (
              <p style={{ fontSize: '18px' }} className="color-2 type-1">
                Connected as {data ?? truncateAddress(address as string)}
              </p>
            )}
          </>
        );
      }}
    </ConnectButtonBase>
  );
}

export function ConnectButtonBase({
  className,
  children,
}: {
  className?: any;
  children: (params: any) => React.ReactNode;
}) {
  const { address } = useAccount();

  const { data, isError, isLoading } = useEnsName({
    address,
  });
  return (
    <ConnectKitButton.Custom>
      {(params) => {
        return children(params);
      }}
    </ConnectKitButton.Custom>
  );
}
