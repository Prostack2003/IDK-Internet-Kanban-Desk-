const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('./kanban.db');

const initDatabase = () => {
    db.serialize(() => {
        // Включаем foreign keys
        db.run('PRAGMA foreign_keys = ON');

        db.run(`CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS boards (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          user_id INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT,
          status TEXT DEFAULT 'todo',
          user_id INTEGER,
          board_id INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
          FOREIGN KEY (board_id) REFERENCES boards (id) ON DELETE CASCADE
        )`);

        createAdminUser();
    });
};

const createAdminUser = () => {
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
                    function(err) {
                        if (err) {
                            console.error('Error creating admin user:', err);
                        } else {
                            const userId = this.lastID;
                            console.log('Admin user created: admin@kanban.ru / admin123');
                            createSampleTasks(userId);
                        }
                    }
                );
            });
        } else {
            console.log('Admin user already exists');
        }
    });
};

const createSampleTasks = (userId) => {
    db.run(
        'INSERT INTO boards (name, description, user_id) VALUES (?, ?, ?)',
        ['Разработка', 'Демо доска для примера работы с IKD', userId],
        function(err) {
            if (err) {
                console.error('Error creating demo board:', err);
                return;
            }

            const boardId = this.lastID;
            console.log(`Demo board created with ID: ${boardId}`);

            const sampleTasks = [
                {
                    title: 'Добро пожаловать в IKD!',
                    description: 'Здесь пишут описание задачи',
                    status: 'todo',
                    userId: userId,
                    boardId: boardId
                },
                {
                    title: 'Вы можете создать задачу!',
                    description: 'Нажмите кнопку "Создать задачу"',
                    status: 'inprogress',
                    userId: userId,
                    boardId: boardId
                },
                {
                    title: 'Или удалить задачу!',
                    description: 'Нажмите на задачу для удаления',
                    status: 'done',
                    userId: userId,
                    boardId: boardId
                }
            ];

            sampleTasks.forEach((task) => {
                db.run(
                    'INSERT INTO tasks (title, description, status, user_id, board_id) VALUES (?, ?, ?, ?, ?)',
                    [task.title, task.description, task.status, task.userId, task.boardId],
                    function(err) {
                        if (err) {
                            console.error('Error creating sample task:', err);
                        }
                    }
                );
            });

            console.log('Sample tasks created successfully');
        }
    );
};

// Обработка ошибок базы данных
db.on('error', (err) => {
    console.error('Database error:', err);
});

module.exports = { db, initDatabase };
