const router = require('express').Router();
const pool = require('../config/db');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Create Incident
router.post('/', verifyToken, async (req, res) => {
    const { title, description, contact } = req.body;
    await pool.query(
        "INSERT INTO incidents (user_id, title, description, contact) VALUES ($1, $2, $3, $4)",
        [req.user.id, title, description, contact]
    );
    res.json({ message: "Incident submitted" });
});

// Get My Incidents (User)
router.get('/my', verifyToken, async (req, res) => {
    const data = await pool.query("SELECT * FROM incidents WHERE user_id = $1", [req.user.id]);
    res.json(data.rows);
});

// Get All Incidents (Admin)
router.get('/all', verifyToken, isAdmin, async (req, res) => {
    const data = await pool.query(`
        SELECT incidents.*, users.full_name, users.email 
        FROM incidents JOIN users ON incidents.user_id = users.id
    `);
    res.json(data.rows);
});

// Update Status (Admin)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
    const { status } = req.body;
    await pool.query("UPDATE incidents SET status = $1 WHERE id = $2", [status, req.params.id]);
    res.json({ message: "Status updated" });
});

module.exports = router;