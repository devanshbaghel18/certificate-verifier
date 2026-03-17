// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20; // Contract version including this and above can be used

//Creates a contract certifiacte registry, gets a unique address after deployment
contract CertificateRegistry {

    struct Certificate { // Struct is a custom data type
        string certificateId;
        string studentName;
        string courseName;
        string institutionName;
        uint256 issueDate; // unsigned integer with 256 bits 
    }

    mapping(string => Certificate) private certificates; // private: Cannot be directly accessed from outside, only through contract functions

    // Events are blockchain logs stored in transaction logs which record activity and can be tracked off-chain
    event CertificateIssued( 
        string certificateId,
        string studentName,
        string courseName,
        string institutionName
    );
    // Takes certificate details, stores them in mapping, emits event
    function issueCertificate(
        string memory _certificateId,
        string memory _studentName,
        string memory _courseName,
        string memory _institutionName
    ) public {

    // Store data
    // And new struct is created
    // Then store inside mapping
        certificates[_certificateId] = Certificate(
            _certificateId, // The key
            _studentName,
            _courseName,
            _institutionName,
            block.timestamp // Stores issue time (current blockchain time in seconds since 1970)
        );

        // Emit event- logs the issuance
        emit CertificateIssued(
            _certificateId,
            _studentName,
            _courseName,
            _institutionName
        );
    }

    // currently PUBLIC, can restrict it using "onlyOwner"
    // Takes certificate ID, looks up mapping, returns certificate data
    // View leads to - No change in Blockchain state, cannot create transactions, no Gas Cost
    function verifyCertificate(string memory _certificateId)
        public 
        view
        returns (Certificate memory)
    {
        return certificates[_certificateId];
    }
}