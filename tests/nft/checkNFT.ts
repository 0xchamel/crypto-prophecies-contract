import BN from 'bn.js';
import { toWei, fromWei } from 'web3-utils';
import { expect } from 'chai';
import { TOKEN_CAP, TOKEN_NAME, TOKEN_SYMBOL } from "../helpers/constants";

export default async function suite() {
  describe('tcp token details', async () => {

    let tokenCapRequirement = new BN(toWei(TOKEN_CAP));

    beforeEach(async function () {
      
    });

    it('Can mint correctly', async function () {
      //(uint8 generation, uint8 rarity, uint8 race, uint8 character
      let id = await this.nft._createProphet(1, 3, 2, 5, this.owner);
      id = new BN(id.logs[0].args.tokenId);
      id = id.toNumber();

      const { generation, rarity, race, character } = await this.nft.getProphet(id)

      expect(generation.toNumber()).to.equal(1);
      expect(rarity.toNumber()).to.equal(3);
      expect(race.toNumber()).to.equal(2);
      expect(character.toNumber()).to.equal(5);
    });
    it('Can mint more', async function () {
      //(uint8 generation, uint8 rarity, uint8 race, uint8 character
      let id = await this.nft._createProphet(2, 2, 2, 2, this.owner);
      id = new BN(id.logs[0].args.tokenId);
      id = id.toNumber();

      const { generation, rarity, race, character } = await this.nft.getProphet(id)

      expect(generation.toNumber()).to.equal(2);
      expect(rarity.toNumber()).to.equal(2);
      expect(race.toNumber()).to.equal(2);
      expect(character.toNumber()).to.equal(2);
    });
  });
}
