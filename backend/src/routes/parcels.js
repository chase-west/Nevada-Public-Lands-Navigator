import express from 'express';
import { query } from '../config/database.js';

const router = express.Router();

// GET all parcels with optional filtering
router.get('/', async (req, res) => {
  try {
    const { county, bill_id, use_type, bounds } = req.query;

    let queryText = `
      SELECT
        p.id,
        p.name,
        p.county,
        p.acres,
        p.use_type,
        p.bill_id,
        ST_AsGeoJSON(p.geometry) as geometry,
        b.name as bill_name,
        b.status as bill_status
      FROM parcels p
      LEFT JOIN bills b ON p.bill_id = b.id
      WHERE 1=1
    `;

    const params = [];
    let paramCount = 1;

    if (county) {
      queryText += ` AND p.county = $${paramCount}`;
      params.push(county);
      paramCount++;
    }

    if (bill_id) {
      queryText += ` AND p.bill_id = $${paramCount}`;
      params.push(bill_id);
      paramCount++;
    }

    if (use_type) {
      queryText += ` AND p.use_type = $${paramCount}`;
      params.push(use_type);
      paramCount++;
    }

    // Spatial filtering by map bounds
    if (bounds) {
      const [minLng, minLat, maxLng, maxLat] = bounds.split(',').map(Number);
      queryText += ` AND ST_Intersects(
        p.geometry,
        ST_MakeEnvelope($${paramCount}, $${paramCount + 1}, $${paramCount + 2}, $${paramCount + 3}, 4326)
      )`;
      params.push(minLng, minLat, maxLng, maxLat);
    }

    queryText += ' ORDER BY p.name';

    const result = await query(queryText, params);

    const parcels = result.rows.map(row => ({
      ...row,
      geometry: JSON.parse(row.geometry)
    }));

    res.json({ success: true, count: parcels.length, data: parcels });
  } catch (error) {
    console.error('Error fetching parcels:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch parcels' });
  }
});

// GET single parcel by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT
        p.*,
        ST_AsGeoJSON(p.geometry) as geometry,
        b.name as bill_name,
        b.number as bill_number,
        b.status as bill_status,
        b.summary as bill_summary,
        b.url as bill_url
      FROM parcels p
      LEFT JOIN bills b ON p.bill_id = b.id
      WHERE p.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Parcel not found' });
    }

    const parcel = {
      ...result.rows[0],
      geometry: JSON.parse(result.rows[0].geometry)
    };

    res.json({ success: true, data: parcel });
  } catch (error) {
    console.error('Error fetching parcel:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch parcel' });
  }
});

export default router;
