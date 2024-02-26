const express = require("express");
const profileController = require("../controllers/profileController");

const router = express.Router();

router.get("/patient", profileController.getPatient);
router.get("/doctor", profileController.getDoctor);
router.get("/admin", profileController.getAdmin);

module.exports = router;
