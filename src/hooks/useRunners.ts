import { useAppKitProvider } from "@reown/appkit/react";
import { BrowserProvider, ethers, Signer, Eip1193Provider } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { jsonRpcProvider } from "../constants/provider";

const useRunners = () => {
    const [signer, setSigner] = useState<Signer | undefined>(undefined);
    const { walletProvider  } = useAppKitProvider("eip155");

    
    const provider = useMemo<BrowserProvider | null>(
        () => (walletProvider ? new ethers.BrowserProvider(walletProvider as  Eip1193Provider) : null),
        [walletProvider]
    );
    useEffect(() => {
        if (!provider) return;
        const fetchSigner = async () => {
            try {
                const newSigner = await provider.getSigner();
                setSigner(newSigner);
            } catch (error) {
                console.error("Error getting signer:", error);
                setSigner(undefined);
            }
        };

        fetchSigner();
        // const signer = provider.getSigner().then((newSigner) => {
        //     setSigner(newSigner);
        // });
        // setSigner(signer);
    }, [provider, signer]);
    return { provider, signer, readOnlyProvider: jsonRpcProvider };
};

export default useRunners;