const bcrypt = require("bcrypt");
const saltRounds = 10;

const encrypt = async password => {
  console.log("received request to encrypt");
  const hash = await bcrypt.hash(password, saltRounds);
  try {
    return hash;
  } catch (err) {
    console.log(err);
  }
  //    return hash;
};

const comparePassword = async (password, hash) => {
  const match = await bcrypt.compare(password, hash);
  return match;
};

const newUser = async (email, password, role, firstName, lastName, phone) => {
  const hash = await encrypt(password);
  console.log(hash);
  return hash;
};

module.exports = {
  encrypt,
  comparePassword,
  newUser
};
