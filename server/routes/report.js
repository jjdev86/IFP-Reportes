const router = require("express").Router();
const ReportController = require("../controllers/report");


router.patch('/change', ReportController.change_report);
router.delete("/report:id", ReportController.delete_report);
router.post("/new", ReportController.create_report);
router.get('/all', ReportController.get_reports);

module.exports = router;