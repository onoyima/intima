-- INTIMA∞ COMPLETE DATABASE SCHEMA (MySQL)
-- Version: 1.0.0
-- Generated for local development with serial features enabled

CREATE DATABASE IF NOT EXISTS intima_db;
USE intima_db;

-- 1. User Management
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    profile_image_url VARCHAR(500),
    is_age_verified BOOLEAN DEFAULT FALSE,
    role VARCHAR(20) DEFAULT 'user', -- user, admin, moderator, finance
    credits INT DEFAULT 0,
    invite_code VARCHAR(10) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Sessions (Express Session storage)
CREATE TABLE sessions (
    sid VARCHAR(128) PRIMARY KEY,
    sess JSON NOT NULL,
    expire TIMESTAMP NOT NULL,
    INDEX IDX_session_expire (expire)
);

-- 3. Public Profiles
CREATE TABLE profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    bio TEXT,
    gender VARCHAR(50),
    orientation VARCHAR(100),
    interests JSON, -- Array of strings
    relationship_goals VARCHAR(100),
    is_public BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Relationship (Couple Mode)
CREATE TABLE couples (
    id INT AUTO_INCREMENT PRIMARY KEY,
    partner1_id VARCHAR(36) NOT NULL,
    partner2_id VARCHAR(36) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending, active, separated
    mode VARCHAR(20) DEFAULT 'romantic', -- romantic, playful, erotic, healing
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (partner1_id) REFERENCES users(id),
    FOREIGN KEY (partner2_id) REFERENCES users(id)
);

-- 5. Encrypted Vault Messaging
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    couple_id INT NOT NULL,
    sender_id VARCHAR(36) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'text', -- text, image, nudge, consent_request
    is_explicit BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (couple_id) REFERENCES couples(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id)
);

-- 6. Social Layer (Likes/Matching)
CREATE TABLE likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    from_user_id VARCHAR(36) NOT NULL,
    to_user_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (to_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 7. Reproductive Health Tracker
CREATE TABLE cycle_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NULL,
    symptoms JSON, -- Array of symptoms
    flow_intensity VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 8. Gifting Economy
CREATE TABLE gifts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id VARCHAR(36) NOT NULL,
    receiver_id VARCHAR(36) NOT NULL,
    gift_type VARCHAR(50) NOT NULL, -- rose, diamond, heart
    credit_value INT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- sent, received
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id)
);

-- 9. User Preferences & Sex Styles
CREATE TABLE user_preferences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    sex_style VARCHAR(50), -- romantic, adventurous, etc.
    boundaries JSON,
    fantasies JSON,
    intensity_preference INT DEFAULT 1,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 10. Games Engine
CREATE TABLE game_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    couple_id INT NOT NULL,
    game_type VARCHAR(50) NOT NULL, -- truth_dare, fantasy_builder
    current_step INT DEFAULT 1,
    game_state JSON,
    intensity VARCHAR(20) DEFAULT 'playful',
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (couple_id) REFERENCES couples(id) ON DELETE CASCADE
);

-- 11. Digital Wallet & Transactions
CREATE TABLE wallet_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    type VARCHAR(30) NOT NULL, -- deposit, withdrawal, gift_send, gift_receive
    status VARCHAR(20) DEFAULT 'completed',
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 12. Payouts / Financial Oversight
CREATE TABLE withdrawal_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- PayPal, Bank, Crypto
    payment_details JSON NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
    processed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 13. Privacy & Security Audits
CREATE TABLE security_audits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    event_type VARCHAR(50) NOT NULL, -- login, age_verify, pairing, screen_capture_detected
    severity VARCHAR(20) DEFAULT 'low',
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 14. Consent Management
CREATE TABLE consent_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    couple_id INT NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    consent_target VARCHAR(100) NOT NULL, -- media_access, explicit_chat, physical_date
    is_granted BOOLEAN DEFAULT FALSE,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (couple_id) REFERENCES couples(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- SEED DATA: Default Admin (Optional but helpful for testing)
-- INSERT INTO users (id, email, first_name, last_name, role, credits, is_age_verified, invite_code) 
-- VALUES ('admin-uuid-1234', 'admin@intima.io', 'Main', 'Admin', 'admin', 5000, true, 'ADMINTIMA');
