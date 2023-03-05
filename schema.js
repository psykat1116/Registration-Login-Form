const mongoose = require("mongoose");

const formSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    lowercase: true,
  },
  lastName: {
    type: String,
    required: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
    validator(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is not valid");
      }
    },
    unique: true,
  },
  sex: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true
  },
  age: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    required: true,
  },
});

const Register = new mongoose.model("Register", formSchema);

module.exports = Register;
