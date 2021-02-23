import checkToken from './checkToken';

import BN from 'bn.js';
import { toWei } from 'web3-utils';
import { CPTContract } from '../../types/contracts';
import { TOKEN_CAP } from "../helpers/constants";

const CPT: CPTContract = artifacts.require('CPT');

describe('Token', function () {
  before(async function () {
    const accounts = await web3.eth.getAccounts();

    this.owner = accounts[0];
    this.random = accounts[1];

    // Deploy contracts.
    this.cptToken = await CPT.new(TOKEN_CAP);

  });

  describe('When checking cpt erc20 token', checkToken.bind(this));
});
