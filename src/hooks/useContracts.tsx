import { ethers } from "ethers";
import controller_contract from "../contracts/controller.json";
import { useStoreActions, useStoreState } from "../store/globalStore";
import Swal from "sweetalert2";

const useContracts = () => {
  const { web3, account, signer, currentToken } = useStoreState(
    (state) => state
  );

  const { setShouldUpdate } = useStoreActions((action) => action);

  const getUnderlyingAddress = () => {
    let underlyings = {
      //mainnet
      DAI: "0xff795577d9ac8bd7d90ee22b6c1703490b6512fd", // DAI
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

    const getAllowance = (owner: string, spender: string) => {
      return UnderlyingContract.allowance(owner, spender);
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
      getAllowance,
    };
  };

  const getAllowanceLimit = async (owner: string, futureAddress: string) => {
    return await underlyingERC20(getUnderlyingAddress()).getAllowance(
      owner,
      futureAddress
    );
  };
  const getAtokenBalance = async (
    futureAddress: string
  ): Promise<ethers.BigNumber> => {
    let controller = getControllerContract();
    let aToken = await controller.getAToken(futureAddress);
    return await underlyingERC20(aToken).getBalance(futureAddress);
  };

  const approveUnderlying = async (
    underlying: string,
    futureAddress: string,
    amount: ethers.BigNumber
  ) => {
    let tx = await underlyingERC20(underlying).approve(futureAddress, amount);
    await tx.wait();
    setShouldUpdate(true);
  };

  const getYTSupply = async (
    futureAddress: string
  ): Promise<ethers.BigNumber> => {
    const tokenAddress = await getYT(futureAddress);
    return await underlyingERC20(tokenAddress).getTotalSupply();
  };

  const getOTSupply = async (
    futureAddress: string
  ): Promise<ethers.BigNumber> => {
    const tokenAddress = await getOT(futureAddress);
    return await underlyingERC20(tokenAddress).getTotalSupply();
  };

  const getTotalYield = async (futureAddress: string) => {
    let OTSupply = await getOTSupply(futureAddress);
    let atokenBalance = await getAtokenBalance(futureAddress);
    return atokenBalance.sub(OTSupply);
  };

  const getShare = async (futureAddress: string) => {
    let YTSupply = await getYTSupply(futureAddress);

    let yields = await getTotalYield(futureAddress);

    const tokenAddress = await getYT(futureAddress);
    let YTBalance = await underlyingERC20(tokenAddress).getBalance(account);

    let percentage;
    let amount;

    if (YTSupply.eq(ethers.BigNumber.from("0"))) {
      percentage = 0;
      amount = 0;
    } else {
      percentage = YTBalance.mul(1000000).div(YTSupply).mul(100);
      amount = YTBalance.div(YTSupply).mul(yields);
    }

    return {
      percentage: ethers.utils.formatUnits(percentage, 6),
      amount: ethers.utils.formatUnits(amount, 6),
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

  const addTokenToMetamask = async (
    name: string,
    symbol: string,
    futureAddress: string
  ) => {
    let tokenAddress: string;
    if (name === "OT") {
      tokenAddress = await getOT(futureAddress);
    } else {
      tokenAddress = await getYT(futureAddress);
    }
    const tokenSymbol = symbol;
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
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };

  const approveFutureForSpending = async (
    underlying: string,
    futureAddress: string,
    amount: ethers.BigNumber
  ) => {
    await approveUnderlying(underlying, futureAddress, amount);
  };

  const unsubscribeAndWithdraw = async (futureAddress: string) => {
    let controller = getControllerContract();
    let tx = await controller.connect(signer).unsubscribe(futureAddress);
    await tx.wait();
    Swal.fire(
      "Withdraw Successful",
      "you have received back your underlying DAI",
      "success"
    );
  };

  const harvestYield = async (futureAddress: string) => {
    let controller = getControllerContract();
    let tx = await controller.connect(signer).collectYield(futureAddress);
    await tx.wait();
    Swal.fire("Harvest Successful", "you have received aDAI", "success");
  };

  const subscribe = async (
    underlying: string,
    futureId: number,
    futureAddress: string,
    duration: number,
    amount: ethers.BigNumber
  ) => {
    let controller = getControllerContract();
    // await approveUnderlying(underlying, futureAddress, amount);
    let metadata = getMetaData(underlying, duration);
    let tx = await controller
      .connect(signer)
      .subscribe(metadata, futureId, amount);

    console.log(tx);

    await tx.wait();
    setShouldUpdate(true);
    Swal.fire({
      title: "Subscription Confirmed!",
      text:
        "Do you wish to add Ownership token and Yield Token to your wallet?",
      icon: "success",
      showConfirmButton: true,
      showDenyButton: true,
      confirmButtonText: `Yes`,
      denyButtonText: `Nope`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await addTokenToMetamask(
          "YT",
          `${currentToken}${duration / 5760}`,
          futureAddress
        );
        await addTokenToMetamask(
          "OT",
          `${currentToken}${duration / 5760}`,
          futureAddress
        );
      } else if (result.isDenied) {
      }
    });
  };

  return {
    getUnderlyingAddress,
    getFutureExpired,
    getFuturesList,
    getOTBalance,
    harvestYield,
    getYTBalance,
    getUnderlyingBalance,
    subscribe,
    getAtokenBalance,
    getTotalYield,
    getFutureRemainingTime,
    getShare,
    getAllowanceLimit,
    approveFutureForSpending,
    unsubscribeAndWithdraw,
  };
};

export default useContracts;
