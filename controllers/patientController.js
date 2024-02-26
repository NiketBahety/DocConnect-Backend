const Patient = require("../models/patientModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllPatients = catchAsync(async (req, res, next) => {
  let patients = await Patient.find();

  res.status(200).json({
    status: "success",
    data: {
      patients,
    },
  });
});
