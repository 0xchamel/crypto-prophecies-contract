/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from "bn.js";
import { EventData, PastEventOptions } from "web3-eth-contract";

export interface ShopContract extends Truffle.Contract<ShopInstance> {
  "new"(
    _rewardAddress: string,
    _tcpToken: string,
    _startTime: number | BN | string,
    meta?: Truffle.TransactionDetails
  ): Promise<ShopInstance>;
}

export interface ItemCancelled {
  name: "ItemCancelled";
  args: {
    nftAddress: string;
    tokenId: BN;
    0: string;
    1: BN;
  };
}

export interface ItemListed {
  name: "ItemListed";
  args: {
    nftAddress: string;
    owner: string;
    amount: BN;
    limit: BN;
    price: BN;
    tokenId: BN;
    0: string;
    1: string;
    2: BN;
    3: BN;
    4: BN;
    5: BN;
  };
}

export interface ItemPriceUpdated {
  name: "ItemPriceUpdated";
  args: {
    nftAddress: string;
    tokenId: BN;
    _price: BN;
    0: string;
    1: BN;
    2: BN;
  };
}

export interface OwnershipTransferred {
  name: "OwnershipTransferred";
  args: {
    previousOwner: string;
    newOwner: string;
    0: string;
    1: string;
  };
}

type AllEvents =
  | ItemCancelled
  | ItemListed
  | ItemPriceUpdated
  | OwnershipTransferred;

export interface ShopInstance extends Truffle.ContractInstance {
  cancelItem: {
    (
      _nftAddress: string,
      _tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _nftAddress: string,
      _tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _nftAddress: string,
      _tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _nftAddress: string,
      _tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  createItem: {
    (
      _nftAddress: string,
      _tokenId: number | BN | string,
      _amount: number | BN | string,
      _limit: number | BN | string,
      _price: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _nftAddress: string,
      _tokenId: number | BN | string,
      _amount: number | BN | string,
      _limit: number | BN | string,
      _price: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _nftAddress: string,
      _tokenId: number | BN | string,
      _amount: number | BN | string,
      _limit: number | BN | string,
      _price: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _nftAddress: string,
      _tokenId: number | BN | string,
      _amount: number | BN | string,
      _limit: number | BN | string,
      _price: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  dropNo(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  getItem(
    _nftAddress: string,
    _tokenId: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<{ 0: boolean; 1: string; 2: BN; 3: BN; 4: BN }>;

  getLimits(
    _dropNo: number | BN | string,
    _account: string,
    _tokenIds: (number | BN | string)[],
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN[]>;

  getList(
    txDetails?: Truffle.TransactionDetails
  ): Promise<
    {
      initialized: boolean;
      owner: string;
      amount: BN;
      limit: BN;
      price: BN;
      nftAddress: string;
      tokenId: BN;
    }[]
  >;

  isPaused(txDetails?: Truffle.TransactionDetails): Promise<boolean>;

  owner(txDetails?: Truffle.TransactionDetails): Promise<string>;

  purchase: {
    (
      _nftAddress: string,
      _tokenId: number | BN | string,
      _count: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _nftAddress: string,
      _tokenId: number | BN | string,
      _count: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _nftAddress: string,
      _tokenId: number | BN | string,
      _count: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _nftAddress: string,
      _tokenId: number | BN | string,
      _count: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  reclaimERC20: {
    (_tokenContract: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(
      _tokenContract: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _tokenContract: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _tokenContract: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  renounceOwnership: {
    (txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(txDetails?: Truffle.TransactionDetails): Promise<void>;
    sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
    estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
  };

  rewardAddress(txDetails?: Truffle.TransactionDetails): Promise<string>;

  startNewDrop: {
    (
      _startTime: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _startTime: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _startTime: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _startTime: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  startTime(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  tcpToken(txDetails?: Truffle.TransactionDetails): Promise<string>;

  toggleIsPaused: {
    (txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(txDetails?: Truffle.TransactionDetails): Promise<void>;
    sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
    estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
  };

  transferOwnership: {
    (newOwner: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(
      newOwner: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      newOwner: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      newOwner: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  updateItemAmount: {
    (
      _nftAddress: string,
      _tokenId: number | BN | string,
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _nftAddress: string,
      _tokenId: number | BN | string,
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _nftAddress: string,
      _tokenId: number | BN | string,
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _nftAddress: string,
      _tokenId: number | BN | string,
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  updateItemLimit: {
    (
      _nftAddress: string,
      _tokenId: number | BN | string,
      _limit: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _nftAddress: string,
      _tokenId: number | BN | string,
      _limit: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _nftAddress: string,
      _tokenId: number | BN | string,
      _limit: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _nftAddress: string,
      _tokenId: number | BN | string,
      _limit: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  updateItemPrice: {
    (
      _nftAddress: string,
      _tokenId: number | BN | string,
      _price: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _nftAddress: string,
      _tokenId: number | BN | string,
      _price: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _nftAddress: string,
      _tokenId: number | BN | string,
      _price: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _nftAddress: string,
      _tokenId: number | BN | string,
      _price: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  updateRewardAddress: {
    (_rewardAddress: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(
      _rewardAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _rewardAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _rewardAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  updateStartTime: {
    (
      _startTime: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _startTime: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _startTime: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _startTime: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  userLimits(
    arg0: number | BN | string,
    arg1: string,
    arg2: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  methods: {
    cancelItem: {
      (
        _nftAddress: string,
        _tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _nftAddress: string,
        _tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _nftAddress: string,
        _tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _nftAddress: string,
        _tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    createItem: {
      (
        _nftAddress: string,
        _tokenId: number | BN | string,
        _amount: number | BN | string,
        _limit: number | BN | string,
        _price: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _nftAddress: string,
        _tokenId: number | BN | string,
        _amount: number | BN | string,
        _limit: number | BN | string,
        _price: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _nftAddress: string,
        _tokenId: number | BN | string,
        _amount: number | BN | string,
        _limit: number | BN | string,
        _price: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _nftAddress: string,
        _tokenId: number | BN | string,
        _amount: number | BN | string,
        _limit: number | BN | string,
        _price: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    dropNo(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    getItem(
      _nftAddress: string,
      _tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<{ 0: boolean; 1: string; 2: BN; 3: BN; 4: BN }>;

    getLimits(
      _dropNo: number | BN | string,
      _account: string,
      _tokenIds: (number | BN | string)[],
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN[]>;

    getList(
      txDetails?: Truffle.TransactionDetails
    ): Promise<
      {
        initialized: boolean;
        owner: string;
        amount: BN;
        limit: BN;
        price: BN;
        nftAddress: string;
        tokenId: BN;
      }[]
    >;

    isPaused(txDetails?: Truffle.TransactionDetails): Promise<boolean>;

    owner(txDetails?: Truffle.TransactionDetails): Promise<string>;

    purchase: {
      (
        _nftAddress: string,
        _tokenId: number | BN | string,
        _count: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _nftAddress: string,
        _tokenId: number | BN | string,
        _count: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _nftAddress: string,
        _tokenId: number | BN | string,
        _count: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _nftAddress: string,
        _tokenId: number | BN | string,
        _count: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    reclaimERC20: {
      (_tokenContract: string, txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(
        _tokenContract: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _tokenContract: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _tokenContract: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    renounceOwnership: {
      (txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(txDetails?: Truffle.TransactionDetails): Promise<void>;
      sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
      estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
    };

    rewardAddress(txDetails?: Truffle.TransactionDetails): Promise<string>;

    startNewDrop: {
      (
        _startTime: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _startTime: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _startTime: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _startTime: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    startTime(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    tcpToken(txDetails?: Truffle.TransactionDetails): Promise<string>;

    toggleIsPaused: {
      (txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(txDetails?: Truffle.TransactionDetails): Promise<void>;
      sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
      estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
    };

    transferOwnership: {
      (newOwner: string, txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(
        newOwner: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        newOwner: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        newOwner: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    updateItemAmount: {
      (
        _nftAddress: string,
        _tokenId: number | BN | string,
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _nftAddress: string,
        _tokenId: number | BN | string,
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _nftAddress: string,
        _tokenId: number | BN | string,
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _nftAddress: string,
        _tokenId: number | BN | string,
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    updateItemLimit: {
      (
        _nftAddress: string,
        _tokenId: number | BN | string,
        _limit: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _nftAddress: string,
        _tokenId: number | BN | string,
        _limit: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _nftAddress: string,
        _tokenId: number | BN | string,
        _limit: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _nftAddress: string,
        _tokenId: number | BN | string,
        _limit: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    updateItemPrice: {
      (
        _nftAddress: string,
        _tokenId: number | BN | string,
        _price: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _nftAddress: string,
        _tokenId: number | BN | string,
        _price: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _nftAddress: string,
        _tokenId: number | BN | string,
        _price: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _nftAddress: string,
        _tokenId: number | BN | string,
        _price: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    updateRewardAddress: {
      (_rewardAddress: string, txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(
        _rewardAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _rewardAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _rewardAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    updateStartTime: {
      (
        _startTime: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _startTime: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _startTime: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _startTime: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    userLimits(
      arg0: number | BN | string,
      arg1: string,
      arg2: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;
  };

  getPastEvents(event: string): Promise<EventData[]>;
  getPastEvents(
    event: string,
    options: PastEventOptions,
    callback: (error: Error, event: EventData) => void
  ): Promise<EventData[]>;
  getPastEvents(event: string, options: PastEventOptions): Promise<EventData[]>;
  getPastEvents(
    event: string,
    callback: (error: Error, event: EventData) => void
  ): Promise<EventData[]>;
}
