const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const CertificateRegistry = await hre.ethers.getContractFactory("CertificateRegistry");
  const contract = await CertificateRegistry.deploy();

  await contract.waitForDeployment();

  const address = await contract.getAddress();

  console.log("Contract deployed to:", address);

  // Update .env file automatically
  const envPath = "../backend/.env";
  let envContent = fs.readFileSync(envPath, "utf8");

  envContent = envContent.replace(
    /CONTRACT_ADDRESS=.*/,
    `CONTRACT_ADDRESS=${address}`
  );

  fs.writeFileSync(envPath, envContent);

  console.log("Updated .env with new contract address");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});