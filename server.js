const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Razorpay = require("razorpay");

dotenv.config({ path: "./config.env" });

exports.instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

const app = require("./app");

const port = process.env.PORT || 5000;

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log("Database has been connected !!"));

const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
