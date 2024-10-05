import React from 'react';
import { Flex, Text } from "@radix-ui/themes";
import Proposal from "./Proposal";
import { BigNumberish } from 'ethers';

interface ProposalData {
  id: number;
  deadline: number;
  minRequiredVote: number;
  amount: BigNumberish;
  description: string;
  executed: boolean;
  votecount: number;
}

interface ProposalsProps {
  proposals: ProposalData[];
  isFetchingProposals: boolean;
}

const Proposals: React.FC<ProposalsProps> = ({ proposals, isFetchingProposals }) => {
  return (
    <Flex className="w-full flex max-w-7xl mx-auto items-center justify-center pb-10 gap-4 flex-wrap">
      {isFetchingProposals ? (
        <Text>Fetching Proposals</Text>
      ) : proposals.length === 0 ? (
        <Text>No data to display</Text>
      ) : (
        proposals.map(({
          id,
          deadline,
          minRequiredVote,
          amount,
          description,
          executed,
          votecount,
        }) => (
          <Proposal
            key={`${id}-${deadline}`}
            id={id}
            amount={amount}
            deadline={deadline}
            description={description}
            executed={executed}
            minRequiredVote={minRequiredVote}
            votecount={votecount}
          />
        ))
      )}
    </Flex>
  );
};

export default Proposals;