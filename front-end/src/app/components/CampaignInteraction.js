"use client";
import React, {useEffect, useState} from "react";
import Web3 from "web3";
import crowdCollabArtifact from "../../../../hardhat/artifacts/contracts/CrowdCollab.sol/CrowdCollab.json";
import axios from "axios";

const contractAbi = crowdCollabArtifact.abi;
const CampaignInteraction = ({contractAddress, web3}) => {
    const [contractInstance, setContractInstance] = useState(null);
    const [campaignDescription, setCampaignDescription] = useState("");
    const [manager, setManager] = useState("");
    const [minimumContribution, setMinimumContribution] = useState(0);
    const [minimumContributionInETH, setMinimumContributionInETH] = useState(0);
    const [minimumContributionInEuro, setMinimumContributionInEuro] = useState(0);
    const [numberSupporters, setNumberSupporters] = useState(0);
    const [requests, setRequests] = useState([]);
    const [contributionAmount, setContributionAmount] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [userAddress, setUserAddress] = useState("");
    const [requestDescription, setRequestDescription] = useState("");
    const [requestAmount, setRequestAmount] = useState("");
    const [requestRecipient, setRequestRecipient] = useState("");
    const [contractBalance, setContractBalance] = useState([]);

    useEffect(() => {
        if (web3) {
            const instance = new web3.eth.Contract(contractAbi, contractAddress);
            setContractInstance(instance);
        }
    }, [contractAddress, web3]);

    useEffect(() => {
        const getSummary = async () => {
            try {
                if (contractInstance) {
                    const description = await contractInstance.methods.campaignDescription().call();
                    const managerAddress = await contractInstance.methods.manager().call();
                    const minContribution = await contractInstance.methods.minimumContribution().call();
                    const numSupporters = await contractInstance.methods.numberSupporters().call();

                    setCampaignDescription(description);
                    setManager(managerAddress);
                    setMinimumContribution(minContribution);
                    setNumberSupporters(numSupporters);

                    const requestsCount = await contractInstance.methods.getRequestsCount().call();
                    const requestsArray = [];
                    for (let i = 0; i < requestsCount; i++) {
                        const request = await contractInstance.methods.requests(i).call();
                        requestsArray.push(request);
                    }
                    setRequests(requestsArray);

                    const contractBalance = await web3.eth.getBalance(contractInstance.options.address);
                    setContractBalance(contractBalance);

                    // Convert minimumContribution to ETH and EUR
                    const minContributionInETH = web3.utils.fromWei(minContribution, 'ether');
                    setMinimumContributionInETH(minContributionInETH);

                    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=eur');
                    const ethToEurRate = response.data.ethereum.eur;
                    const minContributionInEuro = minContributionInETH * ethToEurRate;
                    setMinimumContributionInEuro(minContributionInEuro);

                }
            } catch (error) {
                console.error("Error getting contract summary:", error);
            }
        };
        getSummary();
    }, [contractInstance, web3]);

    const handleContribution = async () => {
        try {
            if (!window.ethereum) {
                console.error("MetaMask extension not detected");
                return;
            }
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const web3Instance = new Web3(window.ethereum);
            const accounts = await web3Instance.eth.getAccounts();
            const senderAddress = accounts[0];
            const contractInstance = new web3Instance.eth.Contract(contractAbi, contractAddress);

            const gasPrice = await web3Instance.eth.getGasPrice();

            await contractInstance.methods.contribute().send({
                value: contributionAmount,
                from: senderAddress,
                gasPrice: gasPrice
            });

        } catch (error) {
            console.error("Error contributing to campaign:", error);
        }
    };

    const createRequest = async () => {
        try {
            if (!window.ethereum) {
                console.error("MetaMask extension not detected");
                return;
            }
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const web3Instance = new Web3(window.ethereum);
            const accounts = await web3Instance.eth.getAccounts();
            const senderAddress = accounts[0];
            const contractInstance = new web3Instance.eth.Contract(contractAbi, contractAddress);

            const gasPrice = await web3Instance.eth.getGasPrice();

            await contractInstance.methods.createRequest(
                requestDescription,
                web3Instance.utils.toWei(requestAmount, 'ether'),
                requestRecipient
            ).send({ from: senderAddress, gasPrice: gasPrice });
        } catch (error) {
            console.error("Error creating request:", error);
        }
    };

    const approveRequest = async (requestId) => {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const web3Instance = new Web3(window.ethereum);
            const accounts = await web3Instance.eth.getAccounts();
            const senderAddress = accounts[0];
            const contractInstance = new web3Instance.eth.Contract(contractAbi, contractAddress);

            const gasPrice = await web3Instance.eth.getGasPrice();

            await contractInstance.methods.approveRequest(requestId).send({
                from: senderAddress,
                gasPrice: gasPrice
            });
        } catch (error) {
            console.error("Error approving request:", error);
        }
    };

    const finalizeRequest = async (requestId) => {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const web3Instance = new Web3(window.ethereum);
            const accounts = await web3Instance.eth.getAccounts();
            const senderAddress = accounts[0];
            const contractInstance = new web3Instance.eth.Contract(contractAbi, contractAddress);

            const gasPrice = await web3Instance.eth.getGasPrice();

            await contractInstance.methods.finalizeRequest(requestId).send({
                from: senderAddress,
                gasPrice: gasPrice
            });
        } catch (error) {
            console.error("Error finalizing request:", error);
        }
    };

    const contributionAmountETH = contributionAmount / 10 ** 18;
    const requestAmountETH = requestAmount / 10 ** 18;
    return (
        <div>
            <div className="grid grid-cols-3 gap-4">
                <div
                    className="bg-gray-700 rounded-lg p-4 space-y-2.5 text-white border-transparent hover:border-2 hover:border-violet-600 border-2">
                    <h5 className="font-bold">Description:</h5>
                    <h2>{campaignDescription}</h2>
                </div>
                <div
                    className="bg-gray-700 rounded-lg p-4 space-y-2.5 text-white border-transparent hover:border-2 hover:border-violet-600 border-2">
                    <h5 className="font-bold">Campaign Manager:</h5>
                    <p style={{wordBreak: "break-all"}}>{manager}</p>
                </div>
                <div
                    className="bg-gray-700 rounded-lg p-4 space-y-2.5 text-white border-transparent hover:border-2 hover:border-violet-600 border-2">
                    <h5 className="font-bold">Contract Balance in wei:</h5>
                    <p style={{wordBreak: "break-all"}}>{contractBalance.toString()}</p>
                </div>
                <div
                    className="col-span-3 bg-gray-700 rounded-lg p-4 space-y-2.5 text-white border-transparent hover:border-2 hover:border-violet-600 border-2">
                    <h5 className="font-bold">Number of Supporters:</h5>
                    <p>{numberSupporters.toString()}</p>
                </div>
                <div
                    className="col-span-3 bg-gray-700 rounded-lg p-4 space-y-2.5 text-white border-transparent hover:border-2 hover:border-violet-600 border-2">
                    <h5 className="font-bold">Number of Requests:</h5>
                    <p>{requests.length}</p>
                </div>
                <div
                    className="col-span-3 bg-gray-700 rounded-lg p-4 space-y-2.5 text-white border-transparent hover:border-2 hover:border-violet-600 border-2 mb-4">
                    <h5 className="font-bold">Minimum Contribution in wei:</h5>
                    <p style={{wordBreak: "break-all"}}>{minimumContribution.toString()}</p>
                    <h5 className="font-bold">Minimum Contribution in ETH:</h5>
                    <p>{minimumContributionInETH} ETH</p>
                    <h5 className="font-bold">Minimum Contribution in Euro:</h5>
                    <p>{minimumContributionInEuro.toFixed(2)} EUR</p>
                </div>
            </div>

            {
                requests.map((request, index) => (
                    <div key={index}>
                        <div className="bg-gray-400 h-[1px]"></div>
                        <div className="bg-gray-700 rounded-lg p-4 mt-4  border-transparent hover:border-2 hover:border-violet-600 border-2">
                            <div>
                                <h4 className="font-bold text-lg">Request {index + 1}:</h4>
                            </div>
                            <div className="my-4">
                                <h5>Description:</h5>
                                <p>
                                    <strong>{request.description}</strong>
                                </p>
                            </div>
                            <div className="my-4">
                                <h5>Amount:</h5>
                                <p>
                                    <strong>{web3.utils.fromWei(request.amount, 'ether')}</strong>
                                </p>
                            </div>
                            <div>
                                <h5>Recipient Address:</h5>
                                <p>
                                    <strong>{request.recipient}</strong>
                                </p>
                            </div>
                            <div className="my-4">
                                <h5>Finalized status:</h5>
                                <p>
                                    <strong>{request.complete.toString()}</strong>
                                </p>
                            </div>
                            <div className="flex flex-col">
                                <button onClick={() => approveRequest(index)} className="bg-violet-600 rounded-lg p-2 my-2 hover:bg-violet-600/50">
                                    Approve <span>&#x2714;</span>
                                </button>

                                <button onClick={() => finalizeRequest(index)} className="bg-violet-600 rounded-lg p-2 my-2 hover:bg-violet-600/50">
                                    Finalize <span>&#x1F389;</span>
                                </button>

                            </div>


                            <div>
                                <em style={{fontSize: "smaller", wordBreak: "keep-all"}}>
                                    To finalize a request, the number of approvals must exceed
                                    the total supporters.
                                </em></div>
                        </div>

                    </div>
                ))
            }

            {/* Input field for contribution amount */
            }
            <div className="bg-gray-400 h-[1px] mt-4"></div>
            <div className="my-8">
                <h4 className="font-bold text-xl">Support Campaign:</h4>
                <div className="flex flex-col my-4 space-y-2.5">
                    <p style={{textAlign: "right", fontSize: "smaller"}}>
                        {contributionAmountETH} ETH | <em>(1 eth = 10^18 wei)</em>
                    </p>
                    <input
                        type="number"
                        value={contributionAmount}
                        onChange={(e) => setContributionAmount(e.target.value)}
                        placeholder="Enter contribution amount"
                        className="p-2 bg-gray-300 rounded-lg text-black placeholder:text-gray-600 focus:outline-none focus:border-violet-600 border-2 border-transparent"
                        type="text"
                    />

                    <button onClick={handleContribution}
                            className="w-auto bg-violet-600 rounded-lg p-2 hover:bg-violet-600/50">
                        Contribute <span>&#x1F4B8;</span>
                    </button>
                </div>
                <div className="bg-gray-400 h-[1px]"></div>
                <div className="flex flex-col my-4 space-y-2.5">
                    <h4 className="font-bold text-xl">Create release fund request:</h4>
                    <p style={{fontSize: "smaller"}}>
                        Campaign manager can propose donation.
                    </p>
                    <div>
                        <p style={{textAlign: "right", fontSize: "smaller"}}>
                            {requestAmountETH} ETH | <em>(1 eth = 10^18 wei)</em>
                        </p></div>
                    <div className="flex flex-col space-y-2.5">
                        <input
                            type="text"
                            value={requestDescription}
                            onChange={(e) => setRequestDescription(e.target.value)}
                            placeholder="request description"
                            className="p-2 bg-gray-300 rounded-lg text-black placeholder:text-gray-600 focus:outline-none focus:border-violet-600 border-2 border-transparent"
                            type="text"
                        />
                        <input
                            type="number"
                            value={requestAmount}
                            onChange={(e) => setRequestAmount(e.target.value)}
                            placeholder="request amount"
                            className="p-2 bg-gray-300 rounded-lg text-black placeholder:text-gray-600 focus:outline-none focus:border-violet-600 border-2 border-transparent"
                            type="text"
                        />
                        <input
                            type="text"
                            value={requestRecipient}
                            onChange={(e) => setRequestRecipient(e.target.value)}
                            placeholder="recipient address"
                            className="p-2 bg-gray-300 rounded-lg text-black placeholder:text-gray-600 focus:outline-none focus:border-violet-600 border-2 border-transparent"
                            type="text"
                        />
                    </div>
                    {/* Button to create request */}
                    <button onClick={createRequest}
                            className="bg-violet-600 rounded-lg p-2 w-auto hover:bg-violet-600/50">
                        Create Request <span>&#x1F4DD;</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
export default CampaignInteraction;

