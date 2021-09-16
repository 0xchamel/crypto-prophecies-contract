import BN from "bn.js";
import { toWei, fromWei } from "web3-utils";
import { expect } from "chai";
import { TOKEN_CAP, TOKEN_NAME, TOKEN_SYMBOL } from "../helpers/constants";
import { throws } from "node:assert";

export default async function suite() {
    describe("Vesting Contract", async () => {
        let tokenCapRequirement = new BN(TOKEN_CAP);

        beforeEach(async function() {
            this.latestBlockNum = await web3.eth.getBlockNumber();
            this.latestBlock = await web3.eth.getBlock(this.latestBlockNum);

            this.advanceTime = async (seconds) => {
                // @ts-ignore
                await web3.currentProvider.send(
                    { method: "evm_increaseTime", params: [seconds], id: 0 },
                    function() {}
                );
                // @ts-ignore
                await web3.currentProvider.send(
                    { jsonrpc: "2.0", method: "evm_mine", params: [], id: 0 },
                    function() {}
                );
                this.latestBlockNum = await web3.eth.getBlockNumber();
                this.latestBlock = await web3.eth.getBlock(this.latestBlockNum);
            };
        });

        it("Correct vesting stats", async function() {
            let investorID = await this.vestingContract.getInvestorID(
                this.investor1
            );
            let investorInfo = await this.vestingContract.getInvestor(
                investorID
            );
            expect(investorInfo.cliff).to.be.equal(
                (1 * 30 * 24 * 60 * 60).toString()
            );
            expect(investorInfo.start).to.be.equal("4898622557");
            expect(investorInfo.totalAmount).to.be.equal(toWei("900000"));
            expect(investorInfo.totalClaimed).to.be.equal(toWei("0"));
            expect(investorInfo.initialUnlock).to.be.equal(toWei("100000"));
            expect(investorInfo.numberOfMonths).to.be.equal("9");
            expect(investorInfo.paused).to.be.equal(false);
        });

        it("Cannot claim before start timestamp", async function() {
            let investorID = await this.vestingContract.getInvestorID(
                this.investor2
            );
            let vested = await this.vestingContract.vestedAmount(investorID);
            expect(vested).to.be.bignumber.equal(new BN(0));
            await this.vestingContract.claim({ from: this.investor2 });
            let totalClaimed = await this.vestingContract.getTotalClaimed(
                investorID
            );
            expect(totalClaimed).to.be.bignumber.equal(new BN(0));
        });

        it("Cannot claim before start+cliff timestamp", async function() {
            let investorID = await this.vestingContract.getInvestorID(
                this.investor2
            );
            await this.advanceTime(2000); //After start time but not before end of cliff
            let vested = await this.vestingContract.vestedAmount(investorID);
            expect(vested).to.be.bignumber.equal(new BN(0));
            await this.vestingContract.claim({ from: this.investor2 });
            let totalClaimed = await this.vestingContract.getTotalClaimed(
                investorID
            );
            expect(totalClaimed).to.be.bignumber.equal(new BN(0));
        });

        it("Can claim at TGE", async function() {
            let investorID = await this.vestingContract.getInvestorID(
                this.investor2
            );
            let cliff = parseInt(
                await this.vestingContract.getCliff(investorID)
            );
            await this.advanceTime(cliff); //After start time but not before end of cliff
            const start = parseInt(
                await this.vestingContract.getStart(investorID)
            );
            // @ts-ignore
            expect(start).to.be.lessThan(this.latestBlock.timestamp);
            // @ts-ignore
            expect(start + cliff).to.be.lessThan(this.latestBlock.timestamp);

            /*
      const monthsPassed = parseInt(await this.vestingContract.getMonthsPassed(investorID));
      console.log(monthsPassed)
      const monthly = parseInt(fromWei(await this.vestingContract.getMonthlyVesting(investorID)));
      console.log(monthly)
      */

            let initialUnlock = await parseInt(
                fromWei(await this.vestingContract.getInitialUnlock(investorID))
            );
            let vested = parseInt(
                fromWei(await this.vestingContract.vestedAmount(investorID))
            );
            // @ts-ignore
            expect(vested).to.be.equal(initialUnlock);

            await this.vestingContract.claim({ from: this.investor2 });

            let totalClaimed = parseInt(
                fromWei(await this.vestingContract.getTotalClaimed(investorID))
            );
            // @ts-ignore
            expect(totalClaimed).to.be.equal(initialUnlock);

            let balanceOfInvestor = parseInt(
                fromWei(await this.tcpToken.balanceOf(this.investor2))
            );
            // @ts-ignore
            expect(balanceOfInvestor).to.be.equal(initialUnlock);
        });

        it("Can claim 1 month", async function() {
            let investorID = await this.vestingContract.getInvestorID(
                this.investor2
            );
            await this.advanceTime(30 * 24 * 60 * 60); //1 month
            const totalAmount = parseInt(
                fromWei(await this.vestingContract.getTotalAmount(investorID))
            );
            const numberOfMonths = parseInt(
                await this.vestingContract.getNumberOfMonths(investorID)
            );
            let vested = parseInt(
                fromWei(await this.vestingContract.vestedAmount(investorID))
            );
            let initialUnlock = await parseInt(
                fromWei(await this.vestingContract.getInitialUnlock(investorID))
            );
            // @ts-ignore
            expect(vested).to.be.equal(totalAmount / numberOfMonths);

            await this.vestingContract.claim({ from: this.investor2 });

            let totalClaimed = parseInt(
                fromWei(await this.vestingContract.getTotalClaimed(investorID))
            );
            // @ts-ignore
            expect(totalClaimed).to.be.equal(
                totalAmount / numberOfMonths + initialUnlock
            ); //TGE + 1 month

            let balanceOfInvestor = parseInt(
                fromWei(await this.tcpToken.balanceOf(this.investor2))
            );
            // @ts-ignore
            expect(balanceOfInvestor).to.be.equal(
                totalAmount / numberOfMonths + initialUnlock
            ); //TGE + 1 month
        });

        it("Paused cannot claim", async function() {
            let investorID = await this.vestingContract.getInvestorID(
                this.investor2
            );
            const totalAmount = parseInt(
                fromWei(await this.vestingContract.getTotalAmount(investorID))
            );
            const numberOfMonths = parseInt(
                await this.vestingContract.getNumberOfMonths(investorID)
            );
            let initialUnlock = await parseInt(
                fromWei(await this.vestingContract.getInitialUnlock(investorID))
            );
            await this.advanceTime(3 * 30 * 24 * 60 * 60); //3 months
            await this.vestingContract.setVestingPause(investorID, true);

            let vested = parseInt(
                fromWei(await this.vestingContract.vestedAmount(investorID))
            );
            // @ts-ignore
            expect(vested).to.be.equal((totalAmount / numberOfMonths) * 3);

            let revert = null;
            try {
                await this.vestingContract.claim({ from: this.investor2 });
            } catch (error) {
                revert = error;
            }
            expect(revert).to.be.a("Error"); //Should revert

            await this.vestingContract.setVestingPause(investorID, false); //Unpause for later tests
        });

        it("Can claim 3 months at one time", async function() {
            let investorID = await this.vestingContract.getInvestorID(
                this.investor2
            );
            //advanced time in the pausing test above ^^^
            const totalAmount = parseInt(
                fromWei(await this.vestingContract.getTotalAmount(investorID))
            );
            const monthsPassed = parseInt(
                await this.vestingContract.getMonthsPassed(investorID)
            );
            const numberOfMonths = parseInt(
                await this.vestingContract.getNumberOfMonths(investorID)
            );
            let vested = parseInt(
                fromWei(await this.vestingContract.vestedAmount(investorID))
            );
            let initialUnlock = await parseInt(
                fromWei(await this.vestingContract.getInitialUnlock(investorID))
            );
            // @ts-ignore
            expect(vested).to.be.equal((totalAmount / numberOfMonths) * 3);

            await this.vestingContract.claim({ from: this.investor2 });

            let totalClaimed = parseInt(
                fromWei(await this.vestingContract.getTotalClaimed(investorID))
            );
            // @ts-ignore
            expect(totalClaimed).to.be.equal(
                (totalAmount / numberOfMonths) * 4 + initialUnlock
            ); //TGE + 4 months

            let balanceOfInvestor = parseInt(
                fromWei(await this.tcpToken.balanceOf(this.investor2))
            );
            // @ts-ignore
            expect(balanceOfInvestor).to.be.equal(
                (totalAmount / numberOfMonths) * 4 + initialUnlock
            ); //TGE + 4 months
        });

        it("Can claim the last payment", async function() {
            let investorID = await this.vestingContract.getInvestorID(
                this.investor2
            );
            await this.advanceTime(9 * 30 * 24 * 60 * 60); //5 months but only 5 months of payments
            const totalAmount = parseInt(
                fromWei(await this.vestingContract.getTotalAmount(investorID))
            );
            const monthsPassed = parseInt(
                await this.vestingContract.getMonthsPassed(investorID)
            );
            const numberOfMonths = parseInt(
                await this.vestingContract.getNumberOfMonths(investorID)
            );
            let vested = parseInt(
                fromWei(await this.vestingContract.vestedAmount(investorID))
            );
            let initialUnlock = await parseInt(
                fromWei(await this.vestingContract.getInitialUnlock(investorID))
            );
            // @ts-ignore
            expect(vested).to.be.equal((totalAmount / numberOfMonths) * 5);

            await this.vestingContract.claim({ from: this.investor2 });

            let totalClaimed = parseInt(
                fromWei(await this.vestingContract.getTotalClaimed(investorID))
            );
            // @ts-ignore
            expect(totalClaimed).to.be.equal(
                (totalAmount / numberOfMonths) * 9 + initialUnlock
            ); //TGE + 9 months

            let balanceOfInvestor = parseInt(
                fromWei(await this.tcpToken.balanceOf(this.investor2))
            );
            // @ts-ignore
            expect(balanceOfInvestor).to.be.equal(
                (totalAmount / numberOfMonths) * 9 + initialUnlock
            ); //TGE + 9 months
        });

        it("Can not claim after funds have ran out", async function() {
            let investorID = await this.vestingContract.getInvestorID(
                this.investor2
            );
            await this.advanceTime(2 * 30 * 24 * 60 * 60); //2 months
            const totalAmount = parseInt(
                fromWei(await this.vestingContract.getTotalAmount(investorID))
            );
            const monthsPassed = parseInt(
                await this.vestingContract.getMonthsPassed(investorID)
            );
            const numberOfMonths = parseInt(
                await this.vestingContract.getNumberOfMonths(investorID)
            );
            let vested = parseInt(
                fromWei(await this.vestingContract.vestedAmount(investorID))
            );
            let initialUnlock = await parseInt(
                fromWei(await this.vestingContract.getInitialUnlock(investorID))
            );
            // @ts-ignore
            expect(vested).to.be.equal(0);

            await this.vestingContract.claim({ from: this.investor2 });

            let totalClaimed = parseInt(
                fromWei(await this.vestingContract.getTotalClaimed(investorID))
            );
            // @ts-ignore
            expect(totalClaimed).to.be.equal(
                (totalAmount / numberOfMonths) * 9 + initialUnlock
            ); //TGE + 9 months

            let balanceOfInvestor = parseInt(
                fromWei(await this.tcpToken.balanceOf(this.investor2))
            );
            // @ts-ignore
            expect(balanceOfInvestor).to.be.equal(
                (totalAmount / numberOfMonths) * 9 + initialUnlock
            ); //TGE + 9 months
        });
    });
}
