"use client";
import dotenv from "dotenv";
dotenv.config();
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import campaignCreatorArtifact from "../../../hardhat/artifacts/contracts/ProjectCreator.sol/CampaignCreator.json";
import CampaignInteraction from "@/app/components/CampaignInteraction";
import Chari from "../../public/Chari.png";
import Image from "next/image";
import Toast, { ToastContent, ToastIconType } from "@/app/components/Toast";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export default function Home() {
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [campaignCount, setCampaignCount] = useState(0);
    const [deployedCampaigns, setDeployedCampaigns] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [userAddress, setUserAddress] = useState("");
    const [description, setDescription] = useState("");
    const [minContribution, setMinContribution] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [content, setContent] = useState(0);
    const [iconType, setIconType] = useState(ToastIconType.info);

    const connectMetaMask = async () => {};

    const handleConnectButtonClick = async () => {
        if (window.ethereum) {
            const web3Instance = new Web3(window.ethereum);
            try {
                await window.ethereum.request({ method: "eth_requestAccounts" });
                // Initialize your contract
                const contractABI = campaignCreatorArtifact.abi;
                const contractInstance = new web3Instance.eth.Contract(
                    contractABI,
                    contractAddress
                );
                setWeb3(web3Instance);
                setContract(contractInstance);
                setIsConnected(true);
                setContent(ToastContent.allGood);
                setIconType(ToastIconType.success);
                setShowToast(true);
                const accounts = await web3Instance.eth.getAccounts();
                setUserAddress(accounts[0]);
                console.log("Connected to MetaMask!", accounts[0]);
                // Save connection state
                localStorage.setItem("isConnected", "true");
            } catch (error) {
                console.error("User denied account access or an error occurred:", error);
            }
        } else {
            console.log("MetaMask not found. Please install MetaMask to connect.");
        }
    };

    useEffect(() => {
        const initializeWeb3 = async () => {
            if (localStorage.getItem("isConnected") === "true") {
                try {
                    if (window.ethereum) {
                        const web3Instance = new Web3(window.ethereum);
                        const accounts = await web3Instance.eth.getAccounts();
                        const contractABI = campaignCreatorArtifact.abi;
                        const contractInstance = new web3Instance.eth.Contract(
                            contractABI,
                            contractAddress
                        );
                        setWeb3(web3Instance);
                        setContract(contractInstance);
                        setUserAddress(accounts[0]);
                        setIsConnected(true);
                        getCampaignCount();
                    } else {
                        console.log("MetaMask not found. Please install MetaMask to connect.");
                        setIsConnected(false);
                    }
                } catch (error) {
                    console.error("Error initializing web3:", error);
                }
            }
        };
        initializeWeb3();
    }, []);

    const getCampaignCount = async () => {
        if (!contract) return;
        try {
            const count = await contract.methods.getDeployedCampaigns().call();
            setCampaignCount(count.length);
            console.log("count", campaignCount);
        } catch (error) {
            console.error("Error fetching campaign count:", error);
        }
    };

    useEffect(() => {
        if (contract) {
            getCampaignCount();
            getDeployedCampaigns();
        }
    }, [contract]);

    const createCampaign = async () => {
        if (!contract) return;
        if (!isConnected) {
            connectMetaMask();
            return;
        }
        try {
            const gasPrice = await web3.eth.getGasPrice();
            await contract.methods
                .createCampaign(parseInt(minContribution), description)
                .send({
                    from: userAddress,
                    gasPrice: gasPrice,
                });
            console.log("Campaign created successfully!");
        } catch (error) {
            console.error("Error creating campaign:", error);
        }
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handleMinContributionChange = (event) => {
        setMinContribution(event.target.value);
    };

    const getDeployedCampaigns = async () => {
        if (!contract) return;
        try {
            const deployedCampaigns = await contract.methods
                .getDeployedCampaigns()
                .call();
            console.log("Deployed Campaigns:", deployedCampaigns);
            setDeployedCampaigns(deployedCampaigns);
        } catch (error) {
            console.error("Error fetching deployed campaigns:", error);
        }
    };

    const truncateAddress = (address) => {
        const start = address.substring(0, 7);
        const end = address.substring(address.length - 4, address.length);
        return `${start}...${end}`;
    };

    const handleRefreshButtonClick = () => {
        getDeployedCampaigns();
        window.location.reload(); // Reload the page after fetching deployed campaigns
    };

    const handleDisconnectButtonClick = () => {
        setWeb3(null);
        setContract(null);
        setIsConnected(false);
        setUserAddress("");
        setContent(ToastContent.somethingWentWrong);
        setIconType(ToastIconType.error);
        setShowToast(true);
        localStorage.removeItem("isConnected");
    };

    const minContributionETH = minContribution / 10 ** 18;

    const data = {
        labels: [''],
        datasets: [
            {
                label: 'Campaigns',
                data: [campaignCount],
                backgroundColor: ['#7c3aed'],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        scales: {
            x: {
                barPercentage: 0.1,
                categoryPercentage: 0.5
            },
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1, // ensures the y-axis counts in whole numbers
                }
            }
        }
    };

    return (
        <>
            <Toast show={showToast} setShow={setShowToast} content={content}/>
            <main className="mx-auto max-w-7xl px-6 md:px-12 lg:px-6 xl:px-0">
                {/* Logo */}
                <div className="flex justify-center">
                    <Image
                        src={Chari}
                        alt="chari_logo"
                    />
                </div>
                {/* MetaMask connection button */}
                <div className="flex items-center justify-center my-10">
                    {!isConnected ? (
                        <>
                            <div className="flex flex-col items-center justify-center">
                                <p>Click here to connect your MetaMask wallet</p>
                                <button onClick={handleConnectButtonClick}
                                        className="bg-violet-600 p-2 rounded-lg my-4 hover:bg-violet-600/50">
                                    Connect MetaMask
                                </button>
                            </div>

                        </>
                    ) : (
                        <>
                            <div className="flex flex-col items-center justify-center">
                                <h2 className="text-xl">
                                    Connected to MetaMask!
                                </h2>
                                <p>Account:</p>
                                <p style={{wordBreak: "break-all"}}>
                                    <strong>{userAddress}</strong>
                                </p>
                                <button
                                    className="transition ease-in-out delay-150 bg-violet-600 rounded-lg p-2 my-4 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300"
                                    onClick={handleDisconnectButtonClick}>Disconnect from MetaMask
                                </button>
                            </div>
                        </>
                    )}

                </div>

                {/* Grid for campaign-related actions */}
                {isConnected && (
                    <>
                        <div>
                            {/* Get total campaign count */}
                            <div className="flex flex-col justify-center items-center my-20">
                                <h4 className="text-xl">
                                    Total Campaign Count: <strong>{campaignCount}</strong>{" "}
                                    <span>&#x1F4B0;</span>
                                </h4>
                                <div className="mt-4">
                                    <Bar data={data} options={options}/>
                                </div>
                            </div>
                        </div>
                        <div className="my-10 bg-gray-600 p-4 rounded-lg">
                            <h2 className="text-xl mb-4">Campaign Creation:</h2>
                            <div className="flex flex-col space-y-2.5">
                                <input
                                    className="p-2 bg-gray-300 rounded-lg text-black placeholder:text-gray-600 focus:outline-none focus:border-violet-600 border-2 border-transparent"                                    type="text"
                                    placeholder="Description / title"
                                    value={description}
                                    onChange={handleDescriptionChange}
                                />
                                <input
                                    className="p-2 bg-gray-300 rounded-lg text-black placeholder:text-gray-600 focus:outline-none focus:border-violet-600 border-2 border-transparent"                                    type="text"
                                    type="number"
                                    placeholder="Min Contrib (wei)"
                                    value={minContribution}
                                    onChange={handleMinContributionChange}
                                />
                                <button onClick={createCampaign}
                                        className="bg-violet-600 rounded-lg p-2 hover:bg-violet-600/50">
                                    Create Campaign <span>&#x1F680;</span>
                                </button>
                            </div>
                        </div>
                        <p style={{textAlign: "center", fontSize: "smaller"}}>
                            {minContributionETH} ETH | <em>(1 eth = 10^18 wei)</em>
                        </p>
                    </>
                )}
                {/* Display deployed campaigns */}
                {isConnected && (
                    <div className="grid grid-cols-2 space-x-3.5">
                        {deployedCampaigns.map((campaign, index) => (
                            <div key={index}
                                 className="bg-gray-600 text-white rounded-lg p-8 my-8 hover:bg-gray-800 transition-all duration-300 ease-in-out">
                                <h3 className="text-xl font-bold">
                                    CrowdFund id: {index + 0} <span>&#x1F4C4;</span>
                                </h3>
                                <p>{truncateAddress(campaign)}</p>
                                <div className="bg-gray-400 h-[1px] my-2"></div>
                                {/* Interact with campaign */}
                                <CampaignInteraction contractAddress={campaign} web3={web3}/>
                                <div className="bg-gray-400-600 h-[1px] my-2"></div>
                                <div>
                                    <h5 className="text-xl">Full Contract Instance address:</h5>
                                    <p style={{wordBreak: "break-all"}}>{campaign}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {!isConnected && (
                    <div className="bg-gray-600 p-2 rounded-lg my-10">
                        <h1 className="text-xl text-center">Please connect to MetaMask to see your contracts!</h1>
                    </div>
                )}
            </main>
        </>


    )
}
