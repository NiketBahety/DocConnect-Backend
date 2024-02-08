const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    select: false,
    trim: true,
  },
  phone: {
    type: Number,
    trim: true,
  },
  about: {
    type: String,
    maxLength: 200,
    trim: true,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  timeSlot: {
    type: String,
    required: [true, "Timeslots are required"],
    trim: true,
  },

  education: {
    type: String,
    required: [true, "Education is required"],
    trim: true,
  },
  fees: {
    type: Number,
    required: [true, "Fees is required"],
  },
  specialization: {
    type: String,
    trim: true,
  },
  appointments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
  ],
  address: {
    type: String,
    maxLength: 60,
    trim: true,
  },
});

doctorSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

doctorSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;
