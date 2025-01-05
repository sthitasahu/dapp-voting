const hre = require("hardhat");

const main = async () => {
    // Get the deployer account
    const [deployer] = await ethers.getSigners();
        console.log("Deploying with account:", deployer.address);
        
        const waveContractFactory = await ethers.getContractFactory('WavePortal');
        
       
        const waveContract = await waveContractFactory.deploy({
            value: ethers.parseEther('0.01'),
        });
    
       
        await waveContract.waitForDeployment();
        
        const contractAddress = await waveContract.getAddress();
        console.log('Contract deployed to:', contractAddress);
    
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
