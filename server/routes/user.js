const router = require("express").Router();
const UserController = require("../controllers/user");

router.post("/login", UserController.user_login);
router.delete("/user:id", UserController.delete_user);
router.post("/new", UserController.create_user);

module.exports = router;
