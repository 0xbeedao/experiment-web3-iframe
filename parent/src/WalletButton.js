import { Button, Text, Tooltip } from "@chakra-ui/react";
import { useWallet } from "@raidguild/quiver";
import { useMemo } from "react";

import LimitedText from "./LimitedText";

export default function WalletButton() {
  const {
    connectWallet,
    isConnecting,
    isConnected,
    disconnect,
    address,
    chainId,
    networks,
  } = useWallet();

  let label = "Connecting ...";
  if (!isConnecting) {
    label = isConnected ? "Connected" : "Connect Wallet";
  }

  const tip = useMemo(() => {
    const network = networks[chainId] ? networks[chainId].name : "Unknown";

    if (isConnected) {
      return (
        <Text>
          Connected to {network}
          <br />
          click to disconnect
        </Text>
      );
    }
    return <Text>Connect to {network}</Text>;
  }, [networks, chainId, isConnected]);

  return (
    <>
      {!isConnected && (
        <Button
          disabled={isConnecting}
          onClick={() => !isConnected && connectWallet()}
        >
          {label}
        </Button>
      )}
      {isConnected && (
        <Tooltip label={tip} placement="bottom-start">
          <Button onClick={() => disconnect()}>
            <LimitedText
              text={address}
              maxLength={10}
              fromEnd={4}
            ></LimitedText>
          </Button>
        </Tooltip>
      )}
    </>
  );
}
