-- ========================================
-- Incident Reporting Portal Database Schema
-- ========================================

-- Enable UUID extension for primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- 1. Users Table
-- ========================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK (role IN ('user', 'admin')) DEFAULT 'user',
    is_verified BOOLEAN DEFAULT false,
    otp_code TEXT,
    registration_code TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 2. Incidents Table
-- ========================================
CREATE TABLE incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    contact TEXT,
    status TEXT CHECK (status IN ('pending', 'resolved', 'rejected')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 3. Indexes for Performance
-- ========================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_incidents_user_id ON incidents(user_id);
CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_incidents_created_at ON incidents(created_at);

-- ========================================
-- 4. Triggers for Auto-updating Timestamps
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_incidents_updated_at 
    BEFORE UPDATE ON incidents 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 5. Insert Default System Admin
-- ========================================
INSERT INTO users (full_name, email, password, role, is_verified) 
VALUES (
  'System Admin', 
  'admin@incident.com', 
  '$2b$10$Y.2XH5ikMvv3osuMx7Amgebfx9/OuSc.NisSHrh.l5icIsdWLOEm.', 
  'admin', 
  true
) ON CONFLICT (email) DO NOTHING;

-- ========================================
-- 6. Clean Up Existing Data
-- ========================================
TRUNCATE TABLE incidents RESTART IDENTITY CASCADE;

-- ========================================
-- 7. Grant Permissions (Optional - adjust as needed)
-- ========================================
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_app_user;
