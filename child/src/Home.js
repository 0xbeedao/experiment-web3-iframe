import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import { useWallet } from "@raidguild/quiver";
import { formatUnits } from "ethers/lib/utils";
import React, { useCallback, useEffect, useState } from "react";

import WalletButton from "./WalletButton";

export default function Home() {
  const [balance, setBalance] = useState("---");
  const { address, isConnected, provider, connectWallet } = useWallet();

  useEffect(() => {
    window.onmessage = (event) => {
      if (event?.data?.type === "web3") {
        const { connected, address, provider } = event.data;
        if (connected && address && provider) {
          localStorage.setItem("WEB3_CONNECT_CACHED_PROVIDER", provider);
          console.log("connecting now", provider);
          connectWallet();
        }
      }
    };
  }, [connectWallet]);

  const handleQuery = useCallback(async () => {
    if (!isConnected) {
      return;
    }
    const bal = await provider.getBalance(address);
    setBalance(formatUnits(bal, 18));
  }, [address, isConnected, provider]);

  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <VStack spacing="1rem">
        <Heading>Child scope</Heading>
        <Box>
          <WalletButton />
        </Box>
        <Box borderTop="1px solid black">
          <Heading>Child Scope Web3 Query</Heading>
          <Box>
            <Button onClick={handleQuery} disabled={!isConnected}>
              Check Balance
            </Button>
            <Box border="1px solid purple">
              <Text>{balance}</Text>
            </Box>
          </Box>
        </Box>
      </VStack>
    </Box>
  );
}
