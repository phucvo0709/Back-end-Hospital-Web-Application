const Room = require("./../models/Room");
const Customer = require("./../models/Customer");
const { validationResult } = require("express-validator");

exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find()
      .populate("customers")
      .sort({ createdAt: -1 });
    res.json(rooms);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    // Check for ObjectId format and room
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/) || !room) {
      return res.status(404).json({ msg: "Room not found" });
    }

    res.json(room);
  } catch (err) {
    console.error(err.message);

    res.status(500).send("Server Error");
  }
};

exports.postRoom = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newRoom = new Room({
      name: req.body.name
    });

    const room = await newRoom.save();

    res.json(room);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.putRoom = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
      function(err, room) {
        if (err) return res.status(404).json({ msg: "Room not found" });
        res.send(room);
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    // Check for ObjectId format and post
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/) || !room) {
      return res.status(404).json({ msg: "Room not found" });
    }

    await room.remove();

    res.json({ msg: "Room removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.addCustomerToRoom = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const room = await Room.findById(req.params.id).populate("customers");

    // Check for ObjectId format and post
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/) || !room) {
      return res.status(404).json({ msg: "Room not found" });
    }

    const customer = await Customer.findById(req.params.customerId);

    // Check for ObjectId format and post
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/) || !customer) {
      return res.status(404).json({ msg: "Customer not found" });
    }

    const customerisInRoom = room.customers.some(function(customer) {
      return customer.equals(req.params.customerId);
    });

    if (customerisInRoom) {
      return res.status(400).json({ msg: "Customer existing in this room" });
    } else {
      await Room.findByIdAndUpdate(
        req.params.id,
        { $push: { customers: req.params.customerId } },
        { new: true }
      )
        .populate("customers")
        .then(room => res.send(room))
        .catch(err => res.status(500).send(err));
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
