const express = require('express');
const router  = express.Router();
const db      = require('../db');

const dbp = db.promise();

/* ─────────────────────────────────────────────────────────────
   DAILY AUTO-UPDATE LOGIC
   Every midnight (server time) any intern with no record for
   the new day gets automatically marked as 'red' (absent).
───────────────────────────────────────────────────────────── */
let lastAutoUpdateDate = null;

async function autoMarkAbsentForToday() {
  const today = getTodayStr();
  if (lastAutoUpdateDate === today) return; // already ran for today
  lastAutoUpdateDate = today;

  try {
    const [interns] = await dbp.query(
      `SELECT id FROM users WHERE role = 'intern'`
    );

    const [existing] = await dbp.query(
      `SELECT intern_id FROM attendance WHERE date = ?`, [today]
    );

    const existingIds   = new Set(existing.map(r => r.intern_id));
    const absentInterns = interns.filter(i => !existingIds.has(i.id));

    if (absentInterns.length === 0) return;

    for (const intern of absentInterns) {
      await dbp.query(
        `INSERT IGNORE INTO attendance (intern_id, date, status, timeline, acts)
         VALUES (?, ?, 'red', '00000000', '')`,
        [intern.id, today]
      );
    }

    console.log(`[AutoMark] ${today}: Marked ${absentInterns.length} interns as absent.`);
  } catch (err) {
    console.error('[AutoMark] Error:', err.message);
  }
}

// Returns today's date as "YYYY-MM-DD" in the server's LOCAL timezone
function getTodayStr() {
  const now = new Date();
  const y   = now.getFullYear();
  const m   = String(now.getMonth() + 1).padStart(2, '0');
  const d   = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Returns yesterday's date as "YYYY-MM-DD" in the server's LOCAL timezone
function getYesterdayStr() {
  const now = new Date();
  now.setDate(now.getDate() - 1);
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Schedule to run at midnight every day
function scheduleMidnightTask() {
  const now      = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 1, 0); // next midnight + 1 second
  const msUntil  = midnight - now;

  setTimeout(() => {
    autoMarkAbsentForToday();
    scheduleMidnightTask(); // reschedule for next midnight
  }, msUntil);

  console.log(`[AutoMark] Next run in ${Math.round(msUntil / 60000)} minutes.`);
}
scheduleMidnightTask();

/* ─────────────────────────────────────────────────────────────
   GET /api/attendance/day?date=YYYY-MM-DD
   Returns all interns' attendance for a given date.
   Only today and yesterday are valid. Rejects anything older.
───────────────────────────────────────────────────────────── */
router.get('/day', async (req, res) => {
  const date = req.query.date;
  if (!date) return res.status(400).json({ success: false, message: 'date is required' });

  const todayStr     = getTodayStr();
  const yesterdayStr = getYesterdayStr();

  // Reject dates that are not today or yesterday
  if (date !== todayStr && date !== yesterdayStr) {
    return res.status(400).json({
      success: false,
      message: `Only today (${todayStr}) and yesterday (${yesterdayStr}) are accessible.`
    });
  }

  // Trigger auto-mark if this is today and it hasn't run yet
  if (date === todayStr) await autoMarkAbsentForToday();

  try {
    const [interns] = await dbp.query(
      `SELECT id, name FROM users WHERE role = 'intern' ORDER BY id`
    );

    const [records] = await dbp.query(
      `SELECT * FROM attendance WHERE date = ?`, [date]
    );

    const [events] = await dbp.query(
      `SELECT * FROM attendance_events WHERE date = ? ORDER BY event_time ASC`, [date]
    );

    const result = interns.map(intern => {
      const rec  = records.find(r => r.intern_id === intern.id);
      const evts = events
        .filter(e => e.intern_id === intern.id)
        .map(e => ({ t: e.event_time, label: e.label, c: e.color }));

      // timeline stored as "10110000" string → array of ints
      const timelineArr = rec && rec.timeline
        ? rec.timeline.toString().split('').map(Number)
        : [0,0,0,0,0,0,0,0];

      return {
        intern_id:   intern.id,
        name:        intern.name,
        status:      rec ? rec.status : 'red',
        timeline:    timelineArr,
        acts:        rec ? (rec.acts || '').split(',').filter(Boolean) : [],
        events:      evts,
        weekHistory: [] // filled by /week endpoint
      };
    });

    res.json({ success: true, date, data: result });
  } catch (err) {
    console.error('GET /attendance/day error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─────────────────────────────────────────────────────────────
   GET /api/attendance/week?end=YYYY-MM-DD
   CHANGED: Now returns ONLY 2 days — yesterday + today.
   'end' defaults to today. The window is always exactly 2 days.
   This powers the 2-day heatmap on the frontend.
───────────────────────────────────────────────────────────── */
router.get('/week', async (req, res) => {
  try {
    // Parse end date in local time to avoid UTC shift issues
    let end;
    if (req.query.end) {
      const [y, m, d] = req.query.end.split('-').map(Number);
      end = new Date(y, m - 1, d);
    } else {
      end = new Date();
    }

    // Build ONLY 2 dates: yesterday and today (relative to `end`)
    // i=1 → yesterday, i=0 → today/end
    const dates = [];
    for (let i = 1; i >= 0; i--) {
      const d  = new Date(end);
      d.setDate(d.getDate() - i);
      const y  = d.getFullYear();
      const mo = String(d.getMonth() + 1).padStart(2, '0');
      const dy = String(d.getDate()).padStart(2, '0');
      dates.push(`${y}-${mo}-${dy}`);
    }
    // dates[0] = yesterday, dates[1] = today

    const [interns] = await dbp.query(
      `SELECT id, name FROM users WHERE role = 'intern' ORDER BY id`
    );

    const [records] = await dbp.query(
      `SELECT intern_id, date, status FROM attendance WHERE date IN (?)`,
      [dates]
    );

    const result = interns.map(intern => {
      const history = dates.map(date => {
        const recDate = records.find(r => {
          // Normalise date field whether it's a Date object or string
          const rDate = r.date instanceof Date
            ? `${r.date.getFullYear()}-${String(r.date.getMonth()+1).padStart(2,'0')}-${String(r.date.getDate()).padStart(2,'0')}`
            : String(r.date).slice(0, 10);
          return r.intern_id === intern.id && rDate === date;
        });

        if (!recDate)                    return 'r'; // no record = absent
        if (recDate.status === 'green')  return 'g';
        if (recDate.status === 'yellow') return 'y';
        return 'r';
      });

      return { intern_id: intern.id, name: intern.name, weekHistory: history };
    });

    res.json({ success: true, dates, data: result });
  } catch (err) {
    console.error('GET /attendance/week error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─────────────────────────────────────────────────────────────
   POST /api/attendance/mark
   Body: { intern_id, date, status, timeline, acts, events }
   Only allows marking for today or yesterday.
───────────────────────────────────────────────────────────── */
router.post('/mark', async (req, res) => {
  const { intern_id, date, status, timeline, acts, events } = req.body;

  if (!intern_id || !date || !status) {
    return res.status(400).json({ success: false, message: 'intern_id, date, status required' });
  }

  const todayStr     = getTodayStr();
  const yesterdayStr = getYesterdayStr();

  // Only allow marking today or yesterday
  if (date !== todayStr && date !== yesterdayStr) {
    return res.status(400).json({
      success: false,
      message: `Can only mark attendance for today (${todayStr}) or yesterday (${yesterdayStr}).`
    });
  }

  // Accept timeline as array [1,0,1...] or string "10100000"
  const timelineStr = Array.isArray(timeline)
    ? timeline.join('')
    : (timeline || '00000000');

  const actsStr = Array.isArray(acts) ? acts.join(',') : (acts || '');

  try {
    await dbp.query(
      `INSERT INTO attendance (intern_id, date, status, timeline, acts)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         status   = VALUES(status),
         timeline = VALUES(timeline),
         acts     = VALUES(acts)`,
      [intern_id, date, status, timelineStr, actsStr]
    );

    await dbp.query(
      `DELETE FROM attendance_events WHERE intern_id = ? AND date = ?`,
      [intern_id, date]
    );

    if (Array.isArray(events) && events.length > 0) {
      const rows = events.map(e => [
        intern_id, date,
        e.t || e.event_time,
        e.label,
        e.c || e.color || 'green'
      ]);
      await dbp.query(
        `INSERT INTO attendance_events (intern_id, date, event_time, label, color) VALUES ?`,
        [rows]
      );
    }

    res.json({ success: true, message: 'Attendance saved' });
  } catch (err) {
    console.error('POST /attendance/mark error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─────────────────────────────────────────────────────────────
   POST /api/attendance/seed
   Bulk-save a full day's data from the frontend hardcoded array.
   Body: { date: "YYYY-MM-DD", interns: [...] }

   CHANGED:
   - Only accepts today or yesterday as the target date.
   - Yesterday seed must have mixed statuses (not all-absent).
     The server validates that it receives at least one non-red
     status for the yesterday date before inserting.
   - Uses INSERT IGNORE so real intern activity is never overwritten.
───────────────────────────────────────────────────────────── */
router.post('/seed', async (req, res) => {
  const { date, interns } = req.body;

  if (!date || !Array.isArray(interns)) {
    return res.status(400).json({ success: false, message: 'date and interns[] required' });
  }

  const todayStr     = getTodayStr();
  const yesterdayStr = getYesterdayStr();

  // Only allow seeding today or yesterday
  if (date !== todayStr && date !== yesterdayStr) {
    return res.status(400).json({
      success: false,
      message: `Seed only allowed for today (${todayStr}) or yesterday (${yesterdayStr}). Got: ${date}`
    });
  }

  // For yesterday: validate the seed has mixed statuses, not all-absent
  if (date === yesterdayStr) {
    const nonRed = interns.filter(i => i.status && i.status !== 'red');
    if (nonRed.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Yesterday seed must contain at least one non-absent intern (green or yellow).'
      });
    }
  }

  try {
    let seeded = 0;

    for (const intern of interns) {
      const timelineStr = Array.isArray(intern.timeline)
        ? intern.timeline.join('')
        : (intern.timeline || '00000000');

      const actsStr = Array.isArray(intern.acts)
        ? intern.acts.join(',')
        : (intern.acts || '');

      // INSERT IGNORE: never overwrite data that was already written by real intern activity
      const [result] = await dbp.query(
        `INSERT IGNORE INTO attendance (intern_id, date, status, timeline, acts)
         VALUES (?, ?, ?, ?, ?)`,
        [intern.id, date, intern.status, timelineStr, actsStr]
      );

      if (result.affectedRows > 0) {
        // Only insert events if we actually inserted the main row
        if (Array.isArray(intern.events) && intern.events.length > 0) {
          const rows = intern.events.map(e => [
            intern.id, date,
            e.t || e.event_time,
            e.label,
            e.c || e.color || 'green'
          ]);
          await dbp.query(
            `INSERT IGNORE INTO attendance_events (intern_id, date, event_time, label, color) VALUES ?`,
            [rows]
          );
        }
        seeded++;
      }
    }

    res.json({
      success: true,
      message: `Seeded ${seeded} new intern records for ${date} (${interns.length - seeded} already existed, left untouched)`
    });
  } catch (err) {
    console.error('POST /attendance/seed error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─────────────────────────────────────────────────────────────
   GET /api/attendance/status
   Quick endpoint to get today's and yesterday's date on the server.
   Useful for debugging timezone issues.
───────────────────────────────────────────────────────────── */
router.get('/status', (req, res) => {
  res.json({
    success:            true,
    server_date:        getTodayStr(),
    server_yesterday:   getYesterdayStr(),
    server_time:        new Date().toISOString(),
    last_auto_update:   lastAutoUpdateDate,
    accessible_dates:   [getYesterdayStr(), getTodayStr()],
  });
});

/* ─────────────────────────────────────────────────────────────
   Legacy routes kept for compatibility
───────────────────────────────────────────────────────────── */
router.get('/intern/:id', (req, res) => {
  db.query(
    'SELECT * FROM attendance WHERE intern_id = ? ORDER BY date DESC',
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

router.get('/all', (req, res) => {
  db.query(
    `SELECT attendance.*, users.name AS intern_name
     FROM attendance
     JOIN users ON attendance.intern_id = users.id
     ORDER BY date DESC`,
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

module.exports = router;