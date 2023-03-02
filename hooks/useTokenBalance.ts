import { useChain } from "@cosmos-kit/react";
import { useEffect, useState } from "react";
import { Cw20QueryClient } from "../codegen/Cw20.client";
import { chainName } from "../config";

export function useTokenBalance(contractAddress: string) {
  // offline signer
  const { getCosmWasmClient, address } = useChain(chainName);
  const [cw20Client, setCw20Client] = useState<Cw20QueryClient | null>(null);
  const [balance, setBalance] = useState<string | null>(null);

  // cw20 client
  useEffect(() => {
    getCosmWasmClient().then((cosmWasmClient) => {
      if (!cosmWasmClient) {
        console.error("No CosmWasmClient!");
        return;
      }

      const newClient = new Cw20QueryClient(cosmWasmClient, contractAddress);
      setCw20Client(newClient);
    });
  }, [contractAddress, getCosmWasmClient]);

  // query and return token balance
  useEffect(() => {
    if (cw20Client && address) {
      cw20Client.balance({ address }).then((res) => setBalance(res.balance));
    }
  }, [address, cw20Client]);

  return balance ?? undefined;
}
