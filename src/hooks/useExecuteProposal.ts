import { useCallback, useState } from "react";
import { liskSepoliaNetwork } from "../connection";
import useContract from "./useContract";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import { toast } from "react-toastify";
import { ErrorDecoder, DecodedError } from "ethers-decode-error";
import { Contract, ContractTransactionResponse } from "ethers";
import abi from '../ABI/proposal.json';
import { ErrorDescription } from "ethers";

const errorDecoder = ErrorDecoder.create([abi]);

type CustomError = DecodedError & {
  args: ErrorDescription['args'];
};

const customReasonMapper = (error: CustomError): string => {
  const { name, args, reason } = error;
  switch (name) {
    case "InvalidSwapToken":
      return `Invalid swap with token contract address ${args.token || args[0]}.`;
    default:
      return reason ?? "An error has occurred";
  }
};

interface ExecuteProposalHook {
  execute: (proposalId: number) => Promise<void>;
  loading: boolean;
}

const useExecuteProposal = (): ExecuteProposalHook => {
  const contract = useContract(true) as Contract | null;
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  const execute = useCallback(
    async (proposalId: number): Promise<void> => {
      if (!proposalId) {
        toast.error("Missing proposal Id Field!");
        return;
      }

      setIsExecuting(true);

      if (!address) {
        toast.error("Connect your wallet!");
        setIsExecuting(false);
        return;
      }

      if (Number(chainId) !== liskSepoliaNetwork.chainId) {
        toast.error(
          "You are not connected to the right network, Please connect to liskSepolia"
        );
        setIsExecuting(false);
        return;
      }

      if (!contract) {
        toast.error("Cannot get contract!");
        setIsExecuting(false);
        return;
      }

      try {
        console.log(proposalId);
        const tx: ContractTransactionResponse = await contract.executeProposal(proposalId);

        const receipt = await tx.wait();

        if (receipt && receipt.status === 1) {
          toast.success("Proposal execution successful");
        } else {
          toast.error("Proposal execution failed");
        }
      } catch (error: unknown) {
        const decodedError = await errorDecoder.decode(error as Error) as CustomError;
        const reason = customReasonMapper(decodedError);

        console.log("Custom error reason:", reason);
        console.log("Decoded error:", decodedError);

        toast.error(decodedError.reason || "An error occurred");
        console.error("error while executing proposal: ", decodedError.reason);
      } finally {
        setIsExecuting(false);
      }
    },
    [address, chainId, contract]
  );

  return {
    execute,
    loading: isExecuting,
  };
};

export default useExecuteProposal;