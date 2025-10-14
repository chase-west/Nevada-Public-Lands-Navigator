-- Delete existing tiny parcels
DELETE FROM parcels;

-- Add MUCH larger, more visible parcels across Nevada

-- Elko Housing Development - Large area near Elko
INSERT INTO parcels (name, county, acres, use_type, description, bill_id, geometry)
VALUES (
  'Elko Housing Development Site',
  'Elko',
  644,
  'Housing Development',
  'Proposed land transfer to City of Elko for housing development',
  1,
  ST_GeomFromText('MULTIPOLYGON(((-115.8 40.7, -115.8 40.9, -115.5 40.9, -115.5 40.7, -115.8 40.7)))', 4326)
);

-- Douglas Conservation Area - Large area near Carson City
INSERT INTO parcels (name, county, acres, use_type, description, bill_id, geometry)
VALUES (
  'Douglas Conservation Area',
  'Douglas',
  450,
  'Conservation',
  'Proposed conservation area in Douglas County',
  1,
  ST_GeomFromText('MULTIPOLYGON(((-119.9 38.9, -119.9 39.2, -119.6 39.2, -119.6 38.9, -119.9 38.9)))', 4326)
);

-- Pershing Recreation Site - Large area in north-central Nevada
INSERT INTO parcels (name, county, acres, use_type, description, bill_id, geometry)
VALUES (
  'Pershing Recreation Site',
  'Pershing',
  325,
  'Recreation',
  'Proposed recreation development site',
  1,
  ST_GeomFromText('MULTIPOLYGON(((-118.6 40.0, -118.6 40.3, -118.3 40.3, -118.3 40.0, -118.6 40.0)))', 4326)
);

-- Clark County Urban Expansion - Near Las Vegas
INSERT INTO parcels (name, county, acres, use_type, description, bill_id, geometry)
VALUES (
  'Clark County Urban Expansion',
  'Clark',
  850,
  'Housing Development',
  'Proposed urban development near Las Vegas',
  1,
  ST_GeomFromText('MULTIPOLYGON(((-115.3 36.0, -115.3 36.3, -115.0 36.3, -115.0 36.0, -115.3 36.0)))', 4326)
);

-- Washoe Recreation Area - Near Reno
INSERT INTO parcels (name, county, acres, use_type, description, bill_id, geometry)
VALUES (
  'Washoe Recreation Area',
  'Washoe',
  500,
  'Recreation',
  'Proposed recreation area near Reno',
  1,
  ST_GeomFromText('MULTIPOLYGON(((-119.9 39.4, -119.9 39.7, -119.6 39.7, -119.6 39.4, -119.9 39.4)))', 4326)
);
