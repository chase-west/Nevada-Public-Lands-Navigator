import express from 'express';
import { query } from '../config/database.js';

const router = express.Router();

// GET all bills
router.get('/', async (req, res) => {
  try {
    const result = await query(
      `SELECT
        b.*,
        COUNT(p.id) as parcel_count,
        SUM(p.acres) as total_acres
      FROM bills b
      LEFT JOIN parcels p ON b.id = p.bill_id
      GROUP BY b.id
      ORDER BY b.introduced_date DESC`
    );

    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Error fetching bills:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch bills' });
  }
});

// GET single bill by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const billResult = await query(
      'SELECT * FROM bills WHERE id = $1',
      [id]
    );

    if (billResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Bill not found' });
    }

    const parcelsResult = await query(
      `SELECT
        id, name, county, acres, use_type,
        ST_AsGeoJSON(geometry) as geometry
      FROM parcels
      WHERE bill_id = $1`,
      [id]
    );

    const bill = billResult.rows[0];
    bill.parcels = parcelsResult.rows.map(row => ({
      ...row,
      geometry: JSON.parse(row.geometry)
    }));

    res.json({ success: true, data: bill });
  } catch (error) {
    console.error('Error fetching bill:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch bill' });
  }
});

export default router;
