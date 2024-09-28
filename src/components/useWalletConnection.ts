

// useWalletConnection.ts
import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';


export const useWalletConnection = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const ethereum = window.ethereum;
        await ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer =  provider.getSigner();
        const address = await signer.getAddress();
        const network = await provider.getNetwork();
        
        setAccount(address);
        setChainId(network.chainId.toString());
        setIsConnected(true);
      } catch (error) {
        console.error('Failed to connect:', error);
      }
    } else {
      console.error('Ethereum object not found, install MetaMask.');
    }
  }, []);

  const disconnect = useCallback(() => {
    setAccount(null);
    setChainId(null);
    setBalance(null);
    setIsConnected(false);
  }, []);

  const getBalance = useCallback(async (address: string) => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(address);
        setBalance(ethers.utils.formatEther(balance));
      } catch (error) {
        console.error('Failed to get balance:', error);
      }
    }
  }, []);

  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
      } else {
        disconnect();
      }
    };

    const handleChainChanged = (chainId: string) => {
      setChainId(chainId);
    };

    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [disconnect]);

  return {
    connect,
    disconnect,
    account,
    chainId,
    balance,
    isConnected,
    getBalance
  };
};