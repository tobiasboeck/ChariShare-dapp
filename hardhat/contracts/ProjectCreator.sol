// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "./CrowdCollab.sol"; // Import the CrowdCollab contract

contract CampaignCreator {
    // Declare variables
    address[] public campaigns;
    // Define functions
    /**
     * @dev Create a new campaign
     * @param minContribution The minimum contribution required to
participate in the campaign
     * @param description Description of the campaign
     */
    function createCampaign(uint256 minContribution, string memory
        description) public {
        address newCampaign = address(new CrowdCollab(msg.sender,
            minContribution, description));
        campaigns.push(newCampaign);
    }
    /**
     * @dev Get all deployed campaigns
     * @return campaigns List of deployed campaign addresses
     */
    function getDeployedCampaigns() public view returns (address[] memory)
    {
        return campaigns;
    }

    /**
 * @dev Get the current balance of the wallet
     * @param wallet The address of the wallet to check balance
     * @return balance The current balance of the wallet
     */
    function getWalletBalance(address wallet) public view returns (uint256) {
        return wallet.balance;
    }
}
