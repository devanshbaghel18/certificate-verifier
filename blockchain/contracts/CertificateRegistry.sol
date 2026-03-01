// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CertificateRegistry {

    struct Certificate {
        string certificateId;
        string studentName;
        string courseName;
        string institutionName;
        uint256 issueDate;
    }

    mapping(string => Certificate) private certificates;

    event CertificateIssued(
        string certificateId,
        string studentName,
        string courseName,
        string institutionName
    );

    function issueCertificate(
        string memory _certificateId,
        string memory _studentName,
        string memory _courseName,
        string memory _institutionName
    ) public {

        certificates[_certificateId] = Certificate(
            _certificateId,
            _studentName,
            _courseName,
            _institutionName,
            block.timestamp
        );

        emit CertificateIssued(
            _certificateId,
            _studentName,
            _courseName,
            _institutionName
        );
    }

    function verifyCertificate(string memory _certificateId)
        public
        view
        returns (Certificate memory)
    {
        return certificates[_certificateId];
    }
}