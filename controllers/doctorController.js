const moment = require("moment");

const Doctor = require("../models/doctorModel");
const Appointment = require("../models/appointmentModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllDoctors = catchAsync(async (req, res, next) => {
  let doctors;
  if (req.query.sort === "FEES_ASCE") {
    doctors = await Doctor.find().populate(["appointments"]).sort({ fees: 1 });
  } else if (req.query.sort === "FEES_DESC") {
    doctors = await Doctor.find().populate(["appointments"]).sort({ fees: -1 });
  } else {
    doctors = await Doctor.find()
      .populate(["appointments"])
      .sort({ rating: -1 });
  }

  console.log(req.query.afterTime);
  console.log(req.query.beforeTime);

  let afterTime = req.query?.afterTime
    ? moment(req.query?.afterTime)
    : moment().startOf("day");
  let beforeTime = req.query?.beforeTime
    ? moment(req.query?.beforeTime)
    : moment().endOf("day");

  let tot = Math.ceil((beforeTime.diff(afterTime, "minutes") + 30) / 30);

  let newDoctors = [];

  for (let i = 0; i < doctors.length; i++) {
    let appointments = doctors[i].appointments;
    let cnt = 0;
    for (let j = 0; j < appointments.length; j++) {
      let appointmentTime = moment(appointments[j].timeSlot);
      if (appointmentTime.isBetween(beforeTime, afterTime, null, [])) {
        cnt++;
      }
    }
    if (cnt == tot) {
      console.log("yes");
    } else {
      newDoctors.push(doctors[i]);
    }
  }

  res.status(200).json({
    status: "success",
    data: {
      newDoctors,
    },
  });
});
