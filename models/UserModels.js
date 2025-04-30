const mongoose = require("mongoose");

const Usermodel = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
});

const assignedModel = new mongoose.Schema({
  id:{
    type: mongoose.Schema.Types.ObjectId,
    required:true
  }
})

const TeamModel = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  assigned:[assignedModel],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const User = mongoose.model("Users", Usermodel);
const Team = mongoose.model("Teams", TeamModel);
module.exports = {
  User,
  Team
};
