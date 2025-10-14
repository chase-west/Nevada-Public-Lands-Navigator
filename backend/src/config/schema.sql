-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS parcels CASCADE;
DROP TABLE IF EXISTS bills CASCADE;

-- Create bills table
CREATE TABLE bills (
  id SERIAL PRIMARY KEY,
  name VARCHAR(500) NOT NULL,
  number VARCHAR(50) UNIQUE NOT NULL,
  congress INTEGER,
  status VARCHAR(100),
  summary TEXT,
  introduced_date DATE,
  url VARCHAR(500),
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create parcels table with PostGIS geometry
CREATE TABLE parcels (
  id SERIAL PRIMARY KEY,
  name VARCHAR(500) NOT NULL,
  county VARCHAR(100) NOT NULL,
  acres NUMERIC(10, 2),
  use_type VARCHAR(100),
  description TEXT,
  bill_id INTEGER REFERENCES bills(id) ON DELETE SET NULL,
  geometry GEOMETRY(MultiPolygon, 4326),
  blm_reference VARCHAR(200),
  township VARCHAR(50),
  range VARCHAR(50),
  section VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create spatial index on geometry column
CREATE INDEX idx_parcels_geometry ON parcels USING GIST(geometry);

-- Create indexes for common queries
CREATE INDEX idx_parcels_county ON parcels(county);
CREATE INDEX idx_parcels_bill_id ON parcels(bill_id);
CREATE INDEX idx_parcels_use_type ON parcels(use_type);
CREATE INDEX idx_bills_number ON bills(number);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for parcels
CREATE TRIGGER update_parcels_updated_at
BEFORE UPDATE ON parcels
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert sample bill (Northern Nevada Economic Development and Conservation Act)
INSERT INTO bills (name, number, congress, status, summary, url, introduced_date)
VALUES (
  'Northern Nevada Economic Development and Conservation Act',
  'S.3879',
  118,
  'Introduced in Senate',
  'A bill to promote economic development and conservation in northern Nevada through strategic federal land transfers.',
  'https://www.congress.gov/bill/118th-congress/senate-bill/3879',
  '2024-03-07'
);

-- Add sample parcel data for demonstration
-- Note: Real geometry data would come from BLM API ingestion
INSERT INTO parcels (name, county, acres, use_type, description, bill_id, geometry)
VALUES (
  'Elko Housing Development Site',
  'Elko',
  644,
  'Housing Development',
  'Proposed land transfer to City of Elko for housing development',
  1,
  ST_GeomFromText('MULTIPOLYGON(((-115.7 40.8, -115.7 40.81, -115.69 40.81, -115.69 40.8, -115.7 40.8)))', 4326)
);

-- Add more sample counties for filtering
INSERT INTO parcels (name, county, acres, use_type, description, bill_id, geometry)
VALUES
(
  'Douglas Conservation Area',
  'Douglas',
  450,
  'Conservation',
  'Proposed conservation area in Douglas County',
  1,
  ST_GeomFromText('MULTIPOLYGON(((-119.8 39.0, -119.8 39.01, -119.79 39.01, -119.79 39.0, -119.8 39.0)))', 4326)
),
(
  'Pershing Recreation Site',
  'Pershing',
  325,
  'Recreation',
  'Proposed recreation development site',
  1,
  ST_GeomFromText('MULTIPOLYGON(((-118.5 40.2, -118.5 40.21, -118.49 40.21, -118.49 40.2, -118.5 40.2)))', 4326)
);
