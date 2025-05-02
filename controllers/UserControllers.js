const { User, Team } = require("../models/UserModels");

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Signin = async (req, res) => {
  try {
    const { firstname, lastname, email, password, role } = req.body;
    const user = await User.findOne({ email });
    const userinTeam = await Team.findOne({ email });
    if (userinTeam) {
      return res
        .status(400)
        .json({ message: "User is already in a team", data: userinTeam });
    }
    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        firstname,
        lastname,
        email,
        role,
        password: hashedPassword,
      });
      await newUser.save();
      res
        .status(201)
        .json({ message: "User created successfully", user: newUser });
    } else {
      res.status(400).json({ message: "User already exists", user: user });
    }
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error: error });
  }
};

const editProfile = async (req, res) => {
  try {
    const user = req.body;
    console.log(user);
    const { _id, ...updated } = user;
    const hashed = await bcrypt.hash(updated.password, 10);
    const updatedHashed = { ...updated, password: hashed };
    const updatedUser = await User.findByIdAndUpdate(_id, updatedHashed, {
      new: true,
    });
    res
      .status(200)
      .json({ message: "Profile updated successfully", updatedUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const member = await Team.findOne({ email });
    if (!user && !member) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).json({ message: "Invalid password", user: user });
      } else {
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
        return res.status(200).json({
          message: "User logged in successfully",
          token: token,
          user: user,
        });
      }
    }
    if (member) {
      const isMemberMatch = await bcrypt.compare(password, member.password);
      if (!isMemberMatch) {
        return res
          .status(400)
          .json({ message: "Invalid password", user: member });
      } else {
        const memberToken = jwt.sign(
          { id: member._id },
          process.env.SECRET_KEY
        );
        return res.status(200).json({
          message: "Team member logged in successfully",
          token: memberToken,
          user: member,
        });
      }
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error logging in user", error: error.message });
  }
};

const Addteammember = async (req, res) => {
  try {
    const { fullname, email, phone, password, role, createdBy } = req.body;
    const existInUser = await User.findOne({ email });
    const exist = await Team.findOne({ email });
    if (exist) {
      res
        .status(400)
        .json({ message: "Team member already exists", member: exist });
    }
    if (existInUser) {
      res
        .status(400)
        .json({ message: "User already exists", user: existInUser });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newTeamMember = new Team({
        fullname: fullname,
        email: email,
        phone: phone,
        password: hashedPassword,
        role: role,
        createdBy: createdBy,
      });
      const savedTeamMember = await newTeamMember.save();
      res.status(201).json({
        message: "Team member created successfully",
        member: savedTeamMember,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const fetchTeammembers = async (req, res) => {
  try {
    const { id } = req.params;
    const teamMembers = await Team.find({ createdBy: id }).select("-password");
    res
      .status(200)
      .json({ message: "Team members fetched successfully", teamMembers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const editTeammember = async (req, res) => {
  try {
    console.log(req);
    const { id } = req.params;
    const { fullname, email, phone, role } = req.body;

    const edited = await Team.findByIdAndUpdate(
      id,
      { fullname, email, phone, role },
      { new: true, runValidators: true }
    );

    if (!edited) {
      return res.status(404).json({ message: "Team member not found" });
    }
    const result = await Team.find();
    res
      .status(200)
      .json({ message: "Edited team member successfully", data: result });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error while editing team member", error: err.message });
  }
};

const deleteMember = async (req, res) => {
  try {
    const { id } = req.body;
    const deletedMember = await Team.findByIdAndDelete(id);
    res.status(200).json({
      message: "Team member deleted successfully",
      data: deletedMember,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, data: error });
  }
};

module.exports = {
  Signin,
  editProfile,
  Login,
  Addteammember,
  fetchTeammembers,
  deleteMember,
  editTeammember,
};
