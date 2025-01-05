const { ethers } = require("hardhat");

const main = async () => {
    // Log the deployer info first to verify we're connected
    const [deployer] = await ethers.getSigners();
    console.log("Deploying with account:", deployer.address);
    
    const waveContractFactory = await ethers.getContractFactory('WavePortal');
    
   
    const waveContract = await waveContractFactory.deploy({
        value: ethers.parseEther('0.01'),
    });

   
    await waveContract.waitForDeployment();
    
    const contractAddress = await waveContract.getAddress();
    console.log('Contract deployed to:', contractAddress);

    
    if (!contractAddress) {
        throw new Error("Contract deployment failed - no address returned");
    }

    // Get and log contract balance
    let contractBalance = await ethers.provider.getBalance(contractAddress);
    console.log(
        'Contract balance:',
        ethers.formatEther(contractBalance)
    );

    
    let waveTxn = await waveContract.wave("This is wave #1");
                       
    await waveTxn.wait();


    let waveTxn2=await waveContract.wave("This is wave #2");
    await waveTxn2.wait();

    // Get updated contract balance
    contractBalance = await ethers.provider.getBalance(contractAddress);
    console.log(
        'Contract balance:',
        ethers.formatEther(contractBalance)
    );

    let allWaves = await waveContract.getAllWaves();
    console.log("All waves:", allWaves);
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log("Error details:", error);
        process.exit(1);
    }
};

runMain();