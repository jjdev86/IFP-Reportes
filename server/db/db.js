const mysql = import('mysql');
const util = require('util'); // enable native async
const { encrypt, comparePassword } = require('../lib/bcrypt');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'GDA'
  });
  
  pool.getConnection((err, connection) => {
    if (err) {
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.error('Database connection was closed.');
      }
      if (err.code === 'ER_CON_COUNT_ERROR') {
        console.error('Database has too many connections.');
      }
      if (err.code === 'ECONNREFUSED') {
        console.error('Dabatase connection was refused.');
      }
      if (connection) {
        connection.release();
      }
      return;
    }
});

// createUser take a user object
const createUser = async user => {
    // user.email
    // user.password
    // user.role
    // user.firstName
    // user.lastName
    // user.phoneNumber

    // call encrypt with user.password
    const hash = await encrypt(user.password);
    
    // insert records to db
    const query = `INSERT INTO User VALUES (${user.email}, ${hash},${user.role},${user.firstName}, ${user.lastName}, ${user.phoneNumber})`;

    
};

// promisify all queries to enable async/await
pool.query = util.promisify(pool.query);