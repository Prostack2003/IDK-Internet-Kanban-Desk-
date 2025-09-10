const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./kanban.db');

db.serialize(() => {

    db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'todo',
    start_date DATETIME,     
    end_date DATETIME,      
    user_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    db.get("SELECT id FROM users WHERE email = 'admin@kanban.ru'", (err, row) => {
        if (err) {
            console.error('Error checking admin user:', err);
            return;
        }

        if (!row) {
            const adminPassword = 'admin123';
            bcrypt.hash(adminPassword, 10, (err, hashedPassword) => {
                if (err) {
                    console.error('Error hashing admin password:', err);
                    return;
                }

                db.run(
                    'INSERT INTO users (email, password) VALUES (?, ?)',
                    ['admin@kanban.ru', hashedPassword],
                    function (err) {
                        if (err) {
                            console.error('Error creating admin user:', err);
                        } else {
                            console.log('Admin user created: admin@kanban.ru / admin123');


                            const sampleTasks = [
                                ['Добро пожаловать в IDK!', 'Здесь пишут описание задачи', 'todo'],
                                ['Вы можете создать задачу!', 'Нажмите кнопочку создать', 'inprogress'],
                                ['Или удалить задачу!', 'Нажмите на задачу', 'done']
                            ];

                            sampleTasks.forEach(([title, description, status]) => {
                                db.run(
                                    'INSERT INTO tasks (title, description, status, user_id) VALUES (?, ?, ?, ?)',
                                    [title, description, status, this.lastID]
                                );
                            });
                        }
                    }
                );
            });
        }
    });
});


app.post('/api/register', async (req, res) => {
    const {email, password} = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run('INSERT INTO users (email, password) VALUES (?, ?)',
            [email, hashedPassword],
            function (err) {
                if (err) {
                    return res.status(400).json({error: 'User already exists'});
                }
                res.json({message: 'User created successfully'});
            }
        );
    } catch (error) {
        res.status(500).json({error: 'Server error'});
    }
});


app.post('/api/login', (req, res) => {
    const {email, password} = req.body;

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err || !user) {
            return res.status(400).json({error: 'Invalid credentials'});
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({error: 'Invalid credentials'});
        }

        const token = jwt.sign({userId: user.id}, JWT_SECRET);
        res.json({token, userId: user.id});
    });
});


const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({error: 'Access token required'});
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({error: 'Invalid token'});
        req.user = user;
        next();
    });
};


app.get('/api/tasks', authenticateToken, (req, res) => {
    db.all('SELECT * FROM tasks WHERE user_id = ?', [req.user.userId], (err, tasks) => {
        if (err) return res.status(500).json({error: 'Database error'});
        res.json(tasks);
    });
});


app.post('/api/tasks', authenticateToken, (req, res) => {
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


app.put('/api/tasks/:id', authenticateToken, (req, res) => {
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


app.delete('/api/tasks/:id', authenticateToken, (req, res) => {
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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
