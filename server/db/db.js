const mysql = require('mysql');
const util = require('util'); // enable native async
const { encrypt, comparePassword } = require('../lib/bcrypt');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gda'
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
// promisify all queries to enable async/await
pool.query = util.promisify(pool.query);

// createUser take a user object
const createUser = async user => {
    // call encrypt with user.password
    const hash = await encrypt(user.password);

    try {
        // insert records to db
        const query = `INSERT INTO User (email, password, role, first_name, last_name, phone_number) VALUES ("${user.email}", "${hash}","${user.role}","${user.firstName}", "${user.lastName}", "${user.phoneNumber}")`;
        const newUser = await pool.query(query)
        return newUser;
    }catch(err) {
        // console.log(err)
        return err;
    }

};

const validateUser = async user => {
    // get password from db
    // SELECT CONVERT(column USING utf8)
    const query = `SELECT CONVERT (password USING utf8) password from User
                    WHERE email = '${user.email}'`;
    const hash = await pool.query(query);

      // compare and validate
    try {
        if (comparePassword(user.password, hash[0].password)) {
            console.log(`validated`)
        } else {
            console.log('password not valid')
        }
    }catch(err) {
        console.log(err);
    }

};


module.exports = {
    createUser,
    validateUser,
    pool
}