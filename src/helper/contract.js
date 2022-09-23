import { constants, ethers } from "ethers";
import Web3 from "web3";
import DD2 from "../ABI/DD2Token.json";
import masterchef from "../ABI/masterchef.json";
import WETH from "../ABI/WETHToken.json";

export const getWeb3 = (provider) => {
  return new Web3(provider);
};

export const getWETHContract = (provider) => {
  const web3 = new Web3(provider);
  const contract = new web3.eth.Contract(
    WETH,
    process.env.REACT_APP_WETH_ADDRESS
  );
  return { web3, contract };
};

export const getDD2Contract = (provider) => {
  const web3 = new Web3(provider);
  const contract = new web3.eth.Contract(DD2, process.env.REACT_APP_DD2_ADDRESS);
  return { web3, contract };
};

export const getMasterchefContract = (provider) => {
  const web3 = new Web3(provider);
  const contract = new web3.eth.Contract(
    masterchef,
    process.env.REACT_APP_MC_ADDRESS
  );
  return { web3, contract };
};

export const getBalanceOfWETH = async (provider, userAddress) => {
  const { web3, contract } = getWETHContract(provider);

  if (!(userAddress && ethers.utils.isAddress(userAddress)))
    throw new Error("incorrect address contract");
  if (!contract) throw new Error("incorrect contract");

  try {
    const result = await contract.methods?.balanceOf(userAddress).call();
    return web3.utils.fromWei(result);
  } catch (err) {
    console.log(err);
  }
};

export const allowance = async (provider, userAddress) => {
  const { web3, contract } = getWETHContract(provider);
  if (!(userAddress && ethers.utils.isAddress(userAddress)))
    throw new Error("incorrect address contract");
  if (!contract) throw new Error("incorrect contract");

  try {
    const result = await contract.methods
      ?.allowance(userAddress, process.env.REACT_APP_MC_ADDRESS)
      .call();
    console.log("result", result);
    return web3.utils.fromWei(result);
  } catch (err) {
    console.log(err);
  }
};

export const approved = async (provider, userAddress) => {
  const { contract } = getWETHContract(provider);
  if (!(userAddress && ethers.utils.isAddress(userAddress)))
    throw new Error("incorrect address contract");
  if (!contract) throw new Error("incorrect contract");

  const ALLOW_NUMBER = constants.MaxInt256;

  try {
    const result = await contract.methods
      ?.approve(process.env.REACT_APP_MC_ADDRESS, ALLOW_NUMBER)
      .send({
        from: userAddress,
      });
    console.log("result", result);
    return result;
  } catch (err) {
    console.log(err);
  }
};

export const userStake = async (provider, userAddress, amount) => {
  const { web3, contract } = getMasterchefContract(provider);
  if (!(userAddress && ethers.utils.isAddress(userAddress)))
    throw new Error("incorrect address contract");
  if (!contract) throw new Error("incorrect contract");

  const amountValue = typeof amount === 'string' ? web3.utils.toWei(amount) : web3.utils.toWei(amount.toString());
  try {
    const result = await contract.methods
      ?.deposit(amountValue)
      .send({
        from: userAddress,
      });
    console.log("result", result);
    return result;
  } catch (err) {
    console.log(err);
  }
};

export const userWithdraw = async (provider, userAddress, amount) => {
  const { web3, contract } = getMasterchefContract(provider);
  if (!(userAddress && ethers.utils.isAddress(userAddress)))
    throw new Error("incorrect address contract");
  if (!contract) throw new Error("incorrect contract");

  const amountValue = typeof amount === 'string' ? web3.utils.toWei(amount) : web3.utils.toWei(amount.toString());
  try {
    const result = await contract.methods
      ?.withdraw(amountValue)
      .send({
        from: userAddress,
      });
    console.log("result", result);
    return result;
  } catch (err) {
    console.log(err);
  }
};
