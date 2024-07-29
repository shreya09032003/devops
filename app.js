const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
};

let connection;
function handleDisconnect() {
  connection = mysql.createConnection(dbConfig);

  connection.connect(err => {
    if (err) {
      console.error('Error connecting to the database:', err);
      setTimeout(handleDisconnect, 2000);
    } else {
      console.log('Connected to database');
    }
  });

  connection.on('error', err => {
    console.error('Database error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/submit', (req, res) => {
  const { name, email } = req.body;
  const sql = 'INSERT INTO users (name, email) VALUES (?, ?)';
  connection.query(sql, [name, email], (err, result) => {
    if (err) throw err;
    res.send('User added to the database!');
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
