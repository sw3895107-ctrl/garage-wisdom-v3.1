CREATE TABLE fixes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) NOT NULL,            -- e.g., 'P0420'
    title VARCHAR(255) NOT NULL,          -- e.g., 'Catalytic Converter Efficiency Below Threshold'
    make VARCHAR(50),                     -- e.g., 'Toyota'
    model VARCHAR(50),                    -- e.g., 'Tacoma'
    year_range VARCHAR(20),               -- e.g., '2005-2015'
    engine VARCHAR(50),                   -- e.g., '2.7L L4'
    symptom TEXT NOT NULL,                -- 'Rough idle, loss of power'
    rabbit_hole TEXT,                     -- 'Replaced O2 sensors, didn't fix it'
    actual_fix TEXT NOT NULL,             -- 'Cleaned MAF sensor and cleared code'
    your_cost NUMERIC(10, 2),             -- 15.00
    dealer_quote NUMERIC(10, 2),          -- 850.00
    you_saved NUMERIC(10, 2),             -- 835.00
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
