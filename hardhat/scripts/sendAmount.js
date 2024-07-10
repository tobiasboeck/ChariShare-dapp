// Load Hardhat environment
const hre = require("hardhat");
async function main() {
    // Get the first account from the Hardhat network
    const [sender] = await hre.ethers.getSigners();

    // Define recipient address
    const recipientAddress = "0x5963a4289C4f7B84826d372ce68C3C16d33735c3"; //Replace with the recipient's address
    // Define amount to send (in wei)
    const amountToSend = 1000000000000000000n; // Sending 1 Ether
    // Send transaction
    const tx = await sender.sendTransaction({
        to: recipientAddress,
        value: amountToSend,
    });
    // Wait for transaction receipt
    await tx.wait();
    console.log("Transaction sent successfully!");
}
// Run the function
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
