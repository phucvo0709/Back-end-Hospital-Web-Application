const Room = require("./../models/Room");
const { validationResult } = require("express-validator");

exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ createdAt: -1 });
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
