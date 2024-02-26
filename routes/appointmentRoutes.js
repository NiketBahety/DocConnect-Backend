const express = require("express");
const appointmentController = require("../controllers/appointmentController");

const router = express.Router();

router.post("/bookAppointment", appointmentController.bookAppointment);
router.post("/verifyPayment", appointmentController.verifyPayment);
router.get("/", appointmentController.getAppointment);

module.exports = router;
