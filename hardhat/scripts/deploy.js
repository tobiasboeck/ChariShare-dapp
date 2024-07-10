const { ethers } = require("hardhat");
const fs = require("fs");
async function deployCampaignCreator() {
    // Get the deployer's address
    const [deployer] = await ethers.getSigners();
    console.log(
        "Deploying CampaignCreator contract with the account:",
        deployer.address
    );
    // Get the CampaignCreator contract factory
    const CampaignCreator = await
        ethers.getContractFactory("CampaignCreator");
    // Deploy the CampaignCreator contract
    const campaignCreator = await CampaignCreator.deploy();
    // console.log(campaignCreator.target);
    // Save deployment information to a text file
    const deploymentInfo = `Deployer Address:
${deployer.address}\nCampaignCreator Contract Address:
${campaignCreator.target}`;
    console.log(`CampaignCreator Contract Address deployed: ${campaignCreator.target}`
    );
    fs.writeFileSync("deploymentInfoCampaignCreator.txt", deploymentInfo);
    // Return the deployed CampaignCreator contract instance
    return campaignCreator;
}
async function main() {
    try {
        // Deploy the CampaignCreator contract
        const campaignCreator = await deployCampaignCreator();
        console.log("Deployment completed successfully!");
    } catch (error) {
        console.error("Error deploying contracts:", error);
        process.exitCode = 1;
    }
} main();
