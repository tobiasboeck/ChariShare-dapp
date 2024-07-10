const { expect } = require("chai");
require("@nomicfoundation/hardhat-toolbox");
const { ethers } = require("hardhat");
describe("CampaignCreator Contract", function () {
    let CampaignCreator;
    let campaignCreator;
    let deployer; // Declare deployer variable outside beforeEach to make it accessible to other test cases
    beforeEach(async () => {
        // Deploy the CampaignCreator contract before each test
        console.log(
            "\n",
            "Deploying the CampaignCreator contract for each test, and for the second test, creating a new campaign with the CrowdCollab contract instance address provided."
        );
        [deployer] = await ethers.getSigners();
        CampaignCreator = await ethers.getContractFactory("CampaignCreator");
        campaignCreator = await CampaignCreator.deploy();
        // Extract deployer and target contract addresses for reference
        const deployerAddress = campaignCreator.runner.address;
        console.log("\n", "Deployer Address:", deployerAddress);
        const targetContractAddress = campaignCreator.target;
        console.log(
            "\n",
            "Deployed CampaignCreator Contract Address:",
            targetContractAddress
        );
    });
    it("TEST:should initially return an empty list of deployed campaigns",
        async function () {
            // Test case to verify that the list of deployed campaigns is empty
            initially
            const deployedCampaigns = await campaignCreator.getDeployedCampaigns();
            expect(deployedCampaigns).to.be.an("array").that.is.empty;
        });
    it("TEST:should create a new campaign with specified parameters and confirm its existence in the campaign list", async function () {
        // Test case to confirm that a new campaign can be created with specified parameters and exists in the campaign list
        const minContribution = 1000;
        const description = "Campaign Title Description";
        await campaignCreator.createCampaign(minContribution, description);
        const deployedCampaigns = await campaignCreator.getDeployedCampaigns();
        expect(deployedCampaigns.length).to.equal(1);
        // Get the address of the last deployed campaign and log it for
        reference
        const lastDeployedCampaignAddress =
            deployedCampaigns[deployedCampaigns.length - 1];
        console.log(
            "\n",
            "Deployed CrowdCollab Contract instance address, the new campaign:",
            lastDeployedCampaignAddress
        );
    });
    // Additional test cases can be added as needed
});
