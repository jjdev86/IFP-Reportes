const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");
const util = require("util"); // enable native async

const userRoutes = require("./server/routes/user");
const reportRoutes = require("./server/routes/report");
const grouptRoutes = require('./server/routes/group');

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

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use("/user", userRoutes);
app.use('/report', reportRoutes);
app.use('/group', grouptRoutes)

app.use((req, res, next) => {
  const error = new Error("Route Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log("listening on ", port));

module.exports = pool;
