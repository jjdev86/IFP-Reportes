var mysql = require("mysql");
var request = require("request"); // You might need to npm install the request module!
var expect = require("chai").expect;

describe("Persistent IFP Report server", function() {
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

  it("Should insert a user into server", function(done) {
    // Create a user in the server.
    request(
      {
        method: "POST",
        uri: "http://localhost:3000/user/new",
        json: {
            "email": "jvaladez@gmail.com",
            "password": "test1234",
            "role": "Admin",
            "first_name": "Jose",
            "last_name": "Valadez",
            "phone_number": "1234322345"
           }
      },
      function() {
        // Post a message to the node chat server:
        request(
          {
            method: "POST",
            uri: "http://localhost:3000/user/new",
            json: {
                "email": "nayecivic@gmail.com",
                "password": "test1234",
                "role": "Admin",
                "first_name": "Nayeli",
                "last_name": "Valadez",
                "phone_number": "1234322323"
               }
          },
          function() {
            // Now if we look in the database, we should find the
            // posted message there.

            // TODO: You might have to change this test to get all the data from
            // your message table, since this is schema-dependent.
            var queryString = "SELECT * FROM user";
            var queryArgs = [];

            dbConnection.query(queryString, queryArgs, function(err, results) {
              // Should have one result:
            //   console.log("***Test1***", results);
              expect(results.length).to.equal(2);

              // TODO: If you don't have a column named text, change this test.
              expect(results[0].email).to.equal(
                "jvaladez@gmail.com"
              );
              expect(results[1].email).to.equal(
                "nayecivic@gmail.com"
              );
              done();
            });
          }
        );
      }
    );
  });

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
