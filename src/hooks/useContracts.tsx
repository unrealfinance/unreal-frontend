import { ethers } from "ethers";
import controller_contract from "../contracts/controller.json";
import { useStoreActions, useStoreState } from "../store/globalStore";

const useContracts = () => {
  const { web3, account, signer, currentToken } = useStoreState(
    (state) => state
  );

  const { setShouldUpdate } = useStoreActions((action) => action);

  const getUnderlyingAddress = () => {
    let underlyings = {
      //mainnet
      DAI: "0x6B175474E89094C44Da98b954EedeAC495271d0F", // DAI
      USDC: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // USDC
      USDT: "0xdac17f958d2ee523a2206206994597c13d831ec7", // USDT
    };

    return underlyings[currentToken];
  };

  const getMetaData = (underlyingAddress: string, duration: number) => {
    let metadataPre = ethers.utils.defaultAbiCoder.encode(
      ["string", "address", "uint256"],
      ["AAVE", underlyingAddress, duration]
    );

    return ethers.utils.keccak256(metadataPre);
  };

  const getControllerContract = () => {
    return new ethers.Contract(
      controller_contract.address,
      controller_contract.abi,
      web3
    );
  };

  const getFuturesList = async (
    underlyingAddress: string,
    duration: number
  ) => {
    let controller = getControllerContract();
    let metadata = getMetaData(underlyingAddress, duration);
    return await controller.getFutureList(metadata);
  };

  const getFutureExpired = async (futureAddress: string) => {
    let controller = getControllerContract();
    let currentBlock = await web3.getBlockNumber();

    return (
      currentBlock >
      (await controller.connect(signer).getFutureExpiry(futureAddress))
    );
  };

  const getFutureRemainingTime = async (futureAddress: string) => {
    let controller = getControllerContract();
    let currentBlock = await web3.getBlockNumber();
    let expiryBlock = await controller
      .connect(signer)
      .getFutureExpiry(futureAddress);

    if (expiryBlock.sub(currentBlock) > 0) {
      return expiryBlock.sub(currentBlock);
    } else {
      return "0";
    }
  };

  //   const getFutureAddress = async (
  //     underlyingAddress: string,
  //     duration: number,
  //     futureId: number
  //   ) => {
  //     let controller = getControllerContract();
  //     let metadata = getMetaData(underlyingAddress, duration);
  //     return await controller.getFutureAddress(metadata, futureId);
  //   };

  const underlyingERC20 = (underlyingAddress: string) => {
    let ERC20abi = [
      "function balanceOf(address) view returns (uint)",
      "function approve(address spender, uint256 amount) external returns (bool)",
      "function totalSupply() external view returns (uint256)",
      "function allowance(address owner, address spender) external view returns (uint256)",
    ];

    let UnderlyingContract = new ethers.Contract(
      underlyingAddress,
      ERC20abi,
      web3
    );

    const getBalance = (address: string) => {
      return UnderlyingContract.balanceOf(address);
    };

    const getTotalSupply = () => {
      return UnderlyingContract.totalSupply();
    };

    const approve = (address: string, amount: ethers.BigNumber) => {
      return UnderlyingContract.connect(signer).approve(address, amount);
    };

    return {
      getBalance,
      approve,
      getTotalSupply,
    };
  };

  const getAtokenBalance = async (futureAddress: string) => {
    let controller = getControllerContract();
    let aToken = await controller.getAToken(futureAddress);
    return await underlyingERC20(aToken).getBalance(futureAddress);
  };

  const approveUnderlying = async (
    underlying: string,
    futureAddress: string,
    amount: ethers.BigNumber
  ) => {
    await underlyingERC20(underlying).approve(futureAddress, amount);
  };

  const getYTSupply = async (futureAddress: string) => {
    const tokenAddress = await getYT(futureAddress);
    return await underlyingERC20(tokenAddress).getTotalSupply();
  };

  const getTotalYield = async (futureAddress: string) => {
    let YTSupply = await getYTSupply(futureAddress);
    let atokenBalance = await getAtokenBalance(futureAddress);
    return atokenBalance - YTSupply;
  };

  const getShare = async (futureAddress: string) => {
    let YTSupply = await getYTSupply(futureAddress);
    let atokenBalance = await getAtokenBalance(futureAddress);
    const tokenAddress = await getYT(futureAddress);
    let yields = atokenBalance.sub(YTSupply);
    let YTBalance = await underlyingERC20(tokenAddress).getBalance(account);

    let percentage;
    let amount;

    if (YTSupply.eq(ethers.BigNumber.from("0"))) {
      percentage = 0;
      amount = 0;
    } else {
      percentage = YTBalance.div(YTSupply).mul(100);
      amount = YTBalance.div(YTSupply).mul(yields);
    }

    return {
      percentage,
      amount,
    };
  };

  const getOT = async (futureAddress: string) => {
    let controller = getControllerContract();
    return await controller.connect(signer).getUOSToken(futureAddress);
  };

  const getYT = async (futureAddress: string) => {
    let controller = getControllerContract();
    return await controller.connect(signer).getUToken(futureAddress);
  };

  const getOTBalance = async (futureAddress: string, owner: string) => {
    const tokenAddress = await getOT(futureAddress);
    return await underlyingERC20(tokenAddress).getBalance(owner);
  };

  const getYTBalance = async (futureAddress: string, owner: string) => {
    const tokenAddress = await getYT(futureAddress);
    return await underlyingERC20(tokenAddress).getBalance(owner);
  };

  const getUnderlyingBalance = async (owner: string) => {
    return await underlyingERC20(getUnderlyingAddress()).getBalance(owner);
  };

  const addTokenToMetamask = async (name: string, futureAddress: string) => {
    let tokenAddress: string;
    if (name === "OT") {
      tokenAddress = await getOT(futureAddress);
    } else {
      tokenAddress = await getYT(futureAddress);
    }
    const tokenSymbol = "U" + name;
    const tokenDecimals = 18;

    try {
      const wasAdded = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20", // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenAddress, // The address that the token is at.
            symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: tokenDecimals, // The number of decimals in the token
          },
        },
      });

      if (wasAdded) {
        console.log("Thanks for your interest!");
      } else {
        console.log("Your loss!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const subscribe = async (
    underlying: string,
    futureId: number,
    futureAddress: string,
    duration: number,
    amount: ethers.BigNumber
  ) => {
    let controller = getControllerContract();
    await approveUnderlying(underlying, futureAddress, amount);
    let metadata = getMetaData(underlying, duration);
    let tx = await controller
      .connect(signer)
      .subscribe(metadata, futureId, amount);

    await tx.wait();
    setShouldUpdate(true);
    await addTokenToMetamask("YT", futureAddress);
    await addTokenToMetamask("OT", futureAddress);
  };

  return {
    getUnderlyingAddress,
    getFutureExpired,
    getFuturesList,
    getOTBalance,
    getYTBalance,
    getUnderlyingBalance,
    subscribe,
    getAtokenBalance,
    getTotalYield,
    getFutureRemainingTime,
    getShare,
  };
};

export default useContracts;
