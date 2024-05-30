const express = require('express');
const pg = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');
const port = 8080;
const app = express();

app.use(cors());
app.use(bodyParser.json());

const connection = new pg.Client({
    host: 'localhost',
    user: 'postgres',
    password: 'root',
    database: 'postgres'
});

connection.connect(err => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err);
    } else {
        console.log('База данных подключена');
    }
});

// Обработчик маршрута для получения данных из базы данных
app.get('/', (req, res) => {
    connection.query('SELECT * FROM todolist', (err, result) => {
        if (err) {
            console.error('Ошибка выполнения запроса:', err);
            res.status(500).json({ error: 'Ошибка сервера' });
        } else {
            res.json(result.rows); // Отправляем данные в виде JSON-ответа
        }
    });
});

app.post('/', (req, res) => {
    const { id, task, isDone } = req.body;
    const data = [id, task, isDone];
    connection.query('INSERT INTO todolist (id, task, isdone) VALUES ($1, $2, $3)', data, (err, results) => {
        if (err) {
            console.error('Ошибка выполнения запроса:', err);
            res.status(500).json({ error: 'Ошибка сервера' });
        } else {
            res.json({ message: 'Данные успешно добавлены' });
            console.log(results)
        }
    });
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});

// Закрытие соединения с базой данных при завершении работы сервера
process.on('SIGINT', () => {
    connection.end();
    process.exit(0);
});
