const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/admin/login", authController.adminLogin);
router.post("/doctor/login", authController.doctorLogin);
router.post("/patient/login", authController.patientLogin);

router.post("/admin/signup", authController.adminSignup);
router.post("/doctor/signup", authController.doctorSignup);
router.post("/patient/signup", authController.patientSignup);

module.exports = router;
