import Head from "next/head";
import {
  Box,
  Heading,
  Container,
  Button,
  Flex,
  Icon,
  useColorMode,
  Input,
} from "@chakra-ui/react";
import { BsFillMoonStarsFill, BsFillSunFill } from "react-icons/bs";
import { WalletSection } from "../components";
import { chainName, cw20ContractAddress } from "../config";
import { useTokenBalance } from "../hooks/useTokenBalance";
import { useState } from "react";
import { useChain } from "@cosmos-kit/react";
import { Cw20Client } from "../codegen/Cw20.client";

export default function Home() {
  const { colorMode, toggleColorMode } = useColorMode();
  const balance = useTokenBalance(cw20ContractAddress);
  const [amount, setAmount] = useState<string | undefined>(undefined);
  const [recipient, setRecipient] = useState<string | undefined>(undefined);
  const [txHash, setTxHash] = useState<string | undefined>(undefined);

  const { getSigningCosmWasmClient, address } = useChain(chainName);

  const handleRecipient = (e: any) => {
    setRecipient(e.target.value);
  };

  const handleAmount = (e: any) => {
    setAmount(e.target.value);
  };

  const handleSend = async () => {
    const cosmWasmClient = await getSigningCosmWasmClient();

    if (!cosmWasmClient || !address) {
      console.error("No cosmWasmClient or No address!");
      return;
    }

    const client = new Cw20Client(cosmWasmClient, address, cw20ContractAddress);

    if (!client) {
      console.error("no client, please connect your wallet!");
      return;
    }

    if (!amount || !recipient) {
      console.error("No amount or recipient!");
      return;
    }

    const result = await client.transfer({ amount, recipient });
    console.log(result);

    setTxHash(result.transactionHash);
  };

  return (
    <Container maxW="5xl" py={10}>
      <Head>
        <title>Create Cosmos App</title>
        <meta name="description" content="Generated by create cosmos app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex justifyContent="end" mb={4}>
        <Button variant="outline" px={0} onClick={toggleColorMode}>
          <Icon
            as={colorMode === "light" ? BsFillMoonStarsFill : BsFillSunFill}
          />
        </Button>
      </Flex>
      <Box textAlign="center">
        <Heading
          as="h1"
          fontSize={{ base: "3xl", sm: "4xl", md: "5xl" }}
          fontWeight="extrabold"
          mb={3}
        >
          Cosmos App
        </Heading>
      </Box>
      <WalletSection />
      <Box textAlign="center">
        <p>Your token balance is: {balance}</p>

        <Input
          placeholder="Address"
          value={recipient}
          onChange={handleRecipient}
        />
        <Input placeholder="Amount" value={amount} onChange={handleAmount} />
        <Button onClick={handleSend}>Send!</Button>
      </Box>
    </Container>
  );
}
