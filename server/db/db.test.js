const { createUser, validateUser } = require("./db");

const user = {};
    user.email = 'jtest@gmail.com'
    // user.password = 'Ha8ladz';
    user.password = 'Ha8Ladz'
    user.role = 'Admin';
    user.firstName = 'Jose';
    user.lastName = 'Vtest';
    user.phoneNumber = '9113451234';



// createUser(user);

validateUser(user)

