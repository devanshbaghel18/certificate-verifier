require("dotenv").config(); // Loads variables from .env, Makes them availabel using process.env
const { ethers } = require("ethers"); // These imports Ethers.js(Ethereum interaction library)

// Read configuration from .env
const contractAddress = process.env.CONTRACT_ADDRESS; // Tells where the smart contract is deployed
const rpcUrl = process.env.RPC_URL; // Tells which blockchain network to connect
const privateKey = process.env.PRIVATE_KEY; // Tells which wallet signs transaction

// Define ABI(Application Binary Interface)- 
// It tells ethers: what function exist, what parameters they accept, what they return
// If backend there is no ABI, backend cannot talk to smart contract
const abi = [
  "function issueCertificate(string,string,string,string) public",
  "function verifyCertificate(string) public view returns (tuple(string certificateId,string studentName,string courseName,string institutionName,uint256 issueDate))"
];

// Connects backend to ethereum node. rpcUrl= local hardhat or Alchemy RPC
const provider = new ethers.JsonRpcProvider(rpcUrl); 

// Loads wallet using primary key, and connects it to network
const wallet = new ethers.Wallet(privateKey, provider);

// Creates contract using- contract address, ABI, wallet
const contract = new ethers.Contract(contractAddress, abi, wallet);

// Issue Certificate function
async function issueCertificate(id, student, course, institution) {
  const tx = await contract.issueCertificate(id, student, course, institution); // creates blockchain transaction, wallet signs it, sends it to network.
  await tx.wait(); // waits for blockchain confirmation. Ensures transaction is mined
  return "Certificate Issued";
}

// Verify certificate function
async function verifyCertificate(id) {
  return await contract.verifyCertificate(id); // Calls smart contract and reads data from blockchain
}

// Makes function available in server.js
module.exports = {
  issueCertificate,
  verifyCertificate,
};