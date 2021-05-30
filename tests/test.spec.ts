import checkToken from './token/checkToken';
import checkVesting from './vesting/checkVesting';
import checkNFTold from './nft/checkNFTold';
import checkNFT from './nft/checkNFT';

import BN from 'bn.js';
import { toWei } from 'web3-utils';
import { ProphetV2Contract, TCPContract, TokenVestingContract } from '../types/contracts';
import { TOKEN_CAP } from "./helpers/constants";

const tcp: TCPContract = artifacts.require('TCP');
const vesting: TokenVestingContract = artifacts.require('TokenVesting');
const nft: ProphetV2Contract = artifacts.require('ProphetV2');

describe('Prophecies Contracts', function () {
  before(async function () {
    const accounts = await web3.eth.getAccounts();

    this.owner = accounts[0];
    this.investor1 = accounts[1];
    this.investor2 = accounts[2];

    // @ts-ignore
    await web3.currentProvider.send({jsonrpc: "2.0", method: "evm_mine", params: [], id: 0}, function() {})
    const latestBlockNum = await web3.eth.getBlockNumber();
    const latestBlock = await web3.eth.getBlock(latestBlockNum);
    const blockTime = Number(latestBlock.timestamp);

    // Deploy contracts.
    // TOKEN
    this.tcpToken = await tcp.new(toWei(TOKEN_CAP));

    //VESTING
    // let investors = [];
    // investors.push({
    //   beneficiary: this.investor1,
    //   cliff: (1*30*24*60*60).toString(),
    //   start: "4898622557", //far in the future
    //   totalAmount: toWei("900000"),
    //   totalClaimed: toWei("0"),
    //   initialUnlock: toWei("100000"),
    //   numberOfMonths: "9",
    //   paused: false
    // })
    // this.investor2Start = blockTime+1000;
    // investors.push({
    //   beneficiary: this.investor2,
    //   cliff: (1*30*24*60*60).toString(),
    //   start: this.investor2Start+"",
    //   totalAmount: toWei("900000"),
    //   totalClaimed: toWei("0"),
    //   initialUnlock: toWei("200000"),
    //   numberOfMonths: "9",
    //   paused: false
    // })
    // this.vestingContract = await vesting.new(this.tcpToken.address, investors);

    //NFTs
    this.nft = await nft.new("http://149.12.12.216:3003/v1/prophet/");

    //SETUP - VESTING
    //this.tcpToken.transfer(this.vestingContract.address, toWei("100000000"));

    // let test = await this.vestingContract.getInvestorID(accounts[3]);
    // console.log(test);
    
  });

  describe('When checking tcp erc20 token', checkToken.bind(this));
  //describe('When checking the vesting contract', checkVesting.bind(this));
  // describe('When checking the NFT contract', checkNFTold.bind(this));
  // describe('When checking the NFT contract', checkNFT.bind(this));

});