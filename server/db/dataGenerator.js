const bcrypt = require("bcrypt");
const saltRounds = 10;
const pw1 = 'hello1';
const pw2 = 'hello*}!';

let pw1hashed;
let pw2hashed; 

const encrypt = async password => {
   const hash = await bcrypt.hash(password, saltRounds);
   return hash;
};

const comparePass = async (password, hash) => {
    const match = await bcrypt.compare(password, pw1hashed);
    console.log('is a match', match);
}

const newUser = async (email, password, role, firstName, lastName, phone) => {
    const hash = await encrypt(password);
    console.log(hash);
    // pw1hashed = hash;
};

// newUser('jvala@gmail.com', pw1, 'Admin', 'Jose', 'Valadez', '9166040819');
comparePass(pw1, pw1hashed);

// newUser('jvala@gmail.com', pw2, 'Admin', 'Jose', 'Valadez', '9166040819');
