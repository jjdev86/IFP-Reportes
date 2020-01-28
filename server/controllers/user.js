const { createUser, validateUser } = require("../model/user");
const { encrypt, comparePassword } = require("../lib/bcrypt");

exports.create_user = async (req, res) => {
  // creates new user
  const hash = await encrypt(req.body.password);
  try {
    let user = ({ email, role, first_nae, last_name, phone_number } = req.body);
    user.password = hash;
    // insert records to db
    await createUser(user);
    res.status(201).json({
      message: "User created"
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err
    });
  }
};

exports.user_login = (req, res) => {
  // verify user login
};

exports.delete_user = (req, res) => {
  // delete user login
};
