require("dotenv").config()
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
    required: true,
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
  //This Is needed to add for authentication
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

//Generating JSON Web Token using a unique variable and a character of length atleast 32 character
formSchema.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign(
      { _id: this._id.toString() },
      process.env.SECRET_KEY
    );
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (error) {
    res.send(`the error part ${error}`);
    console.log(`the error part ${error}`);
  }
};

//Creating Hash value for the password using bcrypt
formSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    this.confirmPassword = await bcrypt.hash(this.confirmPassword, 10);
    // this.confirmPassword = undefined;
  }
  next();
});

const Register = new mongoose.model("Register", formSchema);
module.exports = Register;
