const Patient = require("../models/patientModel");
const Doctor = require("../models/doctorModel");
const Admin = require("../models/adminModel");
const catchAsync = require("../utils/catchAsync");

exports.getPatient = catchAsync(async (req, res, next) => {
  const patient = await Patient.findById(req.query.id).populate({
    path: "appointments",
    populate: {
      path: "doctor",
    },
  });
  res.status(200).json({
    status: "success",
    data: {
      patient,
    },
  });
});

exports.getDoctor = catchAsync(async (req, res, next) => {
  const doctor = await Doctor.findById(req.query.id).populate({
    path: "appointments",
    populate: {
      path: "patient",
    },
  });
  res.status(200).json({
    status: "success",
    data: {
      doctor,
    },
  });
});

exports.getAdmin = catchAsync(async (req, res, next) => {
  const admin = await Admin.findById(req.query.id);

  res.status(200).json({
    status: "success",
    data: {
      admin,
    },
  });
});
