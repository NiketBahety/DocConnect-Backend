const moment = require("moment");
const { instance } = require("../server");

const Doctor = require("../models/doctorModel");
const Appointment = require("../models/appointmentModel");
const catchAsync = require("../utils/catchAsync");

exports.bookAppointment = catchAsync(async (req, res, next) => {
  let { doctorId, parientId, timeSlot } = req.body;

  let doctor = await Doctor.findById(doctorId);

  let available = true;

  for (let i = 0; i < doctor.appointments.length; i++) {
    if (moment(doctor.appointments[i].timeSlot) === moment(timeSlot)) {
      available = false;
      break;
    }
  }

  if (available === false) {
    res.status(404).json({
      status: "fail",
      data: {
        message: "This slot is not available! Please try another slot.",
      },
    });
  } else {
    const options = {
      amount: doctor.fees * 100,
      currency: "INR",
    };

    const order = await instance.orders.create(options);

    res.status(200).json({
      status: "success",
      data: {
        order,
      },
    });
  }
});
