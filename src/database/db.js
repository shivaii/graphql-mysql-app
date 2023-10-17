const mysql = require('mysql2/promise');

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nodegraphql',
});

module.exports = {
  query: pool.query.bind(pool),
};
