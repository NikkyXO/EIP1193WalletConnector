import React, { useState } from "react";
import { useWalletConnection } from "./components/useWalletConnection";

const App: React.FC = () => {
  const {
    connect,
    disconnect,
    account,
    chainId,
    balance,
    isConnected,
    getBalance,
  } = useWalletConnection();

  const [addressInput, setAddressInput] = useState("");

  const handleConnect = async () => {
    await connect();
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const handleGetBalance = async () => {
    try {
      console.log({ addressInput, account });
      if (addressInput) {
        await getBalance(addressInput);
      } else if (account) {
        await getBalance(account);
      } else {
        alert("Please enter address or connect your wallet first");
      }
    } catch (error) {
      console.error("Error while getting balance:", error);
    }
  };

  return (
    <div className="w-full h-screen mx-auto  bg-cyan-500">
      <div className="p-5  flex flex-col justify-center items-center">
        <h1 className="text-3xl font-extrabold p-5 mt-10">
          Wallet Connection{" "}
        </h1>

        {isConnected ? (
          <div className="flex flex-col gap-3 items-center justify-center ">
            <p className="text-2xl">Connected Account:</p>
            <p className="text-sm border-b-3 border-black rounded p-3">
              {account}
            </p>
            <p>
              <span className="font-bold">Chain ID:</span> {chainId}
            </p>
            <button
              className="border rounded bg-emerald-900 p-4 px-8 mb-5 mt-3 text-white"
              onClick={handleDisconnect}
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            className="border rounded bg-emerald-900 p-4 mb-5 mt-3 text-white"
            onClick={handleConnect}
          >
            Connect Wallet
          </button>
        )}
        <div className="flex flex-col gap-3 mt-12">
          <input
            className="px-10 py-2 border border-gray-300 rounded"
            type="text"
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
            placeholder="Enter address"
          />
          <button
            className="border rounded bg-orange-400 p-4 mb-5 mt-3 text-gray-950"
            onClick={handleGetBalance}
          >
            Get Balance
          </button>
        </div>
        {balance !== null && <p>Balance: {balance} ETH</p>}
      </div>
    </div>
  );
};

export default App;
