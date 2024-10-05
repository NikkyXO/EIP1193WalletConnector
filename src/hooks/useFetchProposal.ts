import { useCallback, useEffect, useMemo, useState } from "react";
import { Contract, Interface } from "ethers";
import { useAppKitNetwork } from "@reown/appkit/react";
import { toast } from "react-toastify";
import multicallAbi from "../ABI/multicall2.json";
import proposalAbi from "../ABI/proposal.json";
import ABI from "../ABI/proposal.json";
import { multicall2Address, proposalsContractAddress } from "../constants";
import { liskSepoliaNetwork } from "../connection";
import useContract from "./useContract";
import useRunners from "./useRunners";

interface Proposal {
  id: number;
  deadline: number;
  minRequiredVote: number;
  amount: number;
  description: string;
  executed: boolean;
  votecount: number;
}

interface UseFetchProposalsResult {
  proposals: Proposal[];
  isFetchingProposals: boolean;
}

const useFetchProposals = (): UseFetchProposalsResult => {
  const { chainId } = useAppKitNetwork();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isFetchingProposals, setIsFetchingProposals] = useState<boolean>(false);

  const intfce = useMemo(() => new Interface(proposalAbi), []);

  const readOnlyProposalContract = useContract(true);
  const { readOnlyProvider } = useRunners();

  const fetchProposals = useCallback(async () => {
    if (!readOnlyProposalContract) return;
    if (Number(chainId) !== liskSepoliaNetwork.chainId) {
      toast.error(
        "You are not connected to the right network, Please connect to liskSepolia"
      );
      return;
    }
    try {
      setIsFetchingProposals(true);

      const proposalCount = Number(
        await readOnlyProposalContract.proposalCount()
      );

      const ids = Array.from({ length: proposalCount }, (_, i) => i + 1);

      ids.pop();

      const calls = ids.map((id) => ({
        target: proposalsContractAddress,
        callData: intfce.encodeFunctionData("proposals", [id]),
      }));

      const multicall = new Contract(
        multicall2Address,
        multicallAbi,
        readOnlyProvider
      );

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, proposalsResult] = await multicall.aggregate.staticCall(calls);

      const decodedProposals = proposalsResult.map((result: string) =>
        intfce.decodeFunctionResult("proposals", result)
      );

      setProposals(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        decodedProposals.map((proxy: any, idx: number) => ({
          id: idx + 1,
          deadline: proxy.votingDeadline,
          minRequiredVote: Number(proxy.minVotesToPass),
          amount: proxy.amount,
          description: proxy.description,
          executed: proxy.executed,
          votecount: Number(proxy.voteCount),
        }))
      );
      setIsFetchingProposals(false);
    } catch (error) {
      console.log("An error occurred: ", error);
      setIsFetchingProposals(false);
    }
  }, [readOnlyProposalContract, readOnlyProvider, intfce, chainId]);

  const updateProposal = useCallback((proposalId: number) => {
    console.log("updating proposals");

    setProposals((prevProposals) =>
      prevProposals.map((proposal) => {
        if (proposal.id === proposalId) {
          console.log(
            "updated voteCount of proposal with index:::",
            proposalId
          );
          return {
            ...proposal,
            votecount: proposal.votecount + 1,
          };
        }
        return proposal;
      })
    );
  }, []);

  const handleVoted = useCallback((updatedValue: string) => {
    console.log("updatedValue", updatedValue);
    updateProposal(Number(updatedValue));
    console.log(proposals);
  }, [updateProposal, proposals]);

  const handleProposalExecuted = useCallback((_proposalId: string) => {
    console.log("Proposal with id: ", _proposalId ," was Executed");
    setProposals((prevProposals) =>
      prevProposals.map((proposal) => {
        if (proposal.id === Number(_proposalId)) {
          console.log(
            "updated executed of proposal with index:::",
            _proposalId
          );
          return {
            ...proposal,
            executed: true,
          };
        }
        return proposal;
      })
    );
  }, []);

  const handleProposalCreated = useCallback(
    (
      proposalId: string,
      description: string,
      recipient: string,
      amount: number,
      votingDeadline: number,
      minRequiredVote: number
    ) => {
      console.log("Proposal Creation Value:::", {
        proposalId,
        description,
        recipient,
        amount,
        votingDeadline,
        minRequiredVote,
      });

      setProposals((prev) => [
        ...prev,
        {
          id: Number(proposalId),
          deadline: votingDeadline,
          minRequiredVote: Number(minRequiredVote),
          amount,
          description,
          executed: false,
          votecount: 0,
        },
      ]);
    },
    []
  );

  useEffect(() => {
    fetchProposals();

    const contract = new Contract(
      import.meta.env.VITE_CONTRACT_ADDRESS,
      ABI,
      readOnlyProvider
    );

    contract.on("ProposalCreated", handleProposalCreated);

    return () => {
      contract.off("ProposalCreated", handleProposalCreated);
    };
  }, [intfce, readOnlyProposalContract, readOnlyProvider, fetchProposals, handleProposalCreated]);

  useEffect(() => {
    const contract = new Contract(
      import.meta.env.VITE_CONTRACT_ADDRESS,
      ABI,
      readOnlyProvider
    );

    contract.on("Voted", handleVoted);

    return () => {
      contract.off("Voted", handleVoted);
    };
  }, [intfce, readOnlyProposalContract, readOnlyProvider, handleVoted]);

  useEffect(() => {
    const contract = new Contract(
      import.meta.env.VITE_CONTRACT_ADDRESS,
      ABI,
      readOnlyProvider
    );

    contract.on("ProposalExecuted", handleProposalExecuted);

    return () => {
      contract.off("ProposalExecuted", handleProposalExecuted);
    };
  }, [intfce, readOnlyProposalContract, readOnlyProvider, handleProposalExecuted]);

  return { proposals, isFetchingProposals };
};

export default useFetchProposals;