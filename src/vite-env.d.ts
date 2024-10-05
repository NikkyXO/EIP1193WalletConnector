// /// <reference types="vite/client" />


interface EthereumProvider {
    isMetaMask?: boolean;
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    on: (event: string, handler: (...args: any[]) => void) => void;
    removeListener: (event: string, handler: (...args: any[]) => void) => void;
  }
  
  interface Window {
    ethereum?: EthereumProvider;
  }

  interface ImportMetaEnv {
    readonly VITE_APPKIT_PROJECT_ID: string;
    readonly VITE_LISK_SEPOLIA_EXPLORER_URL: string;
    readonly VITE_LISK_SEPOLIA_RPC_URL: string;
    readonly VITE_CONTRACT_ADDRESS: string;

    // add other environment variables here as needed
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }

