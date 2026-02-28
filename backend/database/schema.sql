-- DATABASE: certificate_db


-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    wallet_address VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    email VARCHAR(255),
    role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'issuer', 'verifier')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INSTITUTIONS TABLE
CREATE TABLE IF NOT EXISTS institutions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    wallet_address VARCHAR(255) UNIQUE NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CERTIFICATES TABLE
CREATE TABLE IF NOT EXISTS certificates (
    id SERIAL PRIMARY KEY,
    certificate_uid VARCHAR(255) UNIQUE NOT NULL,
    student_id INTEGER NOT NULL,
    issuer_id INTEGER NOT NULL,
    certificate_hash TEXT NOT NULL,
    blockchain_tx_hash TEXT,
    contract_address TEXT,
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'issued',

    CONSTRAINT fk_student
        FOREIGN KEY(student_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_issuer
        FOREIGN KEY(issuer_id)
        REFERENCES institutions(id)
        ON DELETE CASCADE
);

-- VERIFICATION LOGS TABLE
CREATE TABLE IF NOT EXISTS verification_logs (
    id SERIAL PRIMARY KEY,
    certificate_id INTEGER NOT NULL,
    verifier_wallet VARCHAR(255),
    verification_status BOOLEAN,
    verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_certificate
        FOREIGN KEY(certificate_id)
        REFERENCES certificates(id)
        ON DELETE CASCADE
);


-- INDEXES (Performance)

CREATE INDEX IF NOT EXISTS idx_users_wallet
ON users(wallet_address);

CREATE INDEX IF NOT EXISTS idx_certificates_uid
ON certificates(certificate_uid);

CREATE INDEX IF NOT EXISTS idx_certificates_hash
ON certificates(certificate_hash);