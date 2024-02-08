const express = require("express");
const doctorController = require("../controllers/doctorController");

const router = express.Router();

router.get("/", doctorController.getAllDoctors);

module.exports = router;
