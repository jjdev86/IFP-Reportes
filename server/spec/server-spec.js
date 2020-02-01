var mysql = require("mysql");
var request = require("request"); // You might need to npm install the request module!
var expect = require("chai").expect;
var should = require("chai").should();
/************************************************************/
// Mocha doesn't have a way to designate pending before blocks.
// Mimic the behavior of xit and xdescribe with xbeforeEach.
// Remove the 'x' from beforeEach block when working on
// authentication tests.
/************************************************************/
let xbeforeEach = function() {};
/************************************************************/

describe("", function() {
  var dbConnection;

  beforeEach(function(done) {
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
  afterEach(function() {
    dbConnection.end();
  });

  describe("Saves to persistant DB:", function() {
    it("Should insert a user into DB", function(done){
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

    it("only allows unique emails", function(done){
      let newUser = {
        email: "jvaladez@gmail.com",
        password: "test1234",
        role: "Admin",
        first_name: "Jose",
        last_name: "Valadez",
        phone_number: "1234322345"
      };
      dbConnection.query("INSERT INTO user SET ?", newUser, (err, results) => {
        var sameUser = newUser;
        dbConnection.query("INSERT INTO user SET ?", sameUser, err => {
          expect(err).to.exist;
          expect(err.code).to.equal("ER_DUP_ENTRY");
          done();
        });
      });
    });
    it("should increment the id of new rows", function(done) {
      let newUser = {
        email: "jvaladez@gmail.com",
        password: "test1234",
        role: "Admin",
        first_name: "Jose",
        last_name: "Valadez",
        phone_number: "1234322345"
      };
      dbConnection.query("INSERT INTO user SET ?", newUser, (error, result) => {
        var newUserId = result.insertId;
        var otherUser = {
          email: "nayecivic@gmail.com",
          password: "test1234",
          role: "Admin",
          first_name: "Naye",
          last_name: "Valadez",
          phone_number: "1234322341"
        };
        dbConnection.query(
          "INSERT INTO user SET ?",
          otherUser,
          (err, results) => {
            var userId = results.insertId;
            expect(userId).to.equal(newUserId + 1);
            done(error || err);
          }
        );
      });
    });

    it("Deletes an existing user from DB", function(done) {
      let newUser = {
        email: "nayecivic@gmail.com",
        password: "test1234",
        role: "Admin",
        first_name: "Naye",
        last_name: "Valadez",
        phone_number: "1234322341"
      };
      dbConnection.query("INSERT INTO user SET ?", newUser, (err, results) => {
        let id = results.insertId;
        dbConnection.query(
          `DELETE FROM user WHERE id = ${id}`,
          (err, result) => {
            let rows = result;
            expect(rows.affectedRows).to.equal(1);
            done();
          }
        );
      });
    });

    it("Creates a new group", function(done) {
      
    });
  });

  // end of describe saves to persistant db

  describe("Account Creation:", function() {

    it("Admin creates a new user record", function(done) {
      let options = {
        method: "POST",
        uri: "http://localhost:3000/user/new",
        json: {
          email: "jstevens@gmail.com",
          password: "test1234",
          role: "Supervisor",
          first_name: "John",
          last_name: "Stevens",
          phone_number: "1234322345"
        }
      };

      request(options, function(error, res, body) {
        let queryString =
          'SELECT * FROM user where email = "jstevens@gmail.com"';
        dbConnection.query(queryString, function(err, rows) {
          if (err) {
            done(err);
          }
          let user = rows[0];
          expect(user).to.exist;
          expect(user.email).to.equal("jstevens@gmail.com");
          expect(user.role).to.equal("Supervisor");
          expect(user.first_name).to.equal("John");
          expect(user.last_name).to.equal("Stevens");
          done();
        });
      });
    });

    it("does not store the user's original text password", function(done) {
      let options = {
        method: "POST",
        uri: "http://localhost:3000/user/new",
        json: {
          email: "jstevens@gmail.com",
          password: "test1234",
          role: "Supervisor",
          first_name: "John",
          last_name: "Stevens",
          phone_number: "1234322345"
        }
      };

      request(options, function(error, res, body) {
        if (error) {
          return done(error);
        }
        var queryString =
          'SELECT password FROM user where email = "jstevens@gmail.com"';
        dbConnection.query(queryString, function(err, rows) {
          if (err) {
            return done(err);
          }
          var user = rows[0];
          expect(user.password).to.exist;
          expect(user.password).to.not.equal("test1234");
          done();
        });
      });
    });

    it("Authenticates a user", function(done) {
      let options = {
        method: "POST",
        uri: "http://localhost:3000/user/new",
        json: {
          email: "jstevens@gmail.com",
          password: "test1234",
          role: "Supervisor",
          first_name: "John",
          last_name: "Stevens",
          phone_number: "1234322345"
        }
      };
      let options2 = {
        method: "POST",
        uri: "http://localhost:3000/user/login",
        json: {
          email: "jstevens@gmail.com",
          password: "test1234"
        }
      };

      request(options, function(error, res, body) {
        if (error) {
          return done(error);
        }
        request(options2, function(err, response, resBody) {
          if (err) {
            return done(err);
          }
          // expect(response.headers.location).to.equal('/signup');
          // console.log(response.body, `line 211`)
          expect(response.body.message).to.equal("user aunthenticated");
          done();
        });
      });
    });

    xit("redirects to index after user is created", function(done) {
      var options = {
        method: "POST",
        uri: "http://127.0.0.1:4568/signup",
        json: {
          username: "Samantha",
          password: "Samantha"
        }
      };

      request(options, function(error, res, body) {
        if (error) {
          return done(error);
        }
        expect(res.headers.location).to.equal("/");
        done();
      });
    });
  });

  describe('Create Group', function() {

    it('Creates a new group', function(done) {
      //supervisor has access to create a group with a leader and subleader
      
    });

    it('')
  });
});
