import checkToken from './checkToken';

import BN from 'bn.js';
import { toWei } from 'web3-utils';
import { TCPContract } from '../../types/contracts';
import { TOKEN_CAP } from "../helpers/constants";

const tcp: TCPContract = artifacts.require('TCP');

describe('Token', function () {
  before(async function () {
    const accounts = await web3.eth.getAccounts();

    this.owner = accounts[0];
    this.random = accounts[1];

    // Deploy contracts.
    this.tcpToken = await tcp.new(TOKEN_CAP);

  });

  describe('When checking tcp erc20 token', checkToken.bind(this));
});
