/* eslint-disable react-hooks/exhaustive-deps */
import { Button, CircularProgress, Paper, TextField } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { Multicall } from "ethereum-multicall";
import { allowance, approved, getWeb3, userStake, userWithdraw } from "../helper/contract";
import { rem } from "../helper/px-to-rem";
// import DD2 from "../ABI/DD2Token.json";
import masterchef from "../ABI/masterchef.json";
import WETH from "../ABI/WETHToken.json";
import { convertHexToDecimal } from "../helper/formatting";
import { useEffect, useState } from "react";
import Popup from "./Popup";

export default function Staking() {
  const { account, library, chainId } = useWeb3React();
  const web3Provider = getWeb3(library?.provider);

  const multicall = new Multicall({
    web3Instance: web3Provider,
    tryAggregate: true,
  });

  const [openPopupStake, setOpenPopupStake] = useState(false);
  const [openPopupWithdraw, setOpenPopupWithdraw] = useState(false);

  const [balanceUser, setBalanceUser] = useState(0);
  const [tokenEarnedUser, setTokenEarnedUser] = useState(0);
  const [amountStakedUser, setAmountStakedUser] = useState(0);
  const [totalAmountStakedUser, setTotalAmountStakedUser] = useState(0);
  const [isApproved, setIsApproved] = useState(false);
  const [isLoadingStake, setIsLoadingStake] = useState(false);
  const [isLoadingHarvest, setIsLoadingHarvest] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingWithdraw, setIsLoadingWithdraw] = useState(false);
  const [isLoadingApprove, setIsLoadingApprove] = useState(false);

  const [inputStake, setInputStake] = useState("")
  const [inputWithdraw, setInputWithdraw] = useState("")

  const checkAllowance = async () => {
    if (account) {
      const result = await allowance(library?.provider, account);
      console.log("lalala", result);
      setIsApproved(result > 0);
    }
  };

  const approveToken = async () => {
    if (account) {
      setIsLoadingApprove(true);
      const result = await approved(library?.provider, account);
      if (result) {
        setIsLoadingApprove(false);
        checkAllowance();
      }
    }
  };

  const userDoStake = async (amount) => {
    if (amount) {
      setIsLoadingStake(true);
      const result = await userStake(
        library?.provider,
        account,
        amount
      );

      if (result) {
        setIsLoadingStake(false);
        setOpenPopupStake(false)
        fetchDataFromSC()
      }

    }
  };

  const userDoWithdraw = async (amount) => {
    if (amount) {
      setIsLoadingWithdraw(true);
      const result = await userWithdraw(
        library?.provider,
        account,
        amount
      );
      if (result) {
        setIsLoadingWithdraw(false);
        setOpenPopupWithdraw(false);
        fetchDataFromSC()
      }

    }
  };

  const userDoHarvest = async () => {
    setIsLoadingHarvest(true);
    const result = await userStake(library?.provider, account, 0);
    if (result) {
      setIsLoadingHarvest(false);
      fetchDataFromSC();
    }

  };

  const fetchDataFromSC = async () => {
    if (!account && !library) return;
    const contractCallcontext = [
      {
        reference: "WETHBalance",
        contractAddress: process.env.REACT_APP_WETH_ADDRESS,
        abi: WETH,
        calls: [
          {
            reference: "balanceWETH",
            methodName: "balanceOf",
            methodParameters: [account],
          },
        ],
      },
      {
        reference: "amountStaked",
        contractAddress: process.env.REACT_APP_MC_ADDRESS,
        abi: masterchef,
        calls: [
          {
            reference: "amountStaked",
            methodName: "userInfo",
            methodParameters: [account],
          },
        ],
      },
      {
        reference: "totalStaked",
        contractAddress: process.env.REACT_APP_WETH_ADDRESS,
        abi: WETH,
        calls: [
          {
            reference: "totalStaked",
            methodName: "balanceOf",
            methodParameters: [process.env.REACT_APP_MC_ADDRESS],
          },
        ],
      },
      {
        reference: "tokenEarnedDD2",
        contractAddress: process.env.REACT_APP_MC_ADDRESS,
        abi: masterchef,
        calls: [
          {
            reference: "tokenEarnedDD2",
            methodName: "pendingDD2",
            methodParameters: [account],
          },
        ],
      },
    ];
    try {
      setIsLoading(true);
      const result = await multicall.call(contractCallcontext);
      const wethBalanceValue = convertHexToDecimal(
        result.results.WETHBalance.callsReturnContext[0].returnValues[0].hex
      );
      const tokenEarnedValue = convertHexToDecimal(
        result.results.tokenEarnedDD2.callsReturnContext[0].returnValues[0].hex
      );
      const amountStakedValue = convertHexToDecimal(
        result.results.amountStaked.callsReturnContext[0].returnValues[0].hex
      );
      const amountTotalStakedValue = convertHexToDecimal(
        result.results.totalStaked.callsReturnContext[0].returnValues[0].hex
      );

      setBalanceUser(wethBalanceValue);
      setTokenEarnedUser(tokenEarnedValue);
      setAmountStakedUser(amountStakedValue);
      setTotalAmountStakedUser(amountTotalStakedValue);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (account) checkAllowance();
  }, [account]);

  useEffect(() => {
    fetchDataFromSC();
  }, [account, library?.provider, chainId]);

  return (
    <>
      {isLoading ? <CircularProgress />
        :
        <Paper
          style={{
            width: `${rem(700)}`,
            height: `${rem(365)}`,
            borderRadius: `${rem(20)}`,
            padding: `${rem(24)}`,
            // display: "flex",
            // flexDirection: "column",
          }}
          elevation={3}
        >
          <div style={{ fontWeight: "bold", fontSize: 24, marginBottom: `${rem(20)}` }}>Wallet address: {account}</div>
          <div style={{ fontWeight: "bold", fontSize: 24, marginBottom: `${rem(20)}` }}>Balance: {balanceUser} WETH</div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: `${rem(20)}` }}>
            <div style={{ fontWeight: "bold", fontSize: 24 }}>Token earned: {tokenEarnedUser} DD2</div>
            <Button
              disabled={isLoadingHarvest}
              onClick={() => userDoHarvest()}
              variant="contained">
              {isLoadingHarvest ? <CircularProgress size={20} /> : <></>}
              Harvest</Button>
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: `${rem(20)}` }}>
            {
              isApproved ?
                <div style={{ display: "flex", justifyContent: "space-around", width: "100%" }}>
                  <Button
                    variant="contained"
                    onClick={() => setOpenPopupStake(true)}
                  >Deposit</Button>
                  <Button
                    variant="contained"
                    onClick={() => setOpenPopupWithdraw(true)}
                  >Withdraw</Button>
                </div> :
                <Button
                  disabled={isLoadingApprove}
                  variant="contained"
                  onClick={() => approveToken()}
                >
                  {isLoadingApprove ? <CircularProgress size={20} /> : <></>}
                  Approve</Button>
            }

          </div>
          <div style={{ fontWeight: "bold", fontSize: 24, marginBottom: `${rem(20)}` }}>Your stake: {amountStakedUser} WETH</div>
          <div style={{ fontWeight: "bold", fontSize: 24 }}>Total stake: {totalAmountStakedUser} WETH</div>
        </Paper>
      }
      <Popup
        title="Stake"
        openPopup={openPopupStake}
        setOpenPopup={setOpenPopupStake}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <TextField
            style={{
              marginBottom: `${rem(25)}`,
            }}
            // fullWidth
            value={inputStake}
            onChange={(e) => {
              setInputStake(e.target.value)
            }}
            type="text"
            placeholder="Input your amount"
          ></TextField>
          <div
            style={{
              marginBottom: `${rem(25)}`,
            }}
          >
            Your WETH balance: {balanceUser} WETH
          </div>
          <Button
            variant="contained"
            onClick={() => { userDoStake(inputStake) }}
            disabled={isLoadingStake}
          >
            {isLoadingStake ? <CircularProgress size={20} /> : <>{" "}</>}
            Stake
          </Button>
        </div>
      </Popup>
      <Popup
        title="Withdraw"
        openPopup={openPopupWithdraw}
        setOpenPopup={setOpenPopupWithdraw}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <TextField
            style={{
              marginBottom: `${rem(25)}`,
            }}
            value={inputWithdraw}
            onChange={(e) => {
              setInputWithdraw(e.target.value)
            }}
            // fullWidth
            type="text"
            placeholder="Input your amount"
          ></TextField>
          <div
            style={{
              marginBottom: `${rem(25)}`,
            }}
          >
            Your WETH deposited: {amountStakedUser} WETH
          </div>
          <Button
            onClick={() => userDoWithdraw(inputWithdraw)}
            variant="contained"
            disabled={isLoadingWithdraw}
          >
            {isLoadingWithdraw ? <CircularProgress size={20} /> : <>{" "}</>}
            Withdraw</Button>
        </div>
      </Popup>
    </>
  );
}