import { ethers } from "ethers";
import { BigNumber } from "@ethersproject/bignumber";
export const convertHexToDecimal = (hex) => {
  return ethers.utils.formatEther(BigNumber.from(hex));
};