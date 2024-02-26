const moment = require("moment");
const { instance } = require("../server");

const Doctor = require("../models/doctorModel");
const Appointment = require("../models/appointmentModel");
const catchAsync = require("../utils/catchAsync");

const crypto = require("crypto");
const Patient = require("../models/patientModel");

const ElasticEmail = require("@elasticemail/elasticemail-client");

exports.bookAppointment = catchAsync(async (req, res, next) => {
  let { doctorId, patientId, timeSlot } = req.body;

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

const sendEmail = (appointment, doc, pat) => {
  const client = ElasticEmail.ApiClient.instance;

  const apikey = client.authentications["apikey"];
  apikey.apiKey = process.env.EMAIL_API_KEY;

  const templatesApi = new ElasticEmail.TemplatesApi();
  const emailsApi = new ElasticEmail.EmailsApi();

  const emailData = {
    Recipients: {
      To: [pat.email, process.env.EMAIL],
    },
    Content: {
      Body: [
        {
          ContentType: "HTML",
          Charset: "utf-8",
          Content: `<h1>Your appointment has been booked successfully!</h1> <h5>Your appointment details are:</h5> <h3>Timing - ${moment(
            appointment.timeSlot
          ).format("DD-MM-YYYY HH:mm A")}</h3><h3> Doctor Name - ${
            doc.name
          }</h3>`,
        },
        {
          ContentType: "PlainText",
          Charset: "utf-8",
          Content: `Your appointment has been booked successfully! Your appointment details are: Timing - ${moment(
            appointment.timeSlot
          ).format("DD-MM-YYYY HH:mm A")} Doctor Name - ${doc.name}`,
        },
      ],
      From: process.env.EMAIL,
      Subject: "Appointment booking confirmation",
    },
  };

  const callback = (error, data, response) => {
    if (error) {
      console.error(error);
    } else {
      console.log("API called successfully.");
      console.log("Email sent.");
    }
  };

  emailsApi.emailsTransactionalPost(emailData, callback);
};

exports.verifyPayment = catchAsync(async (req, res, next) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;

  generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update((razorpay_order_id + "|" + razorpay_payment_id).toString())
    .digest("hex");

  if (generated_signature == razorpay_signature) {
    const doctorId = req.query.doctor;
    const patientId = req.query.patient;
    let timeSlot = req.query.timeSlot;

    let x = timeSlot.split(" ");
    timeSlot = x[0] + "+" + x[1];

    const appointment = await Appointment.create({
      doctor: doctorId,
      patient: patientId,
      paymentStatus: true,
      timeSlot: timeSlot,
    });

    let doc = await Doctor.findById(doctorId);
    doc = await Doctor.findByIdAndUpdate(doctorId, {
      appointments: [...doc.appointments, appointment._id],
    });

    let pat = await Patient.findById(patientId);
    pat = await Patient.findByIdAndUpdate(patientId, {
      appointments: [...pat.appointments, appointment._id],
    });

    sendEmail(appointment, doc, pat);

    res.redirect(
      `http://localhost:3000/paymentSuccess?ref=${razorpay_payment_id}&appId=${appointment._id}`
    );
    res.status(200).json({
      status: "success",
    });
  } else {
    res.status(500).json({
      status: "fail",
    });
  }
});

exports.getAppointment = catchAsync(async (req, res, next) => {
  const appointment = await Appointment.findById(req.query.id).populate([
    "doctor",
    "patient",
  ]);
  res.status(200).json({
    status: "success",
    data: {
      appointment,
    },
  });
});
