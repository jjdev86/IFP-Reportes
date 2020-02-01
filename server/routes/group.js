const router = require("express").Router();
const GroupController = require("../controllers/group");


router.patch('/change', GroupController.change_group);
router.delete("/report:id", GroupController.delete_group);
router.post("/new", GroupController.create_group);
router.get('/all', GroupController.get_groups);

module.exports = router;