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
      let id = await this.nft._createProphet(1, 3, 2, 5);
      id = new BN(id.logs[0].args.tokenId);
      id = id.toString(2);

      let generation = new BN(id.substring((8*0)+1, (8*1)+1), 2);
      expect(generation.toNumber()).to.equal(1);
      let rarity = new BN(id.substring((8*1)+1, (8*2)+1), 2);
      expect(rarity.toNumber()).to.equal(3);
      let race = new BN(id.substring((8*2)+1, (8*3)+1), 2);
      expect(race.toNumber()).to.equal(2);
      let character = new BN(id.substring((8*3)+1, (8*4)+1), 2);
      expect(character.toNumber()).to.equal(5);
      
      let prophetCounter = new BN(id.substring((29*0)+33, (29*1)+33), 2);
      expect(prophetCounter.toNumber()).to.equal(1);
      let generationCounter = new BN(id.substring((29*1)+33, (29*2)+33), 2);
      expect(generationCounter.toNumber()).to.equal(1);
      let rarityCounter = new BN(id.substring((29*2)+33, (29*3)+33), 2);
      expect(rarityCounter.toNumber()).to.equal(1);
      let raceCounter = new BN(id.substring((29*3)+33, (29*4)+33), 2);
      expect(raceCounter.toNumber()).to.equal(1);
      let characterCounter = new BN(id.substring((29*4)+33, (29*5)+33), 2);
      expect(characterCounter.toNumber()).to.equal(1);
    });

    it('Can mint more', async function () {
      //(uint8 generation, uint8 rarity, uint8 race, uint8 character
      let id = await this.nft._createProphet(1, 2, 2, 2);
      id = new BN(id.logs[0].args.tokenId);
      id = id.toString(2);

      let generation = new BN(id.substring((8*0)+1, (8*1)+1), 2);
      expect(generation.toNumber()).to.equal(1);
      let rarity = new BN(id.substring((8*1)+1, (8*2)+1), 2);
      expect(rarity.toNumber()).to.equal(2);
      let race = new BN(id.substring((8*2)+1, (8*3)+1), 2);
      expect(race.toNumber()).to.equal(2);
      let character = new BN(id.substring((8*3)+1, (8*4)+1), 2);
      expect(character.toNumber()).to.equal(2);
      
      let prophetCounter = new BN(id.substring((29*0)+33, (29*1)+33), 2);
      expect(prophetCounter.toNumber()).to.equal(2);
      let generationCounter = new BN(id.substring((29*1)+33, (29*2)+33), 2);
      expect(generationCounter.toNumber()).to.equal(2);
      let rarityCounter = new BN(id.substring((29*2)+33, (29*3)+33), 2);
      expect(rarityCounter.toNumber()).to.equal(1);
      let raceCounter = new BN(id.substring((29*3)+33, (29*4)+33), 2);
      expect(raceCounter.toNumber()).to.equal(2);
      let characterCounter = new BN(id.substring((29*4)+33, (29*5)+33), 2);
      expect(characterCounter.toNumber()).to.equal(1);
    });

  });
}
