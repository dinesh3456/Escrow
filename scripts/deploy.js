const main = async () => {
  const [deployer, arbiter, beneficiary] = await ethers.getSigners();
  const accountBalance = await deployer.getBalance();

  console.log("Deploying contracts with account: ", deployer.address);
  console.log("Account balance: ", accountBalance.toString());

  const escrowContractFactory = await ethers.getContractFactory("Escrow");
  const escrowContract = await escrowContractFactory.deploy(arbiter.address, beneficiary.address, {
    value: ethers.utils.parseEther("0.0001"),
  });
  await escrowContract.deployed();

  console.log("Escrow address: ", escrowContract.address);

  const approveTx = await escrowContract.connect(arbiter).approve();
  console.log("Approve transaction hash: ", approveTx.hash);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
