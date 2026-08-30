const express = require('express');
const router  = express.Router();
const db      = require('../db');

// ─────────────────────────────────────────────────────────────
//  HELPER — promisify db.query
// ─────────────────────────────────────────────────────────────
function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

// ─────────────────────────────────────────────────────────────
//  MENTOR ROUTES
// ─────────────────────────────────────────────────────────────

// GET /api/tasks/stats
router.get('/stats', async (req, res) => {
  try {
    const [[totalRow], [pendingRow], [completedRow], [internsRow]] = await Promise.all([
      query('SELECT COUNT(*) AS total FROM tasks'),
      query("SELECT COUNT(*) AS pending FROM tasks WHERE status IN ('pending','in-progress')"),
      query("SELECT COUNT(*) AS completed FROM tasks WHERE status = 'completed'"),
      query("SELECT COUNT(*) AS interns FROM users WHERE role = 'intern'")
    ]);

    res.json({
      success: true,
      stats: {
        total:     totalRow.total,
        pending:   pendingRow.pending,
        completed: completedRow.completed,
        interns:   internsRow.interns
      }
    });
  } catch (err) {
    console.error('GET /stats error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/tasks/interns-list
router.get('/interns-list', async (req, res) => {
  try {
    const rows = await query("SELECT id, name FROM users WHERE role = 'intern' ORDER BY name");
    res.json({ success: true, interns: rows });
  } catch (err) {
    console.error('GET /interns-list error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/tasks — all tasks with intern name
router.get('/', async (req, res) => {
  try {
    const tasks = await query(`
      SELECT
        t.id,
        t.title,
        t.description,
        t.priority,
        t.category,
        t.status,
        t.deadline,
        t.created_at,
        u.name AS intern_name
      FROM tasks t
      JOIN users u ON t.intern_id = u.id
      ORDER BY t.created_at DESC
    `);
    res.json({ success: true, tasks });
  } catch (err) {
    console.error('GET /tasks error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/tasks — assign task to one or more interns
router.post('/', async (req, res) => {
  const { internNames, title, description, priority, category, deadline } = req.body;

  if (!internNames || !Array.isArray(internNames) || internNames.length === 0) {
    return res.status(400).json({ success: false, message: 'internNames[] is required and must not be empty' });
  }
  if (!title || !title.trim()) {
    return res.status(400).json({ success: false, message: 'title is required' });
  }

  try {
    const created = [];

    for (const rawName of internNames) {
      const name = rawName.trim();

      const rows = await query(
        "SELECT id, name FROM users WHERE TRIM(name) = ? AND role = 'intern' LIMIT 1",
        [name]
      );

      if (!rows.length) {
        console.warn(`⚠ Intern "${name}" not found. Auto-inserting…`);
        const insertResult = await query(
          "INSERT INTO users (name, email, role, password) VALUES (?, ?, 'intern', 'placeholder')",
          [name, name.toLowerCase().replace(/\s+/g, '') + '@intern.local']
        );
        rows.push({ id: insertResult.insertId, name });
      }

      const internId = rows[0].id;

      const result = await query(
        `INSERT INTO tasks (intern_id, title, description, priority, category, status, deadline)
         VALUES (?, ?, ?, ?, ?, 'pending', ?)`,
        [
          internId,
          title.trim(),
          description?.trim() || '',
          priority || 'medium',
          category || 'js',
          deadline || null
        ]
      );

      created.push({ id: result.insertId, internName: name, internId });
      console.log(`✅ Task "${title}" assigned to ${name} (user id: ${internId}), task id: ${result.insertId}`);
    }

    res.json({ success: true, created });

  } catch (err) {
    console.error('POST /tasks error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/tasks/:id/complete
router.patch('/:id/complete', async (req, res) => {
  try {
    await query("UPDATE tasks SET status = 'completed' WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('PATCH complete error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
  try {
    await query('DELETE FROM tasks WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE task error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
//  INTERN ROUTES
// ─────────────────────────────────────────────────────────────

// GET /api/tasks/intern/:internId — all tasks for a specific intern
router.get('/intern/:internId', async (req, res) => {
  try {
    const tasks = await query(
      `SELECT id, title, description, deliverables, expectations, notes,
              status, due_date, created_at, is_final
       FROM tasks
       WHERE intern_id = ?
       ORDER BY is_final DESC, created_at ASC`,
      [req.params.internId]
    );
    res.json(tasks);
  } catch (err) {
    console.error('GET /intern/:internId error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/tasks/status/:taskId — update task status (intern mark complete)
router.put('/status/:taskId', (req, res) => {
  const { taskId } = req.params;
  const { status  } = req.body;

  const allowed = ['pending', 'in_progress', 'completed'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status value' });
  }

  db.query(
    'UPDATE tasks SET status = ? WHERE id = ?',
    [status, taskId],
    (err, result) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Task not found' });
      res.json({ success: true, message: 'Status updated' });
    }
  );
});

module.exports = router;