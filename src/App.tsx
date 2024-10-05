import { Box } from "@radix-ui/themes";
import Layout from "./components/Layout";
import CreateProposalModal from "./components/CreateProposalModal";
import Proposals from "./components/Propasals";
import useFetchProposals from "./hooks/useFetchProposal";

const App: React.FC = () => {
  const { proposals, isFetchingProposals } = useFetchProposals();

  return (
    <Layout>
      <Box className="flex justify-end p-4">
        <CreateProposalModal />
      </Box>
      <Proposals proposals={proposals} isFetchingProposals={isFetchingProposals}/>
    </Layout>
  );
};

export default App;
