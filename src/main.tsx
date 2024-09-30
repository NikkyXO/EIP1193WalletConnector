import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { WalletSetupContextProvider } from './contexts/walletSetupContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WalletSetupContextProvider>
    <App />
    </WalletSetupContextProvider>
  </StrictMode>,
)
