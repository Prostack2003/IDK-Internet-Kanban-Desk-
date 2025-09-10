const express = require('express');
const { db } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
    db.all('SELECT * FROM tasks WHERE user_id = ?', [req.user.userId], (err, tasks) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(tasks);
    });
});

router.post('/', authenticateToken, (req, res) => {
    const { title, description, status, startDate, endDate } = req.body;

    db.run(
        'INSERT INTO tasks (title, description, status, start_date, end_date, user_id) VALUES (?, ?, ?, ?, ?, ?)',
        [title, description, status, startDate, endDate, req.user.userId],
        function(err) {
            if (err) return res.status(500).json({ error: 'Database error' });

            db.get('SELECT * FROM tasks WHERE id = ?', [this.lastID], (err, task) => {
                if (err) return res.status(500).json({ error: 'Database error' });
                res.json(task);
            });
        }
    );
});

router.put('/:id', authenticateToken, (req, res) => {
    const { title, description, status } = req.body;
    const taskId = req.params.id;

    db.run(
        'UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ? AND user_id = ?',
        [title, description, status, taskId, req.user.userId],
        function(err) {
            if (err) return res.status(500).json({ error: 'Database error' });

            if (this.changes === 0) {
                return res.status(404).json({ error: 'Task not found' });
            }

            db.get('SELECT * FROM tasks WHERE id = ?', [taskId], (err, task) => {
                if (err) return res.status(500).json({ error: 'Database error' });
                res.json(task);
            });
        }
    );
});

router.delete('/:id', authenticateToken, (req, res) => {
    const taskId = req.params.id;

    db.run(
        'DELETE FROM tasks WHERE id = ? AND user_id = ?',
        [taskId, req.user.userId],
        function(err) {
            if (err) return res.status(500).json({ error: 'Database error' });

            if (this.changes === 0) {
                return res.status(404).json({ error: 'Task not found' });
            }

            res.json({ message: 'Task deleted successfully' });
        }
    );
});

module.exports = router;
