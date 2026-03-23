require("dotenv").config(); // Loads variables from .env, Makes them availabel using process.env
const { ethers } = require("ethers"); // These imports Ethers.js(Ethereum interaction library)

// ADDED
const logger = require("../utils/logger");

// Read configuration from .env
const contractAddress = process.env.CONTRACT_ADDRESS; // Tells where the smart contract is deployed
const rpcUrl = process.env.RPC_URL; // Tells which blockchain network to connect
const privateKey = process.env.PRIVATE_KEY; // Tells which wallet signs transaction

// ADDED (safety check)
if (!contractAddress || !rpcUrl || !privateKey) {
  logger.error("Missing environment variables", {
    contractAddress,
    rpcUrl,
    privateKeyExists: !!privateKey,
  });
}

// Define ABI(Application Binary Interface)- 
// It tells ethers: what function exist, what parameters they accept, what they return
// If backend there is no ABI, backend cannot talk to smart contract
const abi = [
  "function issueCertificate(string,string,string,string) public",
  "function verifyCertificate(string) public view returns (tuple(string certificateId,string studentName,string courseName,string institutionName,uint256 issueDate))"
];

// Connects backend to ethereum node. rpcUrl= local hardhat or Alchemy RPC
const provider = new ethers.JsonRpcProvider(rpcUrl); 

// ADDED
logger.info("Blockchain provider initialized", { rpcUrl });

// Loads wallet using primary key, and connects it to network
const wallet = new ethers.Wallet(privateKey, provider);

// ADDED
logger.info("Wallet connected");

// Creates contract using- contract address, ABI, wallet
const contract = new ethers.Contract(contractAddress, abi, wallet);

// ADDED
logger.info("Smart contract connected", { contractAddress });

// Issue Certificate function
async function issueCertificate(id, student, course, institution) {

  // ADDED
  logger.info("Blockchain TX started", { id, student });

  const tx = await contract.issueCertificate(id, student, course, institution); // creates blockchain transaction, wallet signs it, sends it to network.

  // ADDED
  logger.info("Transaction sent", { hash: tx.hash });

  await tx.wait(); // waits for blockchain confirmation. Ensures transaction is mined

  // ADDED
  logger.info("Transaction confirmed", { hash: tx.hash });

  return "Certificate Issued";
}

// Verify certificate function
async function verifyCertificate(id) {

  // ADDED
  logger.info("Blockchain verification started", { id });

  const result = await contract.verifyCertificate(id); // Calls smart contract and reads data from blockchain

  // ADDED
  logger.info("Blockchain verification success", { id });

  return result;
}

// Makes function available in server.js
module.exports = {
  issueCertificate,
  verifyCertificate,
};