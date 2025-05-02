const { Enduser, MissedChats } = require("../models/EndUserModels.js");
const { Team } = require("../models/UserModels.js");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types;

const addEnduser = async (req, res) => {
  try {
    const { name, email, phone, status, ticket_id, assignedTo } = req.body;
    const enduser = new Enduser({
      name,
      email,
      phone,
      status,
      ticket_id,
      assignedTo,
      messages: [],
    });
    const result = await enduser.save();
    return res.status(200).json({ data: result, status: 200 });
  } catch (err) {
    return res.status(400).json({ message: err.message, data: err });
  }
};

const addMessage = async (req, res) => {
  try {
    const { id, message } = req.body;
    const enduser = await Enduser.findById(id);
    enduser.messages.push(message);
    const result = await enduser.save();

    return res
      .status(200)
      .json({ data: result, message: "Message added successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
const messagefetch = async (req, res) => {
  try {
    const id = req.body;
    const enduser = await Enduser.findById(id);
    if (!enduser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(enduser);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const memberMessagefetch = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Team.findById(id);
    const messageids = member.assigned;
    // console.log(messageids)
    const objectids = messageids.map((item) => item.id);
    console.log(objectids);
    const messages = await Enduser.find({ _id: { $in: objectids } });

    res
      .status(200)
      .json({ message: "messages fetched succesfully", data: messages });
  } catch (err) {
    res.status(400).json({ message: "error fetching messages", data: err });
  }
};

const fetchUsers = async (req, res) => {
  try {
    const users = await Enduser.find();
    res.status(200).json({ data: users, status: 200 });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const updatechatstatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    const enduser = await Enduser.findById(id);
    console.log(enduser);
    enduser.status = status;
    const result = await enduser.save();
    res
      .status(200)
      .json({ data: result, message: "Status updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const assign = async (req, res) => {
  try {
    const { memberId, ticketId } = req.query;
    console.log(memberId, ticketId);

    const member = await Team.findOne({ _id: memberId });
    const ticket = await Enduser.findOne({ _id: ticketId });
    console.log(member);
    console.log(ticket);
    member.assigned.push({ id: ticketId });
    ticket.assignedTo = memberId;
    const result = await member.save();
    const result2 = await ticket.save();
    res.status(200).json({
      data: {
        assignedChat: result2,
        assignedTo: result,
      },
      message: "Ticket assigned successfully",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const updateMissed = async (req, res) => {
  try {
    console.log(req);
    const { id, date } = req.body;
    console.log(id);
    const ticket = await Enduser.findById(id);
    const exist = await MissedChats.findOne({ day: date });
    if (exist) {
      exist.count++;
      await exist.save();
    } else {
      const newday = new MissedChats({
        day: date,
        count: 1,
      });
      await newday.save();
    }
    console.log(ticket);
    ticket.isMissed = true;
    const result = await ticket.save();
    res
      .status(200)
      .json({ message: "missed chat updated successfully", data: result });
  } catch (err) {
    return res.status(500).json({ message: err.message, data: err });
  }
};

const fetchMissed = async (req, res) => {
  try {
    const data = await MissedChats.find();
    res
      .status(200)
      .json({ message: "missed chat fetch successful", data: data });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message, data: err });
  }
};

module.exports = {
  addEnduser,
  addMessage,
  messagefetch,
  fetchUsers,
  updatechatstatus,
  assign,
  memberMessagefetch,
  updateMissed,
  fetchMissed,
};
