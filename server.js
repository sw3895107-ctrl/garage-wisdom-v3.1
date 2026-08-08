const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

app.get('/api/fixes', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM fixes ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve fixes' });
  }
});

app.post('/api/share-fix', async (req, res) => {
  const { user_name, user_email, code, vehicle, symptom, fix_story, cost_spent } = req.body;
  try {
    const query = `
      INSERT INTO submissions (user_name, user_email, code, vehicle, symptom, fix_story, cost_spent)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id;
    `;
    const values = [user_name, user_email, code, vehicle, symptom, fix_story, cost_spent];
    const result = await pool.query(query, values);
    res.status(201).json({ success: true, id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save submission' });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
