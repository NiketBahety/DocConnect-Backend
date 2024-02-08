const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const patientSchema = new mongoose.Schema({
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
  },
  address: {
    type: String,
    maxLength: 60,
    trim: true,
  },
  appointments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
  ],
  gender: {
    type: String,
    trim: true,
  },
  bloodType: {
    type: String,
    trim: true,
  },
  medicalHistory: {
    type: String,
    maxLength: 100,
    trim: true,
  },
});

patientSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

patientSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
