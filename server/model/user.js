const mysql = require("mysql");
const util = require("util"); // enable native async
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "gda"
});

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("Database connection was closed.");
    }
    if (err.code === "ER_CON_COUNT_ERROR") {
      console.error("Database has too many connections.");
    }
    if (err.code === "ECONNREFUSED") {
      console.error("Dabatase connection was refused.");
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
  // insert records to db
  const query = `INSERT INTO User (email, password, role, first_name, last_name, phone_number) VALUES ("${user.email}", "${user.password}","${user.role}","${user.first_name}", "${user.last_name}", "${user.phone_number}")`;
  console.log(query, `line 7`);

  const newUser = await pool.query(query);
  try {
    return newUser;
  } catch (err) {
    return err;
  }
};

const retrivePassword = async user => {
  // get password from db
  // SELECT CONVERT(column USING utf8)
  const query = `SELECT CONVERT (password USING utf8) password from User
                  WHERE email = '${user.email}'`;
  let hash = await pool.query(query);
  try {
    if (hash.length > 0) {
      return hash[0].password;
    } else {
      return hash = undefined;
    }
  }catch(err) {
    console.log(err);
    return err;
  }

};

const deleteUser = async id => {
  let isDeleted;
  let query = `DELETE FROM user
                WHERE id = ${id}`;
  let removed = await pool.query(query);
  // console.log(removed.affectedRows, `line 69`)
  if (removed.affectedRows == 1) {
    console.log(removed.affectedRows, `line 74`)
    isDeleted = true;
  } else {
    console.log(removed.affectedRows, `line 74`)
    isDeleted = false;
  }
  return isDeleted;
};

const allUsers = async () => {
  let query = 'SELECT email, role, first_name, last_name, phone_number FROM user';

  let users = await pool.query(query);
  try {
    return users;
  }catch(err) {
    return err;
  }
};

module.exports = {
  createUser,
  retrivePassword,
  deleteUser,
  allUsers
};
