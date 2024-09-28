// App.tsx
import React, { useState } from 'react';
import { useWalletConnection } from './useWalletConnection';

const App: React.FC = () => {
  const { 
    connect, 
    disconnect, 
    account, 
    chainId, 
    balance, 
    isConnected,
    getBalance
  } = useWalletConnection();

  const [addressInput, setAddressInput] = useState('');

  const handleConnect = async () => {
    await connect();
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const handleGetBalance = async () => {
    if (addressInput) {
      await getBalance(addressInput);
    }
  };

  return (
    <div>
      <h1>Wallet Connection App</h1>
      {isConnected ? (
        <>
          <p>Connected Account: {account}</p>
          <p>Chain ID: {chainId}</p>
          <button onClick={handleDisconnect}>Disconnect</button>
        </>
      ) : (
        <button onClick={handleConnect}>Connect Wallet</button>
      )}
      <div>
        <input
          type="text"
          value={addressInput}
          onChange={(e) => setAddressInput(e.target.value)}
          placeholder="Enter address"
        />
        <button onClick={handleGetBalance}>Get Balance</button>
      </div>
      {balance !== null && (
        <p>Balance: {balance} ETH</p>
      )}
    </div>
  );
};

export default App;