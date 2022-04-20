import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import { useWallet } from "@raidguild/quiver";
import { formatUnits } from "ethers/lib/utils";
import React, { useCallback, useEffect, useState } from "react";

import WalletButton from "./WalletButton";

export default function Home() {
  const [balance, setBalance] = useState("---");
  const { address, isConnected, provider } = useWallet();

  const handleQuery = useCallback(async () => {
    if (!isConnected) {
      return;
    }
    const bal = await provider.getBalance(address);
    setBalance(formatUnits(bal, 18));
  }, [address, isConnected, provider]);

  useEffect(() => {
    // let the other component know that we are connected
    if (isConnected) {
      const frame = document.getElementById("childframe");
      if (frame) {
        const whichProvider = localStorage.getItem(
          "WEB3_CONNECT_CACHED_PROVIDER"
        );
        const msg = {
          type: "web3",
          connected: true,
          address,
          provider: whichProvider,
        };
        console.log("connect post", msg);
        frame.contentWindow.postMessage(msg, "*");
      }
    }
  }, [address, isConnected]);

  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <VStack spacing="1rem">
        <Heading>Parent scope</Heading>
        <Box>
          <WalletButton />
        </Box>
        <Box borderTop="1px solid black">
          <Heading>Parent Scope Web3 Query</Heading>
          <Box>
            <Button onClick={handleQuery} disabled={!isConnected}>
              Check Balance
            </Button>
            <Box border="1px solid purple">
              <Text>{balance}</Text>
            </Box>
          </Box>
        </Box>
        <Box borderTop="1px solid red" width="100%" height="auto">
          <iframe
            id="childframe"
            src="http://localhost:3001/"
            title="Child frame"
            width={1000}
            height={1000}
          />
        </Box>
      </VStack>
    </Box>
  );
}
