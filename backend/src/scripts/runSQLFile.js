import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  }
});

async function runSQLFile(filePath) {
  const client = await pool.connect();

  try {
    console.log('Reading SQL file:', filePath);
    const sql = fs.readFileSync(filePath, 'utf8');

    console.log('Executing SQL...');
    await client.query(sql);

    console.log('✅ SQL executed successfully!');

    // Check how many parcels we now have
    const result = await client.query('SELECT COUNT(*) as count FROM parcels');
    console.log(`📊 Total parcels in database: ${result.rows[0].count}`);

  } catch (error) {
    console.error('❌ Error executing SQL:', error.message);
    console.error(error);
  } finally {
    client.release();
    await pool.end();
  }
}

// Get SQL file path from command line argument
const sqlFile = process.argv[2];

if (!sqlFile) {
  console.error('Usage: node runSQLFile.js <path-to-sql-file>');
  process.exit(1);
}

// Resolve the path relative to the script location
const resolvedPath = path.resolve(__dirname, '..', sqlFile);

runSQLFile(resolvedPath);
