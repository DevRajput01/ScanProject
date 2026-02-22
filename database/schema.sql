-- Run this in NeonDB SQL Editor once
-- ScanMyQr: User profiles table for QR-based business cards

CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    phone VARCHAR(50),
    whatsapp VARCHAR(50),
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
