// Load the ethers module
const { ethers } = require("hardhat");
async function main() {
    // Retrieve the deployed CampaignCreator contract instance
    const CampaignCreator = await
        ethers.getContractFactory("CampaignCreator");
    const campaignCreator = await CampaignCreator.attach(
        "0x9F169F78e192dd93a1E230895BEE5571b5cd47a7"
    );

    console.log(campaignCreator);

    // Call contract functions
    const result = await campaignCreator.createCampaign(1000000, "CampaignName"); // Example function call
    console.log(result)
    // Interact with the result
    console.log("Transaction hash:", result.hash);
    console.log("Block number:", result.blockNumber);
    console.log("Campaign created:", result.events[0].args.name); // Assuming an event is emitted upon campaign creation
}
// Execute the main function
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
