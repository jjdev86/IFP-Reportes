const pool = require("../db/db").pool;

// const createGroup = async group => {
//     // let query = `INSERT INTO grupo SET ?`;
//     let query = `INSERT INTO grupo (group_name) VALUES("${group}")`;
//     console.log(group, `line 6 model`)
//     // let response = await pool.query(query);
//     pool.query(query, (err, response) => {
//         console.log(err, `line 9 model`)
//         if (err) { return err;}
//         console.log(response, `line 11 model`)
//         return response;
//     });
//     // console.log(response, `line 7`)
//     // try {
//     //     console.log(response, `line 8`)
//     //     return response;
//     // }catch(err) {
//     //     console.log(err, 'line 11')
//     //     return err;
//     // }
// };
exports.createGroup = async group => {
    let isPresent = await pool.query(`SELECT group_name FROM grupo WHERE group_name = "${group}"`);
    
  try {
    let query = `INSERT INTO grupo (group_name) VALUES("${group}")`;
    let response = await pool.query(query);

    return response;
  } catch (err) {
      console.log(err)
    return err;
  }
};

// module.exports = {
//     createGroup
// }
