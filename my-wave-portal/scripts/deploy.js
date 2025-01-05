const hre = require("hardhat");

const main = async () => {
    // Get the deployer account
    const [deployer] = await hre.ethers.getSigners();

    // Get the deployer's account balance
    const accountBalance = await hre.ethers.provider.getBalance(deployer.address);

    console.log("Deploying contracts with account: ", deployer.address);
    console.log("Account balance: ",accountBalance.toString());

    // Deploy the WavePortal contract
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
    const waveContract = await waveContractFactory.deploy();

    // Wait for the deployment transaction to be mined
    await waveContract.waitForDeployment();  

    // Get the deployed contract address
    const waveContractAddress = await waveContract.getAddress();  // Added this line
    
    console.log("WavePortal deployed at address: ", waveContractAddress);

    let waveCount;
    waveCount = await waveContract.getTotalWaves();
    console.log(Number(waveCount));
   

    //let us wave 
    let waveTxn=await waveContract.wave("Hii,How are you");
    await waveTxn.wait();

    const[_,randomperson]=await hre.ethers.getSigners();
    waveTxn=await waveContract.connect(randomperson).wave("Another message");
    await waveTxn.wait();


    let allWaves=await waveContract.getAllWaves();
    console.log(allWaves);
    waveCount=await waveContract.getTotalWaves();
    console.log(Number(waveCount));
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

runMain();
