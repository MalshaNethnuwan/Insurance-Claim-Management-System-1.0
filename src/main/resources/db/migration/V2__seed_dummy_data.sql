-- V2__seed_dummy_data.sql
-- Seed Data for Online Insurance Claim Management System
-- Password for all seed users is 'Password123!' (BCrypt: $2a$10$1A/.B/pPOpJUraH2QUxCmu.te90bJs0Ez9N8S5CmquunhlHZFcdCa)

-- 1. Insert Administrator
INSERT INTO users (id, user_id, password, email, phone, role, status, must_change_password)
VALUES (1, 'ADM001', '$2a$10$1A/.B/pPOpJUraH2QUxCmu.te90bJs0Ez9N8S5CmquunhlHZFcdCa', 'admin@insurance.lk', '+94 11 234 5670', 'ADMIN', 'ACTIVE', FALSE);

-- 2. Insert 8 Insurance Officers (Users & Profiles)
INSERT INTO users (id, user_id, password, email, phone, role, status, must_change_password) VALUES
(2, 'OFF001', '$2a$10$1A/.B/pPOpJUraH2QUxCmu.te90bJs0Ez9N8S5CmquunhlHZFcdCa', 'sunil.p@insurance.lk', '+94 77 123 4501', 'OFFICER', 'ACTIVE', FALSE),
(3, 'OFF002', '$2a$10$1A/.B/pPOpJUraH2QUxCmu.te90bJs0Ez9N8S5CmquunhlHZFcdCa', 'nimal.j@insurance.lk', '+94 77 123 4502', 'OFFICER', 'ACTIVE', FALSE),
(4, 'OFF003', '$2a$10$1A/.B/pPOpJUraH2QUxCmu.te90bJs0Ez9N8S5CmquunhlHZFcdCa', 'kamal.g@insurance.lk', '+94 77 123 4503', 'OFFICER', 'ACTIVE', FALSE),
(5, 'OFF004', '$2a$10$1A/.B/pPOpJUraH2QUxCmu.te90bJs0Ez9N8S5CmquunhlHZFcdCa', 'priyantha.s@insurance.lk', '+94 77 123 4504', 'OFFICER', 'ACTIVE', FALSE),
(6, 'OFF005', '$2a$10$1A/.B/pPOpJUraH2QUxCmu.te90bJs0Ez9N8S5CmquunhlHZFcdCa', 'anoma.w@insurance.lk', '+94 77 123 4505', 'OFFICER', 'ACTIVE', FALSE),
(7, 'OFF006', '$2a$10$1A/.B/pPOpJUraH2QUxCmu.te90bJs0Ez9N8S5CmquunhlHZFcdCa', 'dilani.s@insurance.lk', '+94 77 123 4506', 'OFFICER', 'ACTIVE', FALSE),
(8, 'OFF007', '$2a$10$1A/.B/pPOpJUraH2QUxCmu.te90bJs0Ez9N8S5CmquunhlHZFcdCa', 'ruwan.f@insurance.lk', '+94 77 123 4507', 'OFFICER', 'ACTIVE', FALSE),
(9, 'OFF008', '$2a$10$1A/.B/pPOpJUraH2QUxCmu.te90bJs0Ez9N8S5CmquunhlHZFcdCa', 'chathura.m@insurance.lk', '+94 77 123 4508', 'OFFICER', 'ACTIVE', FALSE);

INSERT INTO insurance_officers (id, user_id_ref, employee_id, full_name, email, phone_number) VALUES
(1, 2, 'EMP-101', 'Sunil Perera', 'sunil.p@insurance.lk', '+94 77 123 4501'),
(2, 3, 'EMP-102', 'Nimal Jayasuriya', 'nimal.j@insurance.lk', '+94 77 123 4502'),
(3, 4, 'EMP-103', 'Kamal Gunaratne', 'kamal.g@insurance.lk', '+94 77 123 4503'),
(4, 5, 'EMP-104', 'Priyantha Silva', 'priyantha.s@insurance.lk', '+94 77 123 4504'),
(5, 6, 'EMP-105', 'Anoma Wickramasinghe', 'anoma.w@insurance.lk', '+94 77 123 4505'),
(6, 7, 'EMP-106', 'Dilani Senanayake', 'dilani.s@insurance.lk', '+94 77 123 4506'),
(7, 8, 'EMP-107', 'Ruwan Fernando', 'ruwan.f@insurance.lk', '+94 77 123 4507'),
(8, 9, 'EMP-108', 'Chathura Mendis', 'chathura.m@insurance.lk', '+94 77 123 4508');

-- 3. Insert 20 Customers (Users & Customer Profiles)
-- Note: CUS001 has must_change_password=FALSE for instant login; CUS020 has must_change_password=TRUE for testing first-time password flow!
INSERT INTO users (id, user_id, password, email, phone, role, status, must_change_password) VALUES
(10, 'CUS001', '$2a$10$1A/.B/pPOpJUraH2QUxCmu.te90bJs0Ez9N8S5CmquunhlHZFcdCa', 'chaminda.k@gmail.com', '+94 71 555 1001', 'CUSTOMER', 'ACTIVE', FALSE),
(11, 'CUS002', '$2a$10$1A/.B/pPOpJUraH2QUxCmu.te90bJs0Ez9N8S5CmquunhlHZFcdCa', 'nadeesha.f@gmail.com', '+94 71 555 1002', 'CUSTOMER', 'ACTIVE', FALSE),
(12, 'CUS003', '$2a$10$1A/.B/pPOpJUraH2QUxCmu.te90bJs0Ez9N8S5CmquunhlHZFcdCa', 'kasun.d@gmail.com', '+94 71 555 1003', 'CUSTOMER', 'ACTIVE', FALSE),
(13, 'CUS004', '$2a$10$1A/.B/pPOpJUraH2QUxCmu.te90bJs0Ez9N8S5CmquunhlHZFcdCa', 'sanduni.p@gmail.com', '+94 71 555 1004', 'CUSTOMER', 'ACTIVE', FALSE),
(14, 'CUS005', '$2a$10$1A/.B/pPOpJUraH2QUxCmu.te90bJs0Ez9N8S5CmquunhlHZFcdCa', 'roshan.a@gmail.com', '+94 71 555 1005', 'CUSTOMER', 'ACTIVE', FALSE),
(15, 'CUS006', '$2a$10$1A/.B/pPOpJUraH2QUxCmu.te90bJs0Ez9N8S5CmquunhlHZFcdCa', 'ishara.m@gmail.com', '+94 71 555 1006', 'CUSTOMER', 'ACTIVE', FALSE),
(16, 'CUS007', '$2a$10$1A/.B/pPOpJUraH2QUxCmu.te90bJs0Ez9N8S5CmquunhlHZFcdCa', 'mahesh.b@gmail.com', '+94 71 555 1007', 'CUSTOMER', 'ACTIVE', FALSE),
(17, 'CUS008', '$2a$10$1A/.B/pPOpJUraH2QUxCmu.te90bJs0Ez9N8S5CmquunhlHZFcdCa', 'thilini.w@gmail.com', '+94 71 555 1008', 'CUSTOMER', 'ACTIVE', FALSE),
(18, 'CUS009', '$2a$10$1A/.B/pPOpJUraH2QUxCmu.te90bJs0Ez9N8S5CmquunhlHZFcdCa', 'lahiru.s@gmail.com', '+94 71 555 1009', 'CUSTOMER', 'ACTIVE', FALSE),
(19, 'CUS010', '$2a$10$1A/.B/pPOpJUraH2QUxCmu.te90bJs0Ez9N8S5CmquunhlHZFcdCa', 'kavindi.j@gmail.com', '+94 71 555 1010', 'CUSTOMER', 'ACTIVE', FALSE),
(20, 'CUS011', '$2a$10$1A/.B/pPOpJUraH2QUxCmu.te90bJs0Ez9N8S5CmquunhlHZFcdCa', 'damith.k@gmail.com', '+94 71 555 1011', 'CUSTOMER', 'ACTIVE', FALSE),
(21, 'CUS012', '$2a$10$1A/.B/pPOpJUraH2QUxCmu.te90bJs0Ez9N8S5CmquunhlHZFcdCa', 'pawani.t@gmail.com', '+94 71 555 1012', 'CUSTOMER', 'ACTIVE', FALSE),
(22, 'CUS013', '$2a$10$1A/.B/pPOpJUraH2QUxCmu.te90bJs0Ez9N8S5CmquunhlHZFcdCa', 'nuwan.r@gmail.com', '+94 71 555 1013', 'CUSTOMER', 'ACTIVE', FALSE),
(23, 'CUS014', '$2a$10$1A/.B/pPOpJUraH2QUxCmu.te90bJs0Ez9N8S5CmquunhlHZFcdCa', 'chathurika.l@gmail.com', '+94 71 555 1014', 'CUSTOMER', 'ACTIVE', FALSE),
(24, 'CUS015', '$2a$10$1A/.B/pPOpJUraH2QUxCmu.te90bJs0Ez9N8S5CmquunhlHZFcdCa', 'suraj.g@gmail.com', '+94 71 555 1015', 'CUSTOMER', 'ACTIVE', FALSE),
(25, 'CUS016', '$2a$10$1A/.B/pPOpJUraH2QUxCmu.te90bJs0Ez9N8S5CmquunhlHZFcdCa', 'dinithi.p@gmail.com', '+94 71 555 1016', 'CUSTOMER', 'ACTIVE', FALSE),
(26, 'CUS017', '$2a$10$1A/.B/pPOpJUraH2QUxCmu.te90bJs0Ez9N8S5CmquunhlHZFcdCa', 'harsha.e@gmail.com', '+94 71 555 1017', 'CUSTOMER', 'ACTIVE', FALSE),
(27, 'CUS018', '$2a$10$1A/.B/pPOpJUraH2QUxCmu.te90bJs0Ez9N8S5CmquunhlHZFcdCa', 'madushani.h@gmail.com', '+94 71 555 1018', 'CUSTOMER', 'ACTIVE', FALSE),
(28, 'CUS019', '$2a$10$1A/.B/pPOpJUraH2QUxCmu.te90bJs0Ez9N8S5CmquunhlHZFcdCa', 'asanka.v@gmail.com', '+94 71 555 1019', 'CUSTOMER', 'ACTIVE', FALSE),
(29, 'CUS020', '$2a$10$1A/.B/pPOpJUraH2QUxCmu.te90bJs0Ez9N8S5CmquunhlHZFcdCa', 'gayani.c@gmail.com', '+94 71 555 1020', 'CUSTOMER', 'ACTIVE', TRUE);

INSERT INTO customers (id, user_id_ref, customer_code, full_name, nic_number, email, phone_number, address, date_of_birth) VALUES
(1, 10, 'CUST-001', 'Chaminda Karunaratne', '198512345678', 'chaminda.k@gmail.com', '+94 71 555 1001', 'No. 45, Galle Road, Colombo 03', '1985-05-14'),
(2, 11, 'CUST-002', 'Nadeesha Fernando', '199065432109', 'nadeesha.f@gmail.com', '+94 71 555 1002', '12/A, Kandy Road, Kiribathgoda', '1990-08-22'),
(3, 12, 'CUST-003', 'Kasun Dissanayake', '198823456789', 'kasun.d@gmail.com', '+94 71 555 1003', '88, Peradeniya Road, Kandy', '1988-11-03'),
(4, 13, 'CUST-004', 'Sanduni Perera', '199278912345', 'sanduni.p@gmail.com', '+94 71 555 1004', '104, High Level Road, Nugegoda', '1992-02-17'),
(5, 14, 'CUST-005', 'Roshan Alwis', '198234567890', 'roshan.a@gmail.com', '+94 71 555 1005', '35, Havelock Road, Colombo 05', '1982-07-29'),
(6, 15, 'CUST-006', 'Ishara Madushanka', '199412389012', 'ishara.m@gmail.com', '+94 71 555 1006', '67, Main Street, Gampaha', '1994-10-12'),
(7, 16, 'CUST-007', 'Mahesh Bandara', '197945612345', 'mahesh.b@gmail.com', '+94 71 555 1007', '18, Kurunegala Road, Dambulla', '1979-03-05'),
(8, 17, 'CUST-008', 'Thilini Wickramage', '199389012345', 'thilini.w@gmail.com', '+94 71 555 1008', '92, Station Road, Matara', '1993-12-08'),
(9, 18, 'CUST-009', 'Lahiru Samaraweera', '198756789012', 'lahiru.s@gmail.com', '+94 71 555 1009', '44, Negombo Road, Ja-Ela', '1987-04-19'),
(10, 19, 'CUST-010', 'Kavindi Jayawardena', '199623456789', 'kavindi.j@gmail.com', '+94 71 555 1010', '15, Dharmapala Mawatha, Colombo 07', '1996-09-30'),
(11, 20, 'CUST-011', 'Damith Kulatunga', '198434567891', 'damith.k@gmail.com', '+94 71 555 1011', '76, Badulla Road, Bandarawela', '1984-06-25'),
(12, 21, 'CUST-012', 'Pawani Thennakoon', '199145678912', 'pawani.t@gmail.com', '+94 71 555 1012', '55, Circular Road, Kurunegala', '1991-01-14'),
(13, 22, 'CUST-013', 'Nuwan Rathnayake', '198656789123', 'nuwan.r@gmail.com', '+94 71 555 1013', '23, Hospital Road, Kalutara', '1986-08-09'),
(14, 23, 'CUST-014', 'Chathurika Liyanage', '199567891234', 'chathurika.l@gmail.com', '+94 71 555 1014', '89, Beach Road, Mount Lavinia', '1995-11-20'),
(15, 24, 'CUST-015', 'Suraj Gamage', '198378912345', 'suraj.g@gmail.com', '+94 71 555 1015', '12, Temple Road, Ratnapura', '1983-05-18'),
(16, 25, 'CUST-016', 'Dinithi Pathirana', '199789123456', 'dinithi.p@gmail.com', '+94 71 555 1016', '101, Baseline Road, Dematagoda', '1997-07-07'),
(17, 26, 'CUST-017', 'Harsha Edirisinghe', '198190123456', 'harsha.e@gmail.com', '+94 71 555 1017', '34, Wackwella Road, Galle', '1981-09-15'),
(18, 27, 'CUST-018', 'Madushani Hettiarachchi', '199401234567', 'madushani.h@gmail.com', '+94 71 555 1018', '60, New Road, Anuradhapura', '1994-03-27'),
(19, 28, 'CUST-019', 'Asanka Vithanage', '198912345098', 'asanka.v@gmail.com', '+94 71 555 1019', '14, Cross Street, Panadura', '1989-12-11'),
(20, 29, 'CUST-020', 'Gayani Cooray', '199323450987', 'gayani.c@gmail.com', '+94 71 555 1020', '71, Sea Street, Negombo', '1993-04-02');

-- 4. Insert 5 Insurance Categories
INSERT INTO insurance_categories (id, code, name_en, name_si, description_en, description_si, required_documents, claim_types) VALUES
(1, 'VEHICLE', 'Vehicle Insurance', 'වාහන රක්ෂණය', 'Comprehensive protection for cars, motorcycles, and commercial vehicles.', 'මෝටර් රථ, යතුරුපැදි සහ වාණිජ වාහන සඳහා පුළුල් ආරක්ෂාව.', 'Police Report,Driving License,Accident Photos,Repair Estimate,Vehicle Revenue License', 'Accident Damage,Theft,Third Party Liability,Windscreen Damage,Fire Damage'),
(2, 'LIFE', 'Life Insurance', 'ජීවිත රක්ෂණය', 'Financial security and savings for you and your loved ones.', 'ඔබ සහ ඔබගේ ආදරණීයයන් සඳහා මූල්‍ය ආරක්ෂාව සහ ඉතුරුම්.', 'Death Certificate,Medical Records,Identity Card Copy,Policy Document,Claimant Bank Passbook', 'Death Benefit,Critical Illness,Permanent Disability,Maturity Benefit'),
(3, 'HEALTH', 'Health Insurance', 'සෞඛ්‍ය රක්ෂණය', 'Coverage for hospitalization, medical treatments, and emergencies.', 'රෝහල්ගතවීම්, වෛද්‍ය ප්‍රතිකාර සහ හදිසි ප්‍රතිකාර සඳහා ආවරණය.', 'Hospital Bill,Diagnosis Card,Doctor Prescription,Pharmacy Receipts,Discharge Summary', 'Hospitalization Reimbursement,Surgical Expenses,Outpatient Consultation,Maternity Care'),
(4, 'PROPERTY', 'Property Insurance', 'දේපළ රක්ෂණය', 'Protection for your home, buildings, and commercial property against fire and disasters.', 'ගිනි ගැනීම් සහ ස්වභාවික ආපදා හමුවේ ඔබගේ නිවස සහ ව්‍යාපාරික දේපළ ආරක්ෂා කිරීම.', 'Damage Photos,Police/Grama Niladhari Report,Valuation/Repair Estimate,Title Deed Copy,Fire Service Report', 'Fire and Lightning,Natural Disaster Flood/Storm,Burglary and Theft,Pipe Burst Water Damage'),
(5, 'TRAVEL', 'Travel Insurance', 'සංචාරක රක්ෂණය', 'Peace of mind for domestic and international travel emergencies.', 'දේශීය හා විදේශීය සංචාරක හදිසි අවස්ථාවන් සඳහා සැනසිලිදායක ආවරණය.', 'Passport with Visa Stamp,Boarding Pass,Medical Report Overseas,Lost Baggage PIR Report,Ticket Receipt', 'Overseas Medical Emergency,Baggage Loss/Delay,Trip Cancellation,Flight Delay,Loss of Passport');

-- 5. Assign Officers to Categories (Many-to-Many)
-- OFF001, OFF002 -> Vehicle
-- OFF003, OFF004 -> Life
-- OFF005, OFF006 -> Health
-- OFF007 -> Property
-- OFF008 -> Travel
-- In addition, let Ruwan (Property) also help with Travel, Sunil (Vehicle) with Property
INSERT INTO officer_category_assignments (officer_id, category_id) VALUES
(1, 1), -- Sunil -> Vehicle
(2, 1), -- Nimal -> Vehicle
(3, 2), -- Kamal -> Life
(4, 2), -- Priyantha -> Life
(5, 3), -- Anoma -> Health
(6, 3), -- Dilani -> Health
(7, 4), -- Ruwan -> Property
(8, 5), -- Chathura -> Travel
(7, 5), -- Ruwan -> also Travel
(1, 4); -- Sunil -> also Property

-- 6. Insert Insurance Policies (Assigned to Customers)
INSERT INTO insurance_policies (id, policy_number, policy_name_en, policy_name_si, category_id, customer_id, coverage_amount, premium_amount, start_date, expiry_date, status) VALUES
(1, 'POL-VEH-1001', 'DriveSafe Comprehensive Motor', 'ඩ්‍රයිව්සේෆ් පූර්ණ මෝටර් රථ ආවරණය', 1, 1, 6500000.00, 75000.00, '2026-01-01', '2027-01-01', 'ACTIVE'),
(2, 'POL-LIF-2001', 'LifeCare Endowment Plan', 'ලයිෆ්කෙයාර් ජීවිත සැලසුම', 2, 1, 5000000.00, 48000.00, '2025-06-01', '2045-06-01', 'ACTIVE'),
(3, 'POL-HLT-3001', 'HealthGuard Silver Family', 'හෙල්ත්ගාඩ් රිදී පවුලේ සැලසුම', 3, 2, 1500000.00, 36000.00, '2026-02-15', '2027-02-15', 'ACTIVE'),
(4, 'POL-PRP-4001', 'HomeSecure Residential Cover', 'හෝම්සිකියර් නිවාස ආරක්ෂණ ආවරණය', 4, 3, 12000000.00, 45000.00, '2025-09-01', '2027-09-01', 'ACTIVE'),
(5, 'POL-VEH-1002', 'EcoRider Motorcycle Cover', 'ඉකෝරයිඩර් යතුරුපැදි ආවරණය', 1, 3, 450000.00, 12000.00, '2026-03-01', '2027-03-01', 'ACTIVE'),
(6, 'POL-TRV-5001', 'GlobeTrotter International Travel', 'ග්ලෝබ්ට්‍රොටර් ජාත්‍යන්තර සංචාරක', 5, 4, 8000000.00, 18000.00, '2026-05-10', '2026-12-31', 'ACTIVE'),
(7, 'POL-VEH-1003', 'AutoShield Commercial Van', 'ඔටෝශීල්ඩ් වාණිජ වෑන් ආවරණය', 1, 5, 4800000.00, 62000.00, '2026-01-15', '2027-01-15', 'ACTIVE'),
(8, 'POL-HLT-3002', 'MediPro Executive Health', 'මෙඩිප්‍රෝ විධායක සෞඛ්‍ය සැලසුම', 3, 5, 3000000.00, 55000.00, '2025-11-01', '2026-11-01', 'ACTIVE'),
(9, 'POL-PRP-4002', 'BusinessProtect Commercial Property', 'බිස්නස්ප්‍රොටෙක්ට් ව්‍යාපාරික දේපළ', 4, 6, 25000000.00, 110000.00, '2025-07-01', '2027-07-01', 'ACTIVE'),
(10, 'POL-LIF-2002', 'FutureBright Child Education', 'ෆියුචර්බ්‍රයිට් දරු අධ්‍යාපන සැලසුම', 2, 7, 4000000.00, 42000.00, '2025-01-01', '2040-01-01', 'ACTIVE'),
(11, 'POL-VEH-1004', 'DriveSafe Comprehensive Motor', 'ඩ්‍රයිව්සේෆ් පූර්ණ මෝටර් රථ ආවරණය', 1, 8, 5500000.00, 68000.00, '2026-04-01', '2027-04-01', 'ACTIVE'),
(12, 'POL-HLT-3003', 'MediCare Senior Citizen Plan', 'මෙඩිකෙයාර් ජ්‍යෙෂ්ඨ පුරවැසි සැලසුම', 3, 9, 2000000.00, 48000.00, '2026-03-10', '2027-03-10', 'ACTIVE'),
(13, 'POL-TRV-5002', 'AsiaPass Regional Travel Cover', 'ඒෂියාපාස් කලාපීය සංචාරක ආවරණය', 5, 10, 5000000.00, 14000.00, '2026-06-01', '2026-12-31', 'ACTIVE'),
(14, 'POL-PRP-4003', 'HomeSecure Residential Cover', 'හෝම්සිකියර් නිවාස ආරක්ෂණ ආවරණය', 4, 11, 15000000.00, 52000.00, '2025-10-01', '2027-10-01', 'ACTIVE'),
(15, 'POL-VEH-1005', 'DriveSafe Comprehensive Motor', 'ඩ්‍රයිව්සේෆ් පූර්ණ මෝටර් රථ ආවරණය', 1, 12, 7200000.00, 82000.00, '2026-01-20', '2027-01-20', 'ACTIVE'),
(16, 'POL-LIF-2003', 'PureTerm Protection 30', 'පියෝටර්ම් ජීවිත ආරක්ෂණ සැලසුම', 2, 13, 10000000.00, 35000.00, '2025-08-01', '2055-08-01', 'ACTIVE'),
(17, 'POL-HLT-3004', 'HealthGuard Gold Family', 'හෙල්ත්ගාඩ් රන් පවුලේ සැලසුම', 3, 14, 2500000.00, 50000.00, '2026-02-01', '2027-02-01', 'ACTIVE'),
(18, 'POL-VEH-1006', 'DriveSafe Comprehensive Motor', 'ඩ්‍රයිව්සේෆ් පූර්ණ මෝටර් රථ ආවරණය', 1, 15, 3800000.00, 46000.00, '2026-05-01', '2027-05-01', 'ACTIVE'),
(19, 'POL-PRP-4004', 'ApartmentProtect Strata Cover', 'ඇපාර්ට්මන්ට්ප්‍රොටෙක්ට් මහල් නිවාස', 4, 16, 18000000.00, 60000.00, '2025-12-01', '2027-12-01', 'ACTIVE'),
(20, 'POL-TRV-5003', 'GlobeTrotter International Travel', 'ග්ලෝබ්ට්‍රොටර් ජාත්‍යන්තර සංචාරක', 5, 17, 8000000.00, 20000.00, '2026-07-01', '2027-01-01', 'ACTIVE'),
(21, 'POL-VEH-1007', 'DriveSafe Comprehensive Motor', 'ඩ්‍රයිව්සේෆ් පූර්ණ මෝටර් රථ ආවරණය', 1, 18, 9000000.00, 95000.00, '2026-03-15', '2027-03-15', 'ACTIVE'),
(22, 'POL-HLT-3005', 'MediPro Individual Health', 'මෙඩිප්‍රෝ තනි පුද්ගල සෞඛ්‍ය සැලසුම', 3, 19, 1800000.00, 32000.00, '2026-01-10', '2027-01-10', 'ACTIVE'),
(23, 'POL-LIF-2004', 'LifeCare Endowment Plan', 'ලයිෆ්කෙයාර් ජීවිත සැලසුම', 2, 20, 6000000.00, 52000.00, '2025-05-01', '2045-05-01', 'ACTIVE'),
(24, 'POL-VEH-1008', 'EcoRider Motorcycle Cover', 'ඉකෝරයිඩර් යතුරුපැදි ආවරණය', 1, 1, 380000.00, 11000.00, '2026-04-10', '2027-04-10', 'ACTIVE'),
(25, 'POL-HLT-3006', 'HealthGuard Silver Family', 'හෙල්ත්ගාඩ් රිදී පවුලේ සැලසුම', 3, 1, 1200000.00, 28000.00, '2026-03-01', '2027-03-01', 'ACTIVE');

-- 7. Insert 30 Realistic Claims Spanning All 9 Statuses
-- Statuses: SUBMITTED, UNDER_REVIEW, DOCUMENTS_REQUIRED, RESUBMITTED, APPROVED, REJECTED, SETTLEMENT_PENDING, SETTLED, CLOSED
INSERT INTO claims (id, claim_reference, policy_id, customer_id, category_id, assigned_officer_id, claim_type, incident_date, incident_location, description, requested_amount, approved_amount, status, rejection_reason, officer_notes, document_request_notes, created_at, updated_at) VALUES
-- 1. SUBMITTED
(1, 'CLM-2026-0001', 1, 1, 1, 1, 'Accident Damage', '2026-11-18', 'Kollupitiya Junction, Colombo', 'Front bumper and headlight damaged due to sudden braking of the vehicle in front.', 145000.00, NULL, 'SUBMITTED', NULL, NULL, NULL, '2026-11-19 09:30:00', '2026-11-19 09:30:00'),
(2, 'CLM-2026-0002', 3, 2, 3, 5, 'Hospitalization Reimbursement', '2026-11-15', 'Nawaloka Hospital, Colombo', 'Hospitalization for 3 days due to acute viral infection and hydration treatment.', 85000.00, NULL, 'SUBMITTED', NULL, NULL, NULL, '2026-11-17 11:20:00', '2026-11-17 11:20:00'),
(3, 'CLM-2026-0003', 4, 3, 4, 7, 'Pipe Burst Water Damage', '2026-11-16', 'Peradeniya, Kandy', 'Upper floor master bathroom pipe burst causing damage to ceiling and living room wooden floor.', 220000.00, NULL, 'SUBMITTED', NULL, NULL, NULL, '2026-11-18 14:15:00', '2026-11-18 14:15:00'),
(4, 'CLM-2026-0004', 6, 4, 5, 8, 'Baggage Loss/Delay', '2026-11-12', 'Singapore Changi Airport', 'Checked baggage delayed for 48 hours upon arrival at Singapore on flight UL302.', 48000.00, NULL, 'SUBMITTED', NULL, NULL, NULL, '2026-11-15 16:45:00', '2026-11-15 16:45:00'),

-- 2. UNDER_REVIEW
(5, 'CLM-2026-0005', 7, 5, 1, 1, 'Accident Damage', '2026-11-10', 'Peliyagoda Flyover', 'Side panel dented and rear-view mirror smashed by a reckless lorry overtaking.', 175000.00, NULL, 'UNDER_REVIEW', NULL, 'Inspected police report. Waiting for final assessor estimate verification.', NULL, '2026-11-11 10:00:00', '2026-11-12 14:30:00'),
(6, 'CLM-2026-0006', 8, 5, 3, 5, 'Surgical Expenses', '2026-11-08', 'Asiri Central Hospital, Colombo', 'Laparoscopic appendectomy surgery performed urgently.', 310000.00, NULL, 'UNDER_REVIEW', NULL, 'Reviewing surgeon notes and operative theater charges against standard schedule.', NULL, '2026-11-09 11:15:00', '2026-11-10 15:00:00'),
(7, 'CLM-2026-0007', 9, 6, 4, 7, 'Burglary and Theft', '2026-11-05', 'Commercial Warehouse, Gampaha', 'Break-in at front roller door overnight; electronics and office equipment stolen.', 850000.00, NULL, 'UNDER_REVIEW', NULL, 'Police investigation underway; forensic report requested from local police station.', NULL, '2026-11-06 09:00:00', '2026-11-07 10:30:00'),
(8, 'CLM-2026-0008', 2, 1, 2, 3, 'Critical Illness', '2026-10-28', 'Durdans Heart Centre, Colombo', 'Angioplasty with dual stent insertion following myocardial infarction diagnosis.', 950000.00, NULL, 'UNDER_REVIEW', NULL, 'Medical consultant reviewing cardiology angiogram and discharge summary.', NULL, '2026-10-30 13:20:00', '2026-11-01 11:00:00'),

-- 3. DOCUMENTS_REQUIRED
(9, 'CLM-2026-0009', 11, 8, 1, 2, 'Third Party Liability', '2026-11-02', 'High Level Road, Pannipitiya', 'Vehicle involved in a low-speed collision with a three-wheeler. Minor damages claimed.', 90000.00, NULL, 'DOCUMENTS_REQUIRED', NULL, 'Third party driver license and official police statement extract are missing.', 'Please upload the clear copy of third party driver license and police traffic book extract.', '2026-11-03 10:30:00', '2026-11-05 09:45:00'),
(10, 'CLM-2026-0010', 12, 9, 3, 6, 'Hospitalization Reimbursement', '2026-10-25', 'Lanka Hospitals, Colombo', 'Emergency room treatment and overnight observation for chest congestion.', 125000.00, NULL, 'DOCUMENTS_REQUIRED', NULL, 'Detailed pharmacy bill break-down and physician referral note missing.', 'Please provide the itemized pharmacy receipt and doctor prescription letter.', '2026-10-26 15:00:00', '2026-10-28 14:00:00'),
(11, 'CLM-2026-0011', 14, 11, 4, 7, 'Natural Disaster Flood/Storm', '2026-10-20', 'Bandarawela Town', 'Heavy rainwater seepage through roof tiles damaged living room furniture and painting.', 180000.00, NULL, 'DOCUMENTS_REQUIRED', NULL, 'Grama Niladhari natural disaster certification required for flood/roof claim.', 'Please upload the official Grama Niladhari certificate confirming the adverse weather event.', '2026-10-22 11:00:00', '2026-10-24 16:30:00'),

-- 4. RESUBMITTED
(12, 'CLM-2026-0012', 15, 12, 1, 2, 'Windscreen Damage', '2026-10-18', 'Southern Expressway, Dodangoda', 'Front windshield cracked by flying stone debris kicked up from preceding vehicle.', 72000.00, NULL, 'RESUBMITTED', NULL, 'Customer provided high-resolution glass replacement invoice and glass code photos.', NULL, '2026-10-19 14:00:00', '2026-10-23 10:15:00'),
(13, 'CLM-2026-0013', 17, 14, 3, 6, 'Outpatient Consultation', '2026-10-15', 'Osu Sala & MediClinic, Dehiwala', 'Series of diagnostic blood tests and specialist consultation for thyroid disorder.', 45000.00, NULL, 'RESUBMITTED', NULL, 'Customer uploaded original diagnostic lab invoice and consultant prescription.', NULL, '2026-10-16 09:30:00', '2026-10-21 11:45:00'),

-- 5. APPROVED
(14, 'CLM-2026-0014', 18, 15, 1, 1, 'Accident Damage', '2026-10-10', 'Kandy Road, Kadawatha', 'Rear tailgate and reverse camera damaged in reversing mishap at parking bay.', 115000.00, 110000.00, 'APPROVED', NULL, 'Approved after assessor estimate verification minus standard policy excess of Rs. 5,000.', NULL, '2026-10-11 16:20:00', '2026-10-14 15:30:00'),
(15, 'CLM-2026-0015', 3, 2, 3, 5, 'Hospitalization Reimbursement', '2026-09-28', 'Durdans Hospital, Colombo', 'Hospital stay for severe food poisoning and gastrointestinal infection.', 95000.00, 92000.00, 'APPROVED', NULL, 'All valid invoices verified against policy limits. Approved for settlement.', NULL, '2026-09-30 10:15:00', '2026-10-04 12:00:00'),
(16, 'CLM-2026-0016', 10, 7, 2, 4, 'Permanent Disability', '2026-09-15', 'Kandy General Hospital', 'Loss of finger functionality resulting from industrial machine accident. Disability assessment 15%.', 600000.00, 600000.00, 'APPROVED', NULL, 'Government medical board disability certification verified and approved according to schedule.', NULL, '2026-09-18 11:30:00', '2026-09-25 14:00:00'),
(17, 'CLM-2026-0017', 13, 10, 5, 8, 'Flight Delay', '2026-10-02', 'Suvarnabhumi Airport, Bangkok', 'Flight delayed over 12 hours due to technical glitch; required overnight airport hotel accommodation.', 38000.00, 38000.00, 'APPROVED', NULL, 'Airline delay letter and hotel receipt verified. Approved for full amount.', NULL, '2026-10-05 13:00:00', '2026-10-08 10:00:00'),

-- 6. REJECTED
(18, 'CLM-2026-0018', 5, 3, 1, 2, 'Accident Damage', '2026-09-20', 'Galle Road, Moratuwa', 'Motorcycle skid damage during heavy rainfall.', 65000.00, 0.00, 'REJECTED', 'Rider did not possess a valid driving license at the time of the incident as confirmed by police.', 'Policy exclusion clause 4.2 applies: unauthorized unlicensed driver.', NULL, '2026-09-21 09:00:00', '2026-09-24 16:00:00'),
(19, 'CLM-2026-0019', 19, 16, 4, 7, 'Pipe Burst Water Damage', '2026-09-10', 'Dematagoda Apartment Complex', 'Water seepage from exterior balcony during monsoon rain.', 140000.00, 0.00, 'REJECTED', 'Maintenance neglect and wear-and-tear of exterior sealant; building management responsibility.', 'Assessor report concluded gradual seepage caused by lack of waterproofing maintenance.', NULL, '2026-09-12 14:40:00', '2026-09-16 11:15:00'),
(20, 'CLM-2026-0020', 20, 17, 5, 8, 'Loss of Passport', '2026-08-25', 'Dubai Mall, UAE', 'Lost wallet with national ID and cash; claimed replacement expenses.', 55000.00, 0.00, 'REJECTED', 'Cash loss is excluded under the selected basic travel insurance tier.', 'Policy terms explicitly exclude unattended currency notes and unaccompanied personal effects.', NULL, '2026-08-28 10:20:00', '2026-09-01 15:30:00'),

-- 7. SETTLEMENT_PENDING
(21, 'CLM-2026-0021', 21, 18, 1, 1, 'Accident Damage', '2026-10-05', 'Nawaloka Roundabout, Negombo', 'Collision at junction with delivery van. Fender, grille, and radiator damaged.', 340000.00, 325000.00, 'SETTLEMENT_PENDING', NULL, 'Forwarded to finance department for EFT payment release.', NULL, '2026-10-06 11:00:00', '2026-10-18 14:00:00'),
(22, 'CLM-2026-0022', 22, 19, 3, 5, 'Surgical Expenses', '2026-09-18', 'Kings Hospital, Colombo 05', 'Arthroscopic knee surgery for torn meniscus.', 280000.00, 265000.00, 'SETTLEMENT_PENDING', NULL, 'Approved after deducting non-medical consumables. In queue for bank disbursement.', NULL, '2026-09-20 15:30:00', '2026-10-05 16:15:00'),
(23, 'CLM-2026-0023', 4, 3, 4, 7, 'Fire and Lightning', '2026-09-02', 'Peradeniya, Kandy', 'Lightning strike damaged solar inverter system and household surge protectors.', 195000.00, 185000.00, 'SETTLEMENT_PENDING', NULL, 'Ceylon Electricity Board inspection report verified. Transferred to settlement queue.', NULL, '2026-09-04 10:45:00', '2026-09-19 12:30:00'),

-- 8. SETTLED
(24, 'CLM-2026-0024', 1, 1, 1, 1, 'Windscreen Damage', '2026-08-14', 'Marine Drive, Bambalapitiya', 'Windshield shatter by fallen coconut branch during windy evening.', 68000.00, 68000.00, 'SETTLED', NULL, 'Fully settled via direct bank transfer.', NULL, '2026-08-15 09:15:00', '2026-08-25 10:00:00'),
(25, 'CLM-2026-0025', 8, 5, 3, 6, 'Hospitalization Reimbursement', '2026-07-20', 'Asiri Surgical Hospital', 'Treatment for dengue fever with 4 days inpatient care.', 145000.00, 140000.00, 'SETTLED', NULL, 'Settled directly to hospital account on cashless discharge guarantee.', NULL, '2026-07-22 13:00:00', '2026-08-05 15:45:00'),
(26, 'CLM-2026-0026', 6, 4, 5, 8, 'Overseas Medical Emergency', '2026-06-12', 'Kuala Lumpur, Malaysia', 'Emergency outpatient treatment for sprained ankle after slipping at railway station.', 58000.00, 55000.00, 'SETTLED', NULL, 'Overseas medical bills reimbursed to customer bank account.', NULL, '2026-06-15 11:20:00', '2026-06-28 14:10:00'),
(27, 'CLM-2026-0027', 9, 6, 4, 7, 'Fire and Lightning', '2026-05-18', 'Gampaha Warehouse', 'Small electrical fire in main switchboard controlled quickly by safety sprinklers.', 320000.00, 305000.00, 'SETTLED', NULL, 'Settled after certified electrician repair report.', NULL, '2026-05-20 14:00:00', '2026-06-08 16:00:00'),

-- 9. CLOSED
(28, 'CLM-2026-0028', 16, 13, 2, 3, 'Critical Illness', '2026-04-10', 'Sri Jayewardenepura General Hospital', 'Early stage renal treatment covered under comprehensive critical illness rider.', 500000.00, 500000.00, 'CLOSED', NULL, 'Payment made, acknowledgment receipt signed and matter closed.', NULL, '2026-04-12 10:00:00', '2026-05-15 11:30:00'),
(29, 'CLM-2026-0029', 7, 5, 1, 1, 'Theft', '2026-03-01', 'Orugodawatta Yard', 'Spare wheel and tool kit stolen from cargo bed overnight.', 42000.00, 38000.00, 'CLOSED', NULL, 'Replaced and settled. Claim cycle completed.', NULL, '2026-03-03 16:30:00', '2026-04-02 14:00:00'),
(30, 'CLM-2026-0030', 25, 1, 3, 5, 'Hospitalization Reimbursement', '2026-03-22', 'Ninewells Hospital, Colombo', 'Pediatric bronchitis treatment for 3-year-old child.', 78000.00, 75000.00, 'CLOSED', NULL, 'Settled and confirmed. File closed.', NULL, '2026-03-24 09:45:00', '2026-04-15 12:00:00');

-- 8. Insert Sample Claim Documents Metadata
INSERT INTO claim_documents (id, claim_id, document_name, document_type, file_path, file_size, content_type, is_additional_request, uploaded_by_user_id, uploaded_at) VALUES
(1, 1, 'police_report_kollupitiya.pdf', 'Police Report', 'uploads/documents/sample_police_report.pdf', 345000, 'application/pdf', FALSE, 10, '2026-11-19 09:35:00'),
(2, 1, 'accident_damage_front_bumper.jpg', 'Accident Photos', 'uploads/documents/sample_damage_photo.jpg', 1250000, 'image/jpeg', FALSE, 10, '2026-11-19 09:36:00'),
(3, 1, 'repair_estimate_toyota_lanka.pdf', 'Repair Estimate', 'uploads/documents/sample_repair_estimate.pdf', 420000, 'application/pdf', FALSE, 10, '2026-11-19 09:37:00'),
(4, 2, 'nawaloka_discharge_summary.pdf', 'Discharge Summary', 'uploads/documents/sample_discharge_summary.pdf', 510000, 'application/pdf', FALSE, 11, '2026-11-17 11:22:00'),
(5, 2, 'hospital_invoice_paid.pdf', 'Hospital Bill', 'uploads/documents/sample_hospital_bill.pdf', 380000, 'application/pdf', FALSE, 11, '2026-11-17 11:23:00'),
(6, 5, 'police_report_peliyagoda.pdf', 'Police Report', 'uploads/documents/sample_police_report.pdf', 310000, 'application/pdf', FALSE, 14, '2026-11-11 10:05:00'),
(7, 9, 'third_party_license_extract.pdf', 'Third Party License', 'uploads/documents/sample_license.pdf', 290000, 'application/pdf', TRUE, 17, '2026-11-06 10:15:00'),
(8, 12, 'windshield_invoice_code.pdf', 'Repair Estimate', 'uploads/documents/sample_repair_estimate.pdf', 260000, 'application/pdf', TRUE, 21, '2026-10-23 10:10:00'),
(9, 14, 'kadawatha_garage_estimate.pdf', 'Repair Estimate', 'uploads/documents/sample_repair_estimate.pdf', 450000, 'application/pdf', FALSE, 24, '2026-10-11 16:25:00'),
(10, 24, 'marine_drive_incident_bill.pdf', 'Repair Estimate', 'uploads/documents/sample_repair_estimate.pdf', 330000, 'application/pdf', FALSE, 10, '2026-08-15 09:20:00');

-- 9. Insert Realistic Claim Status History
INSERT INTO claim_status_history (claim_id, previous_status, new_status, updated_by_user_id, updated_by_name, reason_or_notes, created_at) VALUES
(1, NULL, 'SUBMITTED', 10, 'Chaminda Karunaratne', 'Claim submitted via online portal.', '2026-11-19 09:30:00'),
(2, NULL, 'SUBMITTED', 11, 'Nadeesha Fernando', 'Hospitalization reimbursement submitted.', '2026-11-17 11:20:00'),
(5, NULL, 'SUBMITTED', 14, 'Roshan Alwis', 'Claim submitted online.', '2026-11-11 10:00:00'),
(5, 'SUBMITTED', 'UNDER_REVIEW', 2, 'Sunil Perera', 'Assigned and initiated technical review.', '2026-11-12 14:30:00'),
(9, NULL, 'SUBMITTED', 17, 'Thilini Wickramage', 'Accident claim submitted.', '2026-11-03 10:30:00'),
(9, 'SUBMITTED', 'UNDER_REVIEW', 3, 'Nimal Jayasuriya', 'Assigned and opened for evaluation.', '2026-11-04 11:00:00'),
(9, 'UNDER_REVIEW', 'DOCUMENTS_REQUIRED', 3, 'Nimal Jayasuriya', 'Third party driver license and police traffic book extract requested.', '2026-11-05 09:45:00'),
(12, NULL, 'SUBMITTED', 21, 'Pawani Thennakoon', 'Windshield claim registered.', '2026-10-19 14:00:00'),
(12, 'SUBMITTED', 'UNDER_REVIEW', 3, 'Nimal Jayasuriya', 'Reviewing windshield replacement request.', '2026-10-20 10:00:00'),
(12, 'UNDER_REVIEW', 'DOCUMENTS_REQUIRED', 3, 'Nimal Jayasuriya', 'Original invoice with warranty stamp requested.', '2026-10-21 15:00:00'),
(12, 'DOCUMENTS_REQUIRED', 'RESUBMITTED', 21, 'Pawani Thennakoon', 'Uploaded invoice with glass serial number.', '2026-10-23 10:15:00'),
(14, NULL, 'SUBMITTED', 24, 'Suraj Gamage', 'Vehicle damage claim registered.', '2026-10-11 16:20:00'),
(14, 'SUBMITTED', 'UNDER_REVIEW', 2, 'Sunil Perera', 'Assessor sent for garage verification.', '2026-10-12 11:00:00'),
(14, 'UNDER_REVIEW', 'APPROVED', 2, 'Sunil Perera', 'Approved for Rs. 110,000 after policy excess deduction.', '2026-10-14 15:30:00'),
(18, NULL, 'SUBMITTED', 12, 'Kasun Dissanayake', 'Skid damage claim registered.', '2026-09-21 09:00:00'),
(18, 'SUBMITTED', 'UNDER_REVIEW', 3, 'Nimal Jayasuriya', 'Verifying rider credentials.', '2026-09-22 10:30:00'),
(18, 'UNDER_REVIEW', 'REJECTED', 3, 'Nimal Jayasuriya', 'Rejected: Unauthorized unlicensed driver at incident time.', '2026-09-24 16:00:00'),
(21, NULL, 'SUBMITTED', 27, 'Madushani Hettiarachchi', 'Accident claim submitted.', '2026-10-06 11:00:00'),
(21, 'SUBMITTED', 'UNDER_REVIEW', 2, 'Sunil Perera', 'Reviewing assessor findings.', '2026-10-09 14:00:00'),
(21, 'UNDER_REVIEW', 'APPROVED', 2, 'Sunil Perera', 'Approved Rs. 325,000.', '2026-10-15 10:00:00'),
(21, 'APPROVED', 'SETTLEMENT_PENDING', 2, 'Sunil Perera', 'Payment queue created for finance team.', '2026-10-18 14:00:00'),
(24, NULL, 'SUBMITTED', 10, 'Chaminda Karunaratne', 'Fallen tree branch claim submitted.', '2026-08-15 09:15:00'),
(24, 'SUBMITTED', 'UNDER_REVIEW', 2, 'Sunil Perera', 'Inspection complete.', '2026-08-17 11:00:00'),
(24, 'UNDER_REVIEW', 'APPROVED', 2, 'Sunil Perera', 'Approved for Rs. 68,000.', '2026-08-19 14:00:00'),
(24, 'APPROVED', 'SETTLEMENT_PENDING', 2, 'Sunil Perera', 'Transferred to finance.', '2026-08-21 10:30:00'),
(24, 'SETTLEMENT_PENDING', 'SETTLED', 2, 'Sunil Perera', 'Payment transferred to Commercial Bank account.', '2026-08-25 10:00:00'),
(28, NULL, 'SUBMITTED', 22, 'Nuwan Rathnayake', 'Critical illness claim registered.', '2026-04-12 10:00:00'),
(28, 'SUBMITTED', 'UNDER_REVIEW', 4, 'Kamal Gunaratne', 'Medical board assessment.', '2026-04-18 11:30:00'),
(28, 'UNDER_REVIEW', 'APPROVED', 4, 'Kamal Gunaratne', 'Approved full limit Rs. 500,000.', '2026-04-25 14:00:00'),
(28, 'APPROVED', 'SETTLEMENT_PENDING', 4, 'Kamal Gunaratne', 'Finance processing.', '2026-04-28 09:00:00'),
(28, 'SETTLEMENT_PENDING', 'SETTLED', 4, 'Kamal Gunaratne', 'Bank transfer complete.', '2026-05-05 15:00:00'),
(28, 'SETTLED', 'CLOSED', 4, 'Kamal Gunaratne', 'Receipt signed and file formally closed.', '2026-05-15 11:30:00');

-- 10. Insert Settlements for Settled Claims
INSERT INTO settlements (id, claim_id, settlement_amount, payment_method, payment_reference, settlement_notes, settled_by_user_id, settlement_date) VALUES
(1, 24, 68000.00, 'BANK_TRANSFER', 'SL-EFT-20260825-9981', 'Direct credit to Commercial Bank account 8001234567.', 2, '2026-08-25 10:00:00'),
(2, 25, 140000.00, 'BANK_TRANSFER', 'SL-EFT-20260805-4421', 'Cashless discharge direct hospital payment to Asiri Surgical Hospital.', 6, '2026-08-05 15:45:00'),
(3, 26, 55000.00, 'BANK_TRANSFER', 'SL-EFT-20260628-7712', 'Foreign medical bill reimbursement converted at official CB rate.', 8, '2026-06-28 14:10:00'),
(4, 27, 305000.00, 'CHEQUE', 'CHQ-889921', 'Crossed account payee cheque handed over to business proprietor.', 7, '2026-06-08 16:00:00'),
(5, 28, 500000.00, 'BANK_TRANSFER', 'SL-EFT-20260505-1109', 'Critical illness lump-sum benefit paid to policyholder account.', 4, '2026-05-05 15:00:00');

-- 11. Insert Notifications for Customers and Officers (Dual Language)
INSERT INTO notifications (id, user_id, title_en, title_si, message_en, message_si, claim_id, is_read, created_at) VALUES
-- For Customer Chaminda (User 10)
(1, 10, 'Claim Submitted Successfully', 'හිමිකම් පෑම සාර්ථකව ඉදිරිපත් කරන ලදී', 'Your claim CLM-2026-0001 for Vehicle Insurance has been submitted.', 'ඔබගේ CLM-2026-0001 දරන වාහන රක්ෂණ හිමිකම් පෑම සාර්ථකව පද්ධතියට ලැබුණි.', 1, FALSE, '2026-11-19 09:30:00'),
(2, 10, 'Claim Settled', 'හිමිකම් පෑම සඳහා ගෙවීම් කරන ලදී', 'Your claim CLM-2026-0024 of Rs. 68,000 has been successfully settled to your bank account.', 'ඔබගේ CLM-2026-0024 දරන රු. 68,000 ක හිමිකම් පෑම ඔබගේ බැංකු ගිණුමට සාර්ථකව බැර කරන ලදී.', 24, TRUE, '2026-08-25 10:05:00'),

-- For Customer Thilini (User 17)
(3, 17, 'Additional Documents Required', 'අමතර ලියකියවිලි අවශ්‍යයි', 'Officer Nimal Jayasuriya requested additional documents for claim CLM-2026-0009: third party driver license copy.', 'නිලධාරී නිමල් ජයසූරිය CLM-2026-0009 හිමිකම් පෑම සඳහා තෙවන පාර්ශවයේ රියදුරු බලපත්‍ර පිටපත ඉල්ලා ඇත.', 9, FALSE, '2026-11-05 09:46:00'),

-- For Customer Suraj (User 24)
(4, 24, 'Claim Approved', 'හිමිකම් පෑම අනුමත කරන ලදී', 'Your claim CLM-2026-0014 has been approved for Rs. 110,000.00.', 'ඔබගේ CLM-2026-0014 දරන හිමිකම් පෑම රු. 110,000.00 ක මුදලකට අනුමත කරන ලදී.', 14, TRUE, '2026-10-14 15:32:00'),

-- For Officer Sunil (User 2)
(5, 2, 'New Claim Submitted', 'නව හිමිකම් පෑමක් ඉදිරිපත් විය', 'New vehicle claim CLM-2026-0001 submitted by Chaminda Karunaratne requires review.', 'චමින්ද කරුණාරත්න විසින් ඉදිරිපත් කළ නව වාහන හිමිකම් පෑම CLM-2026-0001 සමාලෝචනය කළ යුතුය.', 1, FALSE, '2026-11-19 09:31:00'),
(6, 2, 'Settlement Queue Update', 'ගෙවීම් පෝලිමේ යාවත්කාලීනය', 'Claim CLM-2026-0021 moved to SETTLEMENT_PENDING.', 'CLM-2026-0021 හිමිකම් පෑම ගෙවීම් පෝලිමට යොමු කෙරිණි.', 21, TRUE, '2026-10-18 14:05:00'),

-- For Officer Nimal (User 3)
(7, 3, 'Claim Resubmitted', 'හිමිකම් පෑම නැවත ඉදිරිපත් කරන ලදී', 'Customer Pawani Thennakoon uploaded requested documents for CLM-2026-0012.', 'පවනි තෙන්නකෝන් පාරිභෝගිකයා CLM-2026-0012 හිමිකම් පෑම සඳහා ඉල්ලූ ලියකියවිලි උඩුගත කළේය.', 12, FALSE, '2026-10-23 10:16:00'),

-- For Admin (User 1)
(8, 1, 'System Health Good', 'පද්ධති ක්‍රියාකාරිත්වය යහපත්', 'All 5 insurance categories and 8 officers active and monitoring claim queues.', 'සියලුම රක්ෂණ වර්ග 5 සහ නිලධාරීන් 8 දෙනා සක්‍රියව පද්ධතිය අධීක්ෂණය කරති.', NULL, FALSE, '2026-11-22 08:00:00');

-- 12. Adjust Sequence Counters so future inserts work seamlessly
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('customers_id_seq', (SELECT MAX(id) FROM customers));
SELECT setval('insurance_officers_id_seq', (SELECT MAX(id) FROM insurance_officers));
SELECT setval('insurance_categories_id_seq', (SELECT MAX(id) FROM insurance_categories));
SELECT setval('officer_category_assignments_id_seq', (SELECT MAX(id) FROM officer_category_assignments));
SELECT setval('insurance_policies_id_seq', (SELECT MAX(id) FROM insurance_policies));
SELECT setval('claims_id_seq', (SELECT MAX(id) FROM claims));
SELECT setval('claim_documents_id_seq', (SELECT MAX(id) FROM claim_documents));
SELECT setval('claim_status_history_id_seq', (SELECT MAX(id) FROM claim_status_history));
SELECT setval('settlements_id_seq', (SELECT MAX(id) FROM settlements));
SELECT setval('notifications_id_seq', (SELECT MAX(id) FROM notifications));
