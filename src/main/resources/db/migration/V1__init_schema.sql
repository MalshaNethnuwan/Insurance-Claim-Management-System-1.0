-- V1__init_schema.sql
-- Relational Schema for Online Insurance Claim Management System

-- Drop tables if they already exist (clean setup)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS settlements CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS claim_status_history CASCADE;
DROP TABLE IF EXISTS claim_documents CASCADE;
DROP TABLE IF EXISTS claims CASCADE;
DROP TABLE IF EXISTS officer_category_assignments CASCADE;
DROP TABLE IF EXISTS insurance_policies CASCADE;
DROP TABLE IF EXISTS insurance_categories CASCADE;
DROP TABLE IF EXISTS insurance_officers CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Users Table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(30),
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'OFFICER', 'CUSTOMER')),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    must_change_password BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_user_id ON users(user_id);
CREATE INDEX idx_users_role ON users(role);

-- 2. Customers Table
CREATE TABLE customers (
    id BIGSERIAL PRIMARY KEY,
    user_id_ref BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    customer_code VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    nic_number VARCHAR(30) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL,
    phone_number VARCHAR(30) NOT NULL,
    address TEXT NOT NULL,
    date_of_birth DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customers_nic ON customers(nic_number);
CREATE INDEX idx_customers_code ON customers(customer_code);

-- 3. Insurance Officers Table
CREATE TABLE insurance_officers (
    id BIGSERIAL PRIMARY KEY,
    user_id_ref BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    employee_id VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone_number VARCHAR(30) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_officers_emp_id ON insurance_officers(employee_id);

-- 4. Insurance Categories Table
CREATE TABLE insurance_categories (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name_en VARCHAR(100) NOT NULL,
    name_si VARCHAR(100) NOT NULL,
    description_en TEXT,
    description_si TEXT,
    required_documents TEXT, -- JSON array string or comma separated
    claim_types TEXT,        -- JSON array string or comma separated
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Officer Category Assignments Table (Many-to-Many)
CREATE TABLE officer_category_assignments (
    id BIGSERIAL PRIMARY KEY,
    officer_id BIGINT NOT NULL REFERENCES insurance_officers(id) ON DELETE CASCADE,
    category_id BIGINT NOT NULL REFERENCES insurance_categories(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_officer_category UNIQUE (officer_id, category_id)
);

CREATE INDEX idx_officer_cat_officer ON officer_category_assignments(officer_id);
CREATE INDEX idx_officer_cat_category ON officer_category_assignments(category_id);

-- 6. Insurance Policies Table
CREATE TABLE insurance_policies (
    id BIGSERIAL PRIMARY KEY,
    policy_number VARCHAR(50) NOT NULL UNIQUE,
    policy_name_en VARCHAR(150) NOT NULL,
    policy_name_si VARCHAR(150) NOT NULL,
    category_id BIGINT NOT NULL REFERENCES insurance_categories(id),
    customer_id BIGINT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    coverage_amount NUMERIC(14, 2) NOT NULL,
    premium_amount NUMERIC(14, 2),
    start_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'EXPIRED', 'CANCELLED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_policies_cust ON insurance_policies(customer_id);
CREATE INDEX idx_policies_cat ON insurance_policies(category_id);
CREATE INDEX idx_policies_status ON insurance_policies(status);

-- 7. Claims Table
CREATE TABLE claims (
    id BIGSERIAL PRIMARY KEY,
    claim_reference VARCHAR(50) NOT NULL UNIQUE,
    policy_id BIGINT NOT NULL REFERENCES insurance_policies(id),
    customer_id BIGINT NOT NULL REFERENCES customers(id),
    category_id BIGINT NOT NULL REFERENCES insurance_categories(id),
    assigned_officer_id BIGINT REFERENCES insurance_officers(id) ON DELETE SET NULL,
    claim_type VARCHAR(100) NOT NULL,
    incident_date DATE NOT NULL,
    incident_location VARCHAR(200),
    description TEXT NOT NULL,
    requested_amount NUMERIC(14, 2) NOT NULL,
    approved_amount NUMERIC(14, 2),
    status VARCHAR(30) NOT NULL DEFAULT 'SUBMITTED' CHECK (
        status IN (
            'SUBMITTED',
            'UNDER_REVIEW',
            'DOCUMENTS_REQUIRED',
            'RESUBMITTED',
            'APPROVED',
            'REJECTED',
            'SETTLEMENT_PENDING',
            'SETTLED',
            'CLOSED'
        )
    ),
    rejection_reason TEXT,
    officer_notes TEXT,
    document_request_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_claims_ref ON claims(claim_reference);
CREATE INDEX idx_claims_customer ON claims(customer_id);
CREATE INDEX idx_claims_category ON claims(category_id);
CREATE INDEX idx_claims_officer ON claims(assigned_officer_id);
CREATE INDEX idx_claims_status ON claims(status);

-- 8. Claim Documents Table
CREATE TABLE claim_documents (
    id BIGSERIAL PRIMARY KEY,
    claim_id BIGINT NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
    document_name VARCHAR(255) NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    is_additional_request BOOLEAN NOT NULL DEFAULT FALSE,
    uploaded_by_user_id BIGINT NOT NULL REFERENCES users(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_claim_docs_claim ON claim_documents(claim_id);

-- 9. Claim Status History Table
CREATE TABLE claim_status_history (
    id BIGSERIAL PRIMARY KEY,
    claim_id BIGINT NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
    previous_status VARCHAR(30),
    new_status VARCHAR(30) NOT NULL,
    updated_by_user_id BIGINT NOT NULL REFERENCES users(id),
    updated_by_name VARCHAR(150),
    reason_or_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_claim_hist_claim ON claim_status_history(claim_id);

-- 10. Settlements Table
CREATE TABLE settlements (
    id BIGSERIAL PRIMARY KEY,
    claim_id BIGINT NOT NULL UNIQUE REFERENCES claims(id) ON DELETE CASCADE,
    settlement_amount NUMERIC(14, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- e.g. BANK_TRANSFER, CHEQUE
    payment_reference VARCHAR(100),
    settlement_notes TEXT,
    settled_by_user_id BIGINT NOT NULL REFERENCES users(id),
    settlement_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Notifications Table
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title_en VARCHAR(200) NOT NULL,
    title_si VARCHAR(200) NOT NULL,
    message_en TEXT NOT NULL,
    message_si TEXT NOT NULL,
    claim_id BIGINT REFERENCES claims(id) ON DELETE SET NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);

-- 12. Audit Logs Table
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id_val VARCHAR(50),
    action VARCHAR(100) NOT NULL,
    entity_name VARCHAR(100),
    entity_id VARCHAR(100),
    details TEXT,
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_created ON audit_logs(created_at);
