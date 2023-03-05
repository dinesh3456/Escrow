const main = async () => {
  const [deployer] = await ethers.getSigners();
  const [arbiter] = await ethers.getSigners();

  const accountBalance1 = await deployer.getBalance();
  const accountBalance2 = await arbiter.getBalance();

  console.log("Deploying contracts with account: ", deployer.address);
  console.log("Account balance of deployer: ", accountBalance1.toString());
  console.log("Account balance of arbiter: ", accountBalance2.toString());

  console.log("-------------");

  const beneficiaryAddress = ethers.utils.getAddress(
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
  );

  const escrowContractFactory = await ethers.getContractFactory("Escrow");
  const escrowContract = await escrowContractFactory.deploy(
    arbiter.address,
    beneficiaryAddress,
    {
      value: ethers.utils.parseEther("0.000001"),
    }
  );
  await escrowContract.deployed();
  console.log("-----------------------");

  console.log("Escrow address: ", escrowContract.address);
  console.log("---------------------");
  //[arbiterAddress] = await ethers.getSigners();

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
