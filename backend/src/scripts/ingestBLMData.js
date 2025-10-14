import axios from 'axios';
import dotenv from 'dotenv';
import { query } from '../config/database.js';

dotenv.config();

const BLM_API_BASE = process.env.BLM_API_BASE_URL || 'https://gis.blm.gov/arcgis/rest/services';

// BLM PLSS (Public Land Survey System) service for Nevada
const PLSS_SERVICE_URL = `${BLM_API_BASE}/Cadastral/BLM_Natl_PLSS_CadNSDI/MapServer/2`;

/**
 * Fetches parcel geometry from BLM ArcGIS REST API
 * @param {string} county - County name in Nevada
 * @param {string} township - Township identifier
 * @param {string} range - Range identifier
 * @param {string} section - Section identifier
 */
async function fetchBLMParcelGeometry(county, township, range, section) {
  try {
    const whereClause = `STATE = 'NV' AND COUNTY = '${county.toUpperCase()}'`;

    if (township) {
      whereClause += ` AND TWNSHPLAB = '${township}'`;
    }
    if (range) {
      whereClause += ` AND RANGLAB = '${range}'`;
    }
    if (section) {
      whereClause += ` AND SECLAB = '${section}'`;
    }

    const params = {
      where: whereClause,
      outFields: '*',
      returnGeometry: true,
      f: 'geojson',
      outSR: 4326 // WGS84 coordinate system
    };

    const response = await axios.get(`${PLSS_SERVICE_URL}/query`, { params });

    if (response.data && response.data.features) {
      return response.data.features;
    }

    return [];
  } catch (error) {
    console.error('Error fetching BLM data:', error.message);
    throw error;
  }
}

/**
 * Converts GeoJSON geometry to PostGIS-compatible format
 */
function convertToPostGISGeometry(geojsonGeometry) {
  return `ST_GeomFromGeoJSON('${JSON.stringify(geojsonGeometry)}')`;
}

/**
 * Ingests BLM parcel data into database
 */
async function ingestParcelData(parcelInfo) {
  try {
    const features = await fetchBLMParcelGeometry(
      parcelInfo.county,
      parcelInfo.township,
      parcelInfo.range,
      parcelInfo.section
    );

    if (features.length === 0) {
      console.log(`⚠️  No geometry found for ${parcelInfo.name}`);
      return;
    }

    for (const feature of features) {
      const geometry = feature.geometry;

      // Calculate acres from geometry if not provided
      const acresQuery = `SELECT ST_Area(ST_GeomFromGeoJSON('${JSON.stringify(geometry)}')::geography) / 4046.86 as acres`;
      const acresResult = await query(acresQuery);
      const calculatedAcres = parcelInfo.acres || acresResult.rows[0].acres;

      await query(
        `INSERT INTO parcels (name, county, acres, use_type, description, bill_id, geometry, township, range, section, blm_reference)
         VALUES ($1, $2, $3, $4, $5, $6, ST_GeomFromGeoJSON($7), $8, $9, $10, $11)
         ON CONFLICT DO NOTHING`,
        [
          parcelInfo.name,
          parcelInfo.county,
          calculatedAcres,
          parcelInfo.use_type,
          parcelInfo.description,
          parcelInfo.bill_id,
          JSON.stringify(geometry),
          parcelInfo.township,
          parcelInfo.range,
          parcelInfo.section,
          parcelInfo.blm_reference
        ]
      );

      console.log(`✓ Ingested: ${parcelInfo.name} (${parcelInfo.county} County)`);
    }
  } catch (error) {
    console.error(`✗ Error ingesting ${parcelInfo.name}:`, error.message);
  }
}

/**
 * Main ingestion process
 * In production, this data would come from a mapping of bill text to geographic references
 */
async function main() {
  console.log('🚀 Starting BLM data ingestion...\n');

  // Example parcel definitions from the Northern Nevada Act
  // These would ideally be parsed from the bill text or a structured data source
  const parcelsToIngest = [
    {
      name: 'Elko Housing Development - East',
      county: 'Elko',
      acres: 322,
      use_type: 'Housing Development',
      description: 'Eastern portion of Elko housing development site',
      bill_id: 1,
      township: 'T34N',
      range: 'R55E',
      section: '15',
      blm_reference: 'ELKO-001'
    },
    {
      name: 'Douglas County Conservation',
      county: 'Douglas',
      acres: 450,
      use_type: 'Conservation',
      description: 'Conservation area in Douglas County',
      bill_id: 1,
      township: 'T14N',
      range: 'R19E',
      section: '22',
      blm_reference: 'DOUGLAS-001'
    }
  ];

  for (const parcel of parcelsToIngest) {
    await ingestParcelData(parcel);
  }

  console.log('\n✅ BLM data ingestion complete!');
  process.exit(0);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { fetchBLMParcelGeometry, ingestParcelData };
