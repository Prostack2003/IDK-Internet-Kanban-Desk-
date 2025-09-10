const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./kanban.db');

const initDatabase = () => {
    db.serialize(() => {

        db.run(`CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS boards (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          user_id INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )`);


        db.run(`CREATE TABLE IF NOT EXISTS tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT,
          status TEXT DEFAULT 'todo',
          start_date DATETIME,
          end_date DATETIME,
          user_id INTEGER,
          board_id INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id),
          FOREIGN KEY (board_id) REFERENCES boards (id)
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
            const bcrypt = require('bcryptjs');
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
                            console.log('Admin user created: admin@kanban.ru / admin123');
                            createSampleTasks(this.lastID);
                        }
                    }
                );
            });
        }
    });
};

const createSampleTasks = (userId) => {
    db.run(
        'INSERT INTO boards (name, description, user_id) VALUES (?, ?, ?)',
        ['Разработка', 'Описание доски', userId],
        function(err) {
            if (err) {
                console.error('Error creating demo board:', err);
                return;
            }

            const boardId = this.lastID;
            const sampleTasks = [
                ['Добро пожаловать в IDK!', 'Здесь пишут описание задачи', 'todo', boardId],
                ['Вы можете создать задачу!', 'Нажмите кнопочку создать', 'inprogress', boardId],
                ['Или удалить задачу!', 'Нажмите на задачу', 'done', boardId]
            ];

            sampleTasks.forEach(([title, description, status, boardId]) => {
                db.run(
                    'INSERT INTO tasks (title, description, status, user_id, board_id) VALUES (?, ?, ?, ?, ?)',
                    [title, description, status, userId, boardId]
                );
            });
        });
};

module.exports = { db, initDatabase };
