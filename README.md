# 🎓 Blockchain-Based Certificate Verification System

A full-stack decentralized application (DApp) that enables secure issuance and instant verification of academic certificates using Ethereum blockchain technology.

This system prevents certificate forgery by storing cryptographic hashes on-chain while keeping sensitive data off-chain.

---

## 🚀 Project Overview

Traditional certificate verification processes are manual, slow, and prone to forgery.  
This project provides a tamper-proof and transparent verification system where:

- Institutions issue certificates securely
- Certificate hashes are stored on blockchain
- Anyone can verify authenticity instantly
- Certificates can be revoked if required

Only the certificate hash is stored on-chain to ensure privacy and efficiency.

---

## ✨ Key Features

- 🔐 Role-based institution authorization  
- 📜 Blockchain-based certificate issuance  
- ✅ Instant certificate verification  
- 🚫 Certificate revocation support  
- 🌐 Public verification portal  
- 🔒 Secure backend API integration  
- 🗄 Off-chain metadata storage (PostgreSQL)

---

## 🏗 Tech Stack

### Frontend
- React (Vite)
- Ethers.js
- Axios

### Backend
- Node.js
- Express.js
- PostgreSQL

### Blockchain
- Solidity (^0.8.x)
- Hardhat
- OpenZeppelin
- Ethereum Sepolia Testnet

---

## 📁 Project Structure
root/ │ 
├── frontend/      # React frontend application 
├── backend/       # Node.js API server 
├── blockchain/    # Smart contract and deployment scripts 
└── README.md

---

## 🔄 How It Works

### 1️⃣ Certificate Issuance
- Institution uploads certificate
- Backend generates a cryptographic hash (SHA/keccak256)
- Authorized issuer stores the hash on Ethereum
- Transaction is recorded on blockchain

### 2️⃣ Certificate Verification
- User uploads the certificate file
- System generates hash
- Smart contract checks if hash exists and is valid
- Verification result is displayed instantly

### 3️⃣ Certificate Revocation
- Institution can revoke issued certificates
- Blockchain status is updated permanently

---

## 🛠 Installation Guide

### Clone Repository
---
### Setup Blockchain
---
### Setup Backend
---
### Setup Frontend

---

## 🌍 Deployment

- Smart Contract → Ethereum Mainnet
- Backend → Railway / Render
- Frontend → Vercel
- Database → Neon / Supabase

---

## 🔐 Security Considerations

- No personal data stored on blockchain
- Private keys stored securely in environment variables
- Role-based access control for issuers
- Tamper-proof verification using cryptographic hashing

---

## 🚀 Future Improvements

- IPFS integration for decentralized storage
- NFT-based certificate issuance
- Batch certificate issuance using Merkle Trees
- Upgradeable smart contracts

---

## 📄 License

MIT License
