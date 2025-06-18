-- Database Schema for Dashboard Data

-- Main metrics table
CREATE TABLE dashboard_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_type VARCHAR(50) NOT NULL,
    value DECIMAL(15,2) NOT NULL,
    previous_value DECIMAL(15,2),
    percentage_change DECIMAL(5,2),
    department VARCHAR(100),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Network performance table
CREATE TABLE network_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_type VARCHAR(20) NOT NULL,
    active_lines INTEGER,
    uptime_percentage DECIMAL(5,2),
    revenue DECIMAL(15,2),
    service_tickets INTEGER,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sales data table
CREATE TABLE sales_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    salesperson VARCHAR(100) NOT NULL,
    revenue DECIMAL(15,2),
    target DECIMAL(15,2),
    customers_acquired INTEGER,
    conversion_rate DECIMAL(5,2),
    pipeline_value DECIMAL(15,2),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- HR metrics table
CREATE TABLE hr_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    total_employees INTEGER,
    attendance_rate DECIMAL(5,2),
    open_positions INTEGER,
    satisfaction_score DECIMAL(3,1),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_dashboard_metrics_timestamp ON dashboard_metrics(timestamp);
CREATE INDEX idx_dashboard_metrics_type ON dashboard_metrics(metric_type);
CREATE INDEX idx_network_metrics_timestamp ON network_metrics(timestamp);
CREATE INDEX idx_sales_data_timestamp ON sales_data(timestamp);

-- Enable Row Level Security (if using Supabase)
ALTER TABLE dashboard_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE network_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies for data access
CREATE POLICY "Allow read access to dashboard_metrics" ON dashboard_metrics
    FOR SELECT USING (true);

CREATE POLICY "Allow insert access to dashboard_metrics" ON dashboard_metrics
    FOR INSERT WITH CHECK (true);
