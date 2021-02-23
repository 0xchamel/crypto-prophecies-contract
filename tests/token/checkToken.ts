import BN from 'bn.js';
import { toWei } from 'web3-utils';
import { expect } from 'chai';
import { TOKEN_CAP, TOKEN_NAME, TOKEN_SYMBOL } from "../helpers/constants";

export default async function suite() {
  describe('CPT token details', async () => {

    let tokenCapRequirement = new BN(TOKEN_CAP);

    beforeEach(async function () {
      
    });

    it('Correct cap', async function () {
      let tokenCap: BN = new BN(await this.cptToken.cap());
      expect(tokenCap).to.be.bignumber.equal(tokenCapRequirement);
    });

    it('Correct name', async function () {
      let tokenName: string = await this.cptToken.name();
      expect(tokenName).to.equal(TOKEN_NAME);
    });

    it('Correct symbol', async function () {
      let tokenSymbol: string = await this.cptToken.symbol();
      expect(tokenSymbol).to.equal(TOKEN_SYMBOL);
    });

  });
}
