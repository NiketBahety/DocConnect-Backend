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

  let afterTime = req.query?.afterTime
    ? moment(req.query?.afterTime)
    : moment().startOf("day");
  let beforeTime = req.query?.beforeTime
    ? moment(req.query?.beforeTime)
    : moment().endOf("day");

  let tot = Math.ceil((beforeTime.diff(afterTime, "minutes") + 30) / 30);

  let newDoctors = [];

  for (let i = 0; i < doctors.length; i++) {
    let t1 = doctors[i].timeSlot.split("-")[0];
    let t2 = doctors[i].timeSlot.split("-")[1];

    // Parse t1 and t2 into moment objects
    let t1Moment = moment(t1, "HH:mm");
    let t2Moment = moment(t2, "HH:mm");

    tot = 0;
    currentTime = moment(afterTime);

    // Loop through half-hour intervals between afterTime and beforeTime
    while (currentTime.isBefore(beforeTime)) {
      // Check if the current time falls within the range t1 and t2
      if (
        currentTime.format("HH:mm") >= t1Moment.format("HH:mm") &&
        currentTime.format("HH:mm") <= t2Moment.format("HH:mm")
      ) {
        tot++;
      }
      // Move to the next half-hour interval
      currentTime.add(30, "minutes");
    }

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
