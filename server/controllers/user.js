const { createUser, retrivePassword, deleteUser, allUsers } = require("../model/user");
const { encrypt, comparePassword } = require("../lib/bcrypt");

exports.create_user = async (req, res) => {
  // creates new user
  const hash = await encrypt(req.body.password);
  try {
    let user = ({ email, role, first_name, last_name, phone_number } = req.body);
    user.password = hash;
    // insert records to db
    await createUser(user);
    res.status(201).json({
      message: "User created"
    });
  } catch (err) {
    // console.log(err);
    res.status(500).json({
      error: err
    });
  }
};

exports.user_login = async (req, res) => {
  // get password from db
  let password = await retrivePassword(req.body);
  try {
    // compare user input to db password
    if (password) {
      let isAuthenticated = await comparePassword(req.body.password, password);
      if (isAuthenticated) {
        res.status(200).json({
          message: 'user aunthenticated'
        });
      } else {
        res.status(401).json({
          error: 'Invalid email address and password combination'
        });
      }
    } else {
      res.status(401).json({
        error: 'Invalid email address and password combination'
      });
    }
  }catch(err) {
    res.status(500).json({
      error: err
    });
  }

};

exports.delete_user = async (req, res) => {
  // delete user login
  let response = await deleteUser(Number(req.body.id));
  try {
    res.status(200).json({
      "status": {
        error: false,
        code: 200,
        type: "sucess",
        message: "Success"
      }
    });
  }catch(err) {
    res.status(500).json({
      error: err
    });
  }
};

exports.get_users = async (req, res) => {
  let users = await allUsers();
  try {
    res.status(200).json({
      "status": {
        error: false,
        code: 200,
        type: "sucess",
        message: "Success",
        data: users
      }
    });
  }catch(err) {
    res.status(500).json({
      error: err
    });
  }
}
