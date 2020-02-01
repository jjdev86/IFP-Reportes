const GroupModel = require("../model/group");

exports.change_group = async (req, res) => {};
exports.delete_group = async (req, res) => {};
exports.create_group = async (req, res) => {
  // call createGroup from model
  if (req.body.group_name === undefined) {
    res.status(400).json({
        message: 'group_name is undefined'
    })
  }else  {
      try {
        let response = await GroupModel.createGroup(req.body.group_name);
        console.log(response, `line 14`)
        // check if gruop was previously added
        if (response.code !== 'ER_DUP_ENTRY') {
            res.status(201).json({
              message: "Group created"
            });
        } else {
            res.status(400).json({
                message: 'duplicate group name'
            })
        }
      } catch (err) {
          console.log(err)
        res.status(500).json({
          error: err
        });
      }

  }
};
exports.get_groups = (req, res) => {};


