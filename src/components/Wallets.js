import { Button, Paper } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { useState } from "react";
import { injected, walletConnectConnector } from "../helper/connection";
import { rem } from "../helper/px-to-rem";
import CircularProgress from '@mui/material/CircularProgress';

export default function Wallets() {
  const { activate } = useWeb3React();
  const [loading, setLoading] = useState(false);

  const connectByInjectConnector = () => {
    setLoading(true);
    activate(injected);
    localStorage.setItem("connector", "metamask");
    setLoading(false);
  };

  const connectByWalletConnector = () => {
    setLoading(true);
    activate(walletConnectConnector, undefined, true).catch((e) =>
      console.log(e)
    );
    localStorage.setItem("connector", "walletconnect");
    setLoading(false);
  };

  return (
    <>
      {
        loading ? <CircularProgress /> :
          <Paper
            style={{
              width: `${rem(500)}`,
              height: `${rem(348)}`,
              borderRadius: `${rem(20)}`,
              padding: `${rem(50)}`,
              display: "flex",
              flexDirection: "column",
            }}
            elevation={3}
          >
            <Button
              variant="outlined"
              style={{ marginBottom: `${rem(100)}`, }}
              onClick={() => connectByInjectConnector()}
            >Connect Metamark</Button>
            <Button variant="contained" onClick={() => connectByWalletConnector()}>Connect WalletConnect</Button>
          </Paper>
      }

    </>
  );
}