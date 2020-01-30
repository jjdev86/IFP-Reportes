var mysql = require("mysql");
var request = require("request"); // You might need to npm install the request module!
var expect = require("chai").expect;

describe("Saves Data to persistant DB", () => {
  var dbConnection;

  beforeEach((done) => {
    dbConnection = mysql.createConnection({
      user: "root",
      password: "",
      database: "gda"
    });
    dbConnection.connect();
    var tablename = "user"; // TODO: fill this out
    /* Empty the db table before each test so that multiple tests
     * (or repeated runs of the tests) won't screw each other up: */
    dbConnection.query("truncate " + tablename, done);
  });
  afterEach( () => {
    dbConnection.end();
  });

  it("Should insert a user into DB", (done) => {
    // Create a user in the server.
    let newUser = {
      email: "jvaladez@gmail.com",
      password: "test1234",
      role: "Admin",
      first_name: "Jose",
      last_name: "Valadez",
      phone_number: "1234322345"
    };
    dbConnection.query("INSERT INTO user SET ?", newUser, (err, results) => {
      dbConnection.query(
        "SELECT email, role, first_name, last_name, phone_number FROM user WHERE email = ?",
        newUser.email,
        (err, results) => {
          let user = results[0];
          expect(user.email).to.equal(newUser.email);
          expect(user.role).to.equal(newUser.role);
          expect(user.first_name).to.equal(newUser.first_name);
          expect(user.last_name).to.equal(newUser.last_name);
          expect(user.phone_number).to.equal(newUser.phone_number);
          done();
        }
      );
    });
  });

  it('only allows unique emails', (done) => {
    let newUser = {
      email: "jvaladez@gmail.com",
      password: "test1234",
      role: "Admin",
      first_name: "Jose",
      last_name: "Valadez",
      phone_number: "1234322345"
    };
    dbConnection.query('INSERT INTO user SET ?', newUser, (err, results) => {
      var sameUser = newUser;
      dbConnection.query('INSERT INTO user SET ?', sameUser, (err) => {
        expect(err).to.exist;
        expect(err.code).to.equal('ER_DUP_ENTRY');
        done();
      });
    });
  });
  it('should increment the id of new rows', (done) => {
    let newUser = {
      email: "jvaladez@gmail.com",
      password: "test1234",
      role: "Admin",
      first_name: "Jose",
      last_name: "Valadez",
      phone_number: "1234322345"
    };
    dbConnection.query('INSERT INTO user SET ?', newUser, (error, result) => {
      var newUserId = result.insertId;
      var otherUser = {
        email: "nayecivic@gmail.com",
        password: "test1234",
        role: "Admin",
        first_name: "Naye",
        last_name: "Valadez",
        phone_number: "1234322341"
      };
      dbConnection.query('INSERT INTO user SET ?', otherUser, (err, results) => {
        var userId = results.insertId;
        expect(userId).to.equal(newUserId + 1);
        done(error || err);
      });
    });
  });

  it('Deletes an existing user from DB', (done) => {
    let newUser = {
      email: "nayecivic@gmail.com",
      password: "test1234",
      role: "Admin",
      first_name: "Naye",
      last_name: "Valadez",
      phone_number: "1234322341"
    };
    dbConnection.query('INSERT INTO user SET ?', newUser, (err, results) => {
      let id = results.insertId;
      dbConnection.query(`DELETE FROM user WHERE id = ${id}`, (err, result) => {
        let rows = result;
        expect(rows.affectedRows).to.equal(1);
        done();
      });
    });
  });
  //   it("Should output all users from the DB", function(done) {
  //     let queryString = `SELECT * FROM user`;
  //     var queryArgs = [];

  //     dbConnection.query(queryString, queryArgs, function(err) {
  //       if (err) {
  //         throw err;
  //       }

  //       // query the server and see if it returns the users inserted
  //       request({
  //         method: "GET",
  //         uri: "http://localhost:3000/user/all"
  //       });
  //     });
  //   });

  //   it("Should output all messages from the DB", function(done) {
  //     // Let's insert a message into the db
  //     var queryString =
  //       'INSERT INTO messages (text, roomname, username) VALUES ("Men like you can never change!", "main", "Nick")';
  //     var queryArgs = [];
  //     // TODO - The exact query string and query args to use
  //     // here depend on the schema you design, so I'll leave
  //     // them up to you. */

  //     dbConnection.query(queryString, queryArgs, function(err) {
  //       if (err) {
  //         throw err;
  //       }

  //       // Now query the Node chat server and see if it returns
  //       // the message we just inserted:
  //       request("http://127.0.0.1:3000/classes/messages", function(
  //         error,
  //         response,
  //         body
  //       ) {
  //         var messageLog = JSON.parse(body);
  //         console.log("***Test2***", messageLog);
  //         expect(messageLog.results[0].text).to.equal(
  //           "Men like you can never change!"
  //         );
  //         expect(messageLog.results[0].roomname).to.equal("main");
  //         done();
  //       });
  //     });
  //   });
});
