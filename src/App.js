/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-expressions */
import { useWeb3React } from '@web3-react/core';
import { useEffect } from 'react';
import './App.css';
import Staking from './components/Staking';
import Wallets from './components/Wallets';
import { injected, walletConnectConnector } from './helper/connection';

function App() {
  const { account, activate } = useWeb3React()

  const connectByMetamask = () => {
    activate(injected);
    localStorage.setItem("connector", "metamask");
  }
  const connectByWalletConnect = () => {
    activate(walletConnectConnector, undefined, true).catch((e) =>
      console.log(e)
    );
    localStorage.setItem("connector", "walletconnect");
  }

  const connectWalletOnReload = async () => {
    if (!account) {
      const connector = localStorage.getItem("connector");
      if (connector === 'metamask') {
        const isConnect = await injected.isAuthorized()
        if (isConnect) connectByMetamask();
      } else if (connector === 'walletconnect') {
        connectByWalletConnect()
      } else {
        return
      }
    }
  }

  useEffect(() => {
    connectWalletOnReload()
  }, [account])

  return (
    <div className="App">
      {
        account ? <Staking /> : <Wallets />
      }
    </div>
  );
}

export default App;
