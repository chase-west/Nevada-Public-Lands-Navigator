import axios from 'axios';
import dotenv from 'dotenv';
import { query } from '../config/database.js';

dotenv.config();

const CONGRESS_API_KEY = process.env.CONGRESS_API_KEY;
const CONGRESS_API_BASE = 'https://api.congress.gov/v3';

/**
 * Fetches bill details from Congress.gov API
 * @param {string} congress - Congress number (e.g., '118')
 * @param {string} billType - Bill type (e.g., 's' for Senate, 'hr' for House)
 * @param {string} billNumber - Bill number (e.g., '3879')
 */
async function fetchBillDetails(congress, billType, billNumber) {
  try {
    const url = `${CONGRESS_API_BASE}/bill/${congress}/${billType}/${billNumber}`;

    const response = await axios.get(url, {
      params: { api_key: CONGRESS_API_KEY },
      headers: { Accept: 'application/json' }
    });

    return response.data.bill;
  } catch (error) {
    if (error.response?.status === 401) {
      console.error('✗ Invalid Congress.gov API key. Please set CONGRESS_API_KEY in .env');
    } else {
      console.error('Error fetching bill details:', error.message);
    }
    throw error;
  }
}

/**
 * Fetches bill actions/status history
 */
async function fetchBillActions(congress, billType, billNumber) {
  try {
    const url = `${CONGRESS_API_BASE}/bill/${congress}/${billType}/${billNumber}/actions`;

    const response = await axios.get(url, {
      params: { api_key: CONGRESS_API_KEY },
      headers: { Accept: 'application/json' }
    });

    return response.data.actions || [];
  } catch (error) {
    console.error('Error fetching bill actions:', error.message);
    return [];
  }
}

/**
 * Ingests a bill into the database
 */
async function ingestBill(congress, billType, billNumber) {
  try {
    console.log(`\n📄 Fetching: ${congress}th Congress ${billType.toUpperCase()}.${billNumber}`);

    const billData = await fetchBillDetails(congress, billType, billNumber);
    const actions = await fetchBillActions(congress, billType, billNumber);

    // Get the latest action for status
    const latestAction = actions.length > 0 ? actions[0] : null;
    const status = latestAction?.text || 'Status unknown';

    // Extract introduced date
    const introducedDate = billData.introducedDate || null;

    // Build the bill URL
    const billUrl = `https://www.congress.gov/bill/${congress}th-congress/${billType}-bill/${billNumber}`;

    // Insert or update bill in database
    const result = await query(
      `INSERT INTO bills (name, number, congress, status, summary, introduced_date, url, last_updated)
       VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)
       ON CONFLICT (number)
       DO UPDATE SET
         name = EXCLUDED.name,
         status = EXCLUDED.status,
         summary = EXCLUDED.summary,
         last_updated = CURRENT_TIMESTAMP
       RETURNING id`,
      [
        billData.title || `${billType.toUpperCase()}.${billNumber}`,
        `${billType.toUpperCase()}.${billNumber}`,
        congress,
        status,
        billData.summary?.text || 'Summary not available',
        introducedDate,
        billUrl
      ]
    );

    const billId = result.rows[0].id;

    console.log(`✓ Ingested: ${billData.title}`);
    console.log(`  Status: ${status}`);
    console.log(`  Introduced: ${introducedDate || 'Unknown'}`);
    console.log(`  Database ID: ${billId}`);

    return billId;
  } catch (error) {
    console.error(`✗ Error ingesting bill ${billType}.${billNumber}:`, error.message);
    throw error;
  }
}

/**
 * Main ingestion process
 */
async function main() {
  console.log('🚀 Starting Congress.gov data ingestion...\n');

  // Bills to ingest - add more as needed
  const billsToIngest = [
    { congress: 118, billType: 's', billNumber: 3879 }, // Northern Nevada Act
  ];

  for (const bill of billsToIngest) {
    try {
      await ingestBill(bill.congress, bill.billType, bill.billNumber);
    } catch (error) {
      console.error(`Failed to ingest ${bill.billType}.${bill.billNumber}`);
    }
  }

  console.log('\n✅ Congress.gov data ingestion complete!');
  process.exit(0);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { fetchBillDetails, fetchBillActions, ingestBill };
