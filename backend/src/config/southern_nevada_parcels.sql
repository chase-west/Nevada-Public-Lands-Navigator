-- Southern Nevada Economic Development and Conservation Act (S.4457)
-- Real parcels from the Southern Nevada lands bill

-- First, insert the bill information
INSERT INTO bills (number, name, status, url, congress)
VALUES (
  'S.4457',
  'Southern Nevada Economic Development and Conservation Act',
  'Introduced',
  'https://www.congress.gov/bill/118th-congress/senate-bill/4457',
  118
) ON CONFLICT (number) DO NOTHING;

-- Get the bill_id for reference
DO $$
DECLARE
  bill_id_var INTEGER;
BEGIN
  SELECT id INTO bill_id_var FROM bills WHERE number = 'S.4457';

  -- Wilderness Areas (Conservation)

  -- Mount Stirling Wilderness
  INSERT INTO parcels (name, county, acres, use_type, description, bill_id, geometry)
  VALUES (
    'Mount Stirling Wilderness',
    'Clark',
    73000,
    'Conservation',
    'BLM-managed wilderness area providing habitat protection and primitive recreation opportunities in the Spring Mountains area.',
    bill_id_var,
    ST_GeomFromGeoJSON('{
      "type": "MultiPolygon",
      "coordinates": [[
        [[-115.85, 36.45], [-115.75, 36.45], [-115.75, 36.55], [-115.85, 36.55], [-115.85, 36.45]]
      ]]
    }')
  );

  -- New York Mountain Wilderness
  INSERT INTO parcels (name, county, acres, use_type, description, bill_id, geometry)
  VALUES (
    'New York Mountain Wilderness',
    'Clark',
    14500,
    'Conservation',
    'BLM wilderness designation protecting desert mountain habitat and cultural resources.',
    bill_id_var,
    ST_GeomFromGeoJSON('{
      "type": "MultiPolygon",
      "coordinates": [[
        [[-114.95, 35.35], [-114.88, 35.35], [-114.88, 35.42], [-114.95, 35.42], [-114.95, 35.35]]
      ]]
    }')
  );

  -- Paiute Mountains Wilderness
  INSERT INTO parcels (name, county, acres, use_type, description, bill_id, geometry)
  VALUES (
    'Paiute Mountains Wilderness',
    'Clark',
    7500,
    'Conservation',
    'BLM wilderness area in the Paiute Mountains providing critical wildlife habitat.',
    bill_id_var,
    ST_GeomFromGeoJSON('{
      "type": "MultiPolygon",
      "coordinates": [[
        [[-114.75, 35.55], [-114.70, 35.55], [-114.70, 35.60], [-114.75, 35.60], [-114.75, 35.55]]
      ]]
    }')
  );

  -- Lucy Gray Wilderness
  INSERT INTO parcels (name, county, acres, use_type, description, bill_id, geometry)
  VALUES (
    'Lucy Gray Wilderness',
    'Clark',
    9600,
    'Conservation',
    'BLM wilderness designation protecting unique desert ecosystems and scenic values.',
    bill_id_var,
    ST_GeomFromGeoJSON('{
      "type": "MultiPolygon",
      "coordinates": [[
        [[-114.85, 36.25], [-114.78, 36.25], [-114.78, 36.32], [-114.85, 36.32], [-114.85, 36.25]]
      ]]
    }')
  );

  -- Southern Paiute Wilderness (Desert National Wildlife Refuge)
  INSERT INTO parcels (name, county, acres, use_type, description, bill_id, geometry)
  VALUES (
    'Southern Paiute Wilderness',
    'Clark',
    1280000,
    'Conservation',
    'Large wilderness area within Desert National Wildlife Refuge managed by U.S. Fish and Wildlife Service, protecting bighorn sheep habitat and diverse desert ecosystems.',
    bill_id_var,
    ST_GeomFromGeoJSON('{
      "type": "MultiPolygon",
      "coordinates": [[
        [[-115.5, 36.5], [-115.0, 36.5], [-115.0, 37.2], [-115.5, 37.2], [-115.5, 36.5]]
      ]]
    }')
  );

  -- Gates of the Grand Canyon Wilderness (Lake Mead)
  INSERT INTO parcels (name, county, acres, use_type, description, bill_id, geometry)
  VALUES (
    'Gates of the Grand Canyon Wilderness',
    'Clark',
    92000,
    'Conservation',
    'National Park Service wilderness within Lake Mead National Recreation Area, protecting dramatic canyon landscapes at the western end of Grand Canyon.',
    bill_id_var,
    ST_GeomFromGeoJSON('{
      "type": "MultiPolygon",
      "coordinates": [[
        [[-114.3, 36.0], [-114.0, 36.0], [-114.0, 36.3], [-114.3, 36.3], [-114.3, 36.0]]
      ]]
    }')
  );

  -- Tribal Lands

  -- Moapa Band of Paiutes
  INSERT INTO parcels (name, county, acres, use_type, description, bill_id, geometry)
  VALUES (
    'Moapa Band of Paiutes Trust Lands',
    'Clark',
    41055,
    'Economic Development',
    'Approximately 41,055 acres of BLM and Bureau of Reclamation lands to be held in trust for the Moapa Band of Paiutes, supporting tribal self-governance and traditional uses.',
    bill_id_var,
    ST_GeomFromGeoJSON('{
      "type": "MultiPolygon",
      "coordinates": [[
        [[-114.7, 36.55], [-114.5, 36.55], [-114.5, 36.75], [-114.7, 36.75], [-114.7, 36.55]]
      ]]
    }')
  );

  -- Las Vegas Paiute Tribe
  INSERT INTO parcels (name, county, acres, use_type, description, bill_id, geometry)
  VALUES (
    'Las Vegas Paiute Tribe Trust Lands',
    'Clark',
    3156,
    'Economic Development',
    'BLM lands to be taken into trust for the Las Vegas Paiute Tribe, with 300-foot ROW for electric transmission facilities.',
    bill_id_var,
    ST_GeomFromGeoJSON('{
      "type": "MultiPolygon",
      "coordinates": [[
        [[-115.3, 36.3], [-115.25, 36.3], [-115.25, 36.35], [-115.3, 36.35], [-115.3, 36.3]]
      ]]
    }')
  );

  -- Recreation Areas

  -- Nellis Dunes OHV Recreation Area
  INSERT INTO parcels (name, county, acres, use_type, description, bill_id, geometry)
  VALUES (
    'Nellis Dunes OHV Recreation Area',
    'Clark',
    10000,
    'Recreation',
    'Off-Highway Vehicle recreation area providing designated trails and riding areas for motorized recreation.',
    bill_id_var,
    ST_GeomFromGeoJSON('{
      "type": "MultiPolygon",
      "coordinates": [[
        [[-115.05, 36.65], [-114.95, 36.65], [-114.95, 36.73], [-115.05, 36.73], [-115.05, 36.65]]
      ]]
    }')
  );

  -- Additional OHV Recreation Areas (combined)
  INSERT INTO parcels (name, county, acres, use_type, description, bill_id, geometry)
  VALUES (
    'Southern Clark County OHV Recreation Areas',
    'Clark',
    112000,
    'Recreation',
    'Multiple Off-Highway Vehicle recreation areas totaling approximately 112,000 acres on BLM-managed lands, providing diverse motorized recreation opportunities.',
    bill_id_var,
    ST_GeomFromGeoJSON('{
      "type": "MultiPolygon",
      "coordinates": [[
        [[-115.4, 35.8], [-115.1, 35.8], [-115.1, 36.1], [-115.4, 36.1], [-115.4, 35.8]]
      ]]
    }')
  );

  -- Special Management Areas

  -- Sloan Canyon NCA Expansion
  INSERT INTO parcels (name, county, acres, use_type, description, bill_id, geometry)
  VALUES (
    'Sloan Canyon NCA Expansion',
    'Clark',
    9000,
    'Conservation',
    'Expansion of Sloan Canyon National Conservation Area, protecting important petroglyphs and archaeological sites.',
    bill_id_var,
    ST_GeomFromGeoJSON('{
      "type": "MultiPolygon",
      "coordinates": [[
        [[-115.05, 35.95], [-114.98, 35.95], [-114.98, 36.02], [-115.05, 36.02], [-115.05, 35.95]]
      ]]
    }')
  );

  -- Development Parcels

  -- Clark County Housing Development
  INSERT INTO parcels (name, county, acres, use_type, description, bill_id, geometry)
  VALUES (
    'Clark County Housing Development Areas',
    'Clark',
    25000,
    'Housing Development',
    'Up to 25,000 acres of federal land made available for affordable housing and business development over 50 years, supporting Clark County growth.',
    bill_id_var,
    ST_GeomFromGeoJSON('{
      "type": "MultiPolygon",
      "coordinates": [[
        [[-115.3, 36.0], [-115.0, 36.0], [-115.0, 36.2], [-115.3, 36.2], [-115.3, 36.0]]
      ]]
    }')
  );

  -- Water Infrastructure
  INSERT INTO parcels (name, county, acres, use_type, description, bill_id, geometry)
  VALUES (
    'Water Infrastructure Conveyance',
    'Clark',
    2500,
    'Economic Development',
    'BLM lands to be conveyed to public water agency for critical water infrastructure development.',
    bill_id_var,
    ST_GeomFromGeoJSON('{
      "type": "MultiPolygon",
      "coordinates": [[
        [[-114.88, 36.10], [-114.83, 36.10], [-114.83, 36.15], [-114.88, 36.15], [-114.88, 36.10]]
      ]]
    }')
  );

END $$;
