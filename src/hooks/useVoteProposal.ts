import { useCallback } from "react";
import { liskSepoliaNetwork } from "../connection";
import { useState } from "react";
import useContract from "./useContract";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import { toast } from "react-toastify";
import { ErrorDecoder, DecodedError } from "ethers-decode-error";
import abi from "../ABI/proposal.json";
import { ErrorDescription } from "ethers";

const errorDecoder = ErrorDecoder.create([abi]);

type CustomError = DecodedError & {
  args: ErrorDescription['args'];
};

const customReasonMapper = (error: CustomError): string => {
  const { name, args, reason } = error;
  switch (name) {
    case "AlreadyVoted":
      return `You have already voted on this proposal.`;
    case "InvalidProposalId":
      return `Invalid proposal ID: ${args.proposalId || args[0]}.`;
    case "ProposalAlreadyExecuted":
      return `This proposal has already been executed.`;
    case "DeadlinePassed":
      return `The voting deadline for this proposal has passed.`;
    default:
      return reason ?? "An error has occurred";
  }
};

const useVoteProposals = () => {
  const contract = useContract(true);
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();
  const [isVoting, setIsVoting] = useState(false);

  return {
    vote: useCallback(
      async (proposalId: number) => {
        if (!proposalId) {
          toast.error("Missing proposal Id Field!");
          return;
        }

        setIsVoting(true);
        if (!address) {
          toast.error("Connect your wallet!");
          setIsVoting(false);
          return;
        }
        if (Number(chainId) !== liskSepoliaNetwork.chainId) {
          toast.error(
            "You are not connected to the right network, Please connect to liskSepolia"
          );
          setIsVoting(false);
          return;
        }

        if (!contract) {
          toast.error("Cannot get contract!");
          setIsVoting(false);
          return;
        }

        try {
          const estimatedGas = await contract.vote.estimateGas(proposalId);

          const tx = await contract.vote(proposalId, {
            gasLimit: (estimatedGas * BigInt(120)) / BigInt(100),
          });

          const reciept = await tx.wait();

          if (reciept.status === 1) {
            toast.success("Proposal vote successful");
            setIsVoting(false);
            return;
          }
          toast.error("Proposal vote failed");
          setIsVoting(false);
          return;
        } catch (error: unknown) {
          const decodedError = await errorDecoder.decode(error as Error) as CustomError;
          const reason = customReasonMapper(decodedError);

          // Prints "Invalid swap with token contract address 0xabcd."
          console.log("Custom error reason:", reason);
          console.log("Decoded error:", decodedError);
          // // Prints "true"
          // console.log(type === ErrorType.CustomError);
          toast.error(decodedError.reason);
          console.error(
            "error while executing proposal: ",
            decodedError.reason
          );
          setIsVoting(false);
        }
        return;
      },
      [address, chainId, contract]
    ),
    isVoting,
  };
};

export default useVoteProposals;