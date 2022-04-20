import "./App.css";

import { ChakraProvider, useToast } from "@chakra-ui/react";
import { WalletProvider } from "@raidguild/quiver";
import WalletConnectProvider from "@walletconnect/web3-provider";
import ethProvider from "eth-provider";

import Home from "./Home";

const SUPPORTED_NETWORKS = {
  "0x89": {
    chainId: "0x89",
    name: "Polygon",
    symbol: "MATIC",
    explorer: "https://polygonscan.com",
    rpc: "https://polygon-rpc.com/",
  },
};

const PROVIDER_OPTIONS = {
  frame: {
    package: ethProvider,
  },
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        0x89: SUPPORTED_NETWORKS["0x89"].rpc,
      },
    },
  },
};

const DEFAULT_NETWORK = "0x89";

function App({ Component, pageProps }) {
  const web3ModalOptions = {
    cacheProvider: true,
    providerOptions: PROVIDER_OPTIONS,
  };
  const toast = useToast();

  return (
    <>
      <ChakraProvider>
        <WalletProvider
          networks={SUPPORTED_NETWORKS}
          defaultChainId={DEFAULT_NETWORK}
          web3modalOptions={web3ModalOptions}
          handleModalEvents={(eventName, error) => {
            if (error) {
              console.error(error);

              toast({
                title: "Error",
                description: error.message,
                status: "error",
                duration: 9000,
                isClosable: true,
              });
            }
            console.log(eventName);
          }}
        >
          <Home />
        </WalletProvider>
      </ChakraProvider>
    </>
  );
}

export default App;
