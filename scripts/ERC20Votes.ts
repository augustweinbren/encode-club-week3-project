import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types";

const MINT_VALUE = ethers.utils.parseEther("10");

async function main () {
  const [deployer, acct1, acct2] = await ethers.getSigners();
  const contractFactory = new MyToken__factory(deployer);
  const contract = await contractFactory.deploy();
  const deployTransactionReceipt = await contract.deployTransaction.wait();
  console.log(
    `The tokenized votes contract was deployed at the block` +
    ` ${deployTransactionReceipt.blockNumber}`);

  // deploy contract

  const mintTx = await contract.mint(acct1.address, MINT_VALUE);
  const mintTxReceipt = await mintTx.wait();
  console.log(
    `Tokens minted for ${acct1.address} at block ${mintTxReceipt.blockNumber}`
  );
  const tokenBalanceAccount1 = await contract.balanceOf(acct1.address);
  console.log(`Acct 1 has a balance of ` +
    `${ethers.utils.formatEther(tokenBalanceAccount1)} vote tokens`)
  // mint tokens


    const delegateTx = await contract.connect(acct1).delegate(acct1.address);
    const delegateTxReceipt = await delegateTx.wait();
    console.log(`Tokens delegated for acct1 (${acct1.address}) at block ${delegateTxReceipt.blockNumber}`)
    console.log(`Cost of delegation: ${delegateTxReceipt.gasUsed} gas units
     at a unit price of ${delegateTxReceipt.effectiveGasPrice} each`);
  // Self delegate

  const votePowerAcct1 = await contract.getVotes(acct1.address);
  console.log(
    `Account 1 has a vote power of 
    ${ethers.utils.formatEther(votePowerAcct1)}`
  )
  // check voting power


  const mintTx2 = await contract.mint(acct2.address, MINT_VALUE);
  const mintTx2Receipt = await mintTx2.wait();
  console.log(
    `Tokens minted for ${acct2.address} at block ${mintTx2Receipt.blockNumber}`
  );
  const tokenBalanceAccount2 = await contract.balanceOf(acct2.address);
  console.log(`Acct 2 has a balance of ` +
    `${ethers.utils.formatEther(tokenBalanceAccount2)} vote tokens`)
  // mint more tokens

  const currentBlock2 = await ethers.provider.getBlock("latest");
  console.log(`Current block number is ${currentBlock2.number}`);


  //historic voting power
  const pastVotePowerAcct1 = await contract.getPastVotes(acct1.address, currentBlock2.number - 1);
  console.log(`Past vote power of account 1: ${pastVotePowerAcct1}`);

}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});