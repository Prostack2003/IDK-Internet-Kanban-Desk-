const express = require('express');
const { db } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
    db.all('SELECT * FROM boards WHERE user_id = ?', [req.user.userId], (err, boards) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(boards);
    });
});

router.post('/', authenticateToken, (req, res) => {
    const { name, description } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Board name is required' });
    }

    db.run(
        'INSERT INTO boards (name, description, user_id) VALUES (?, ?, ?)',
        [name, description, req.user.userId],
        function(err) {
            if (err) return res.status(500).json({ error: 'Database error' });

            db.get('SELECT * FROM boards WHERE id = ?', [this.lastID], (err, board) => {
                if (err) return res.status(500).json({ error: 'Database error' });
                res.json(board);
            });
        }
    );
});

// ... остальные роуты без изменений
router.get('/:boardId/tasks', authenticateToken, (req, res) => {
    const boardId = req.params.boardId;

    db.all(
        'SELECT * FROM tasks WHERE board_id = ? AND user_id = ?',
        [boardId, req.user.userId],
        (err, tasks) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json(tasks);
        }
    );
});

router.post('/:boardId/tasks', authenticateToken, (req, res) => {
    const { title, description, status } = req.body;
    const boardId = req.params.boardId;

    db.run(
        'INSERT INTO tasks (title, description, status, board_id, user_id) VALUES (?, ?, ?, ?, ?)',
        [title, description, status, boardId, req.user.userId],
        function(err) {
            if (err) return res.status(500).json({ error: 'Database error' });

            db.get('SELECT * FROM tasks WHERE id = ?', [this.lastID], (err, task) => {
                if (err) return res.status(500).json({ error: 'Database error' });
                res.json(task);
            });
        }
    );
});

router.delete('/:id', authenticateToken, (req, res) => {
    const boardId = req.params.id;

    db.get('SELECT * FROM boards WHERE id = ? AND user_id = ?', [boardId, req.user.userId], (err, board) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!board) return res.status(404).json({ error: 'Доска не найдена' });

        db.run('DELETE FROM tasks WHERE board_id = ?', [boardId], function(err) {
            if (err) return res.status(500).json({ error: 'Database error' });

            db.run('DELETE FROM boards WHERE id = ?', [boardId], function(err) {
                if (err) return res.status(500).json({ error: 'Database error' });
                res.json({ message: 'Доска и связанные задачи удалены' });
            });
        });
    });
});

module.exports = router;
