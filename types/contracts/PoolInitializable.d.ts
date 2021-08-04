/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from "bn.js";
import { EventData, PastEventOptions } from "web3-eth-contract";

export interface PoolInitializableContract
  extends Truffle.Contract<PoolInitializableInstance> {
  "new"(meta?: Truffle.TransactionDetails): Promise<PoolInitializableInstance>;
}

export interface AdminTokenRecovery {
  name: "AdminTokenRecovery";
  args: {
    tokenRecovered: string;
    amount: BN;
    0: string;
    1: BN;
  };
}

export interface Deposit {
  name: "Deposit";
  args: {
    user: string;
    amount: BN;
    0: string;
    1: BN;
  };
}

export interface EmergencyWithdraw {
  name: "EmergencyWithdraw";
  args: {
    user: string;
    amount: BN;
    0: string;
    1: BN;
  };
}

export interface NewRewardPerBlock {
  name: "NewRewardPerBlock";
  args: {
    rewardPerBlock: BN;
    0: BN;
  };
}

export interface NewStartAndEndBlocks {
  name: "NewStartAndEndBlocks";
  args: {
    startBlock: BN;
    endBlock: BN;
    0: BN;
    1: BN;
  };
}

export interface NewWithdrawalInterval {
  name: "NewWithdrawalInterval";
  args: {
    interval: BN;
    0: BN;
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

export interface RewardsStop {
  name: "RewardsStop";
  args: {
    blockNumber: BN;
    0: BN;
  };
}

export interface Withdraw {
  name: "Withdraw";
  args: {
    user: string;
    amount: BN;
    0: string;
    1: BN;
  };
}

type AllEvents =
  | AdminTokenRecovery
  | Deposit
  | EmergencyWithdraw
  | NewRewardPerBlock
  | NewStartAndEndBlocks
  | NewWithdrawalInterval
  | OwnershipTransferred
  | RewardsStop
  | Withdraw;

export interface PoolInitializableInstance extends Truffle.ContractInstance {
  MAXIMUM_WITHDRAWAL_INTERVAL(
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  POOL_FACTORY(txDetails?: Truffle.TransactionDetails): Promise<string>;

  PRECISION_FACTOR(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  accTokenPerShare(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  bonusEndBlock(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  canWithdraw(
    _user: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<boolean>;

  deposit: {
    (
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  emergencyRewardWithdraw: {
    (
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  emergencyWithdraw: {
    (txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(txDetails?: Truffle.TransactionDetails): Promise<void>;
    sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
    estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
  };

  initialize: {
    (
      _stakedToken: string,
      _rewardToken: string,
      _rewardPerBlock: number | BN | string,
      _startBlock: number | BN | string,
      _bonusEndBlock: number | BN | string,
      _withdrawalInterval: number | BN | string,
      _admin: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _stakedToken: string,
      _rewardToken: string,
      _rewardPerBlock: number | BN | string,
      _startBlock: number | BN | string,
      _bonusEndBlock: number | BN | string,
      _withdrawalInterval: number | BN | string,
      _admin: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _stakedToken: string,
      _rewardToken: string,
      _rewardPerBlock: number | BN | string,
      _startBlock: number | BN | string,
      _bonusEndBlock: number | BN | string,
      _withdrawalInterval: number | BN | string,
      _admin: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _stakedToken: string,
      _rewardToken: string,
      _rewardPerBlock: number | BN | string,
      _startBlock: number | BN | string,
      _bonusEndBlock: number | BN | string,
      _withdrawalInterval: number | BN | string,
      _admin: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  isInitialized(txDetails?: Truffle.TransactionDetails): Promise<boolean>;

  lastRewardBlock(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  owner(txDetails?: Truffle.TransactionDetails): Promise<string>;

  pendingReward(
    _user: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  recoverWrongTokens: {
    (
      _tokenAddress: string,
      _tokenAmount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _tokenAddress: string,
      _tokenAmount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _tokenAddress: string,
      _tokenAmount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _tokenAddress: string,
      _tokenAmount: number | BN | string,
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

  rewardPerBlock(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  rewardToken(txDetails?: Truffle.TransactionDetails): Promise<string>;

  stakedToken(txDetails?: Truffle.TransactionDetails): Promise<string>;

  startBlock(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  stopReward: {
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

  updateRewardPerBlock: {
    (
      _rewardPerBlock: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _rewardPerBlock: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _rewardPerBlock: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _rewardPerBlock: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  updateStartAndEndBlocks: {
    (
      _startBlock: number | BN | string,
      _bonusEndBlock: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _startBlock: number | BN | string,
      _bonusEndBlock: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _startBlock: number | BN | string,
      _bonusEndBlock: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _startBlock: number | BN | string,
      _bonusEndBlock: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  updateWithdrawalInterval: {
    (
      _interval: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _interval: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _interval: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _interval: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  userInfo(
    arg0: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<{ 0: BN; 1: BN; 2: BN }>;

  withdraw: {
    (
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  withdrawalInterval(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  methods: {
    MAXIMUM_WITHDRAWAL_INTERVAL(
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    POOL_FACTORY(txDetails?: Truffle.TransactionDetails): Promise<string>;

    PRECISION_FACTOR(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    accTokenPerShare(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    bonusEndBlock(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    canWithdraw(
      _user: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<boolean>;

    deposit: {
      (
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    emergencyRewardWithdraw: {
      (
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    emergencyWithdraw: {
      (txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(txDetails?: Truffle.TransactionDetails): Promise<void>;
      sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
      estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
    };

    initialize: {
      (
        _stakedToken: string,
        _rewardToken: string,
        _rewardPerBlock: number | BN | string,
        _startBlock: number | BN | string,
        _bonusEndBlock: number | BN | string,
        _withdrawalInterval: number | BN | string,
        _admin: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _stakedToken: string,
        _rewardToken: string,
        _rewardPerBlock: number | BN | string,
        _startBlock: number | BN | string,
        _bonusEndBlock: number | BN | string,
        _withdrawalInterval: number | BN | string,
        _admin: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _stakedToken: string,
        _rewardToken: string,
        _rewardPerBlock: number | BN | string,
        _startBlock: number | BN | string,
        _bonusEndBlock: number | BN | string,
        _withdrawalInterval: number | BN | string,
        _admin: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _stakedToken: string,
        _rewardToken: string,
        _rewardPerBlock: number | BN | string,
        _startBlock: number | BN | string,
        _bonusEndBlock: number | BN | string,
        _withdrawalInterval: number | BN | string,
        _admin: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    isInitialized(txDetails?: Truffle.TransactionDetails): Promise<boolean>;

    lastRewardBlock(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    owner(txDetails?: Truffle.TransactionDetails): Promise<string>;

    pendingReward(
      _user: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    recoverWrongTokens: {
      (
        _tokenAddress: string,
        _tokenAmount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _tokenAddress: string,
        _tokenAmount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _tokenAddress: string,
        _tokenAmount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _tokenAddress: string,
        _tokenAmount: number | BN | string,
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

    rewardPerBlock(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    rewardToken(txDetails?: Truffle.TransactionDetails): Promise<string>;

    stakedToken(txDetails?: Truffle.TransactionDetails): Promise<string>;

    startBlock(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    stopReward: {
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

    updateRewardPerBlock: {
      (
        _rewardPerBlock: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _rewardPerBlock: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _rewardPerBlock: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _rewardPerBlock: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    updateStartAndEndBlocks: {
      (
        _startBlock: number | BN | string,
        _bonusEndBlock: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _startBlock: number | BN | string,
        _bonusEndBlock: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _startBlock: number | BN | string,
        _bonusEndBlock: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _startBlock: number | BN | string,
        _bonusEndBlock: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    updateWithdrawalInterval: {
      (
        _interval: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _interval: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _interval: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _interval: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    userInfo(
      arg0: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<{ 0: BN; 1: BN; 2: BN }>;

    withdraw: {
      (
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    withdrawalInterval(txDetails?: Truffle.TransactionDetails): Promise<BN>;
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