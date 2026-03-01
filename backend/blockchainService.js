require("dotenv").config();
const { ethers } = require("ethers");

const contractAddress = process.env.CONTRACT_ADDRESS;
const rpcUrl = process.env.RPC_URL;
const privateKey = process.env.PRIVATE_KEY;

const abi = [
  "function issueCertificate(string,string,string,string) public",
  "function verifyCertificate(string) public view returns (tuple(string certificateId,string studentName,string courseName,string institutionName,uint256 issueDate))"
];

const provider = new ethers.JsonRpcProvider(rpcUrl);
const wallet = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(contractAddress, abi, wallet);

async function issueCertificate(id, student, course, institution) {
  const tx = await contract.issueCertificate(id, student, course, institution);
  await tx.wait();
  return "Certificate Issued";
}

async function verifyCertificate(id) {
  return await contract.verifyCertificate(id);
}

module.exports = {
  issueCertificate,
  verifyCertificate,
};