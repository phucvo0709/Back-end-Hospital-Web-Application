const Room = require("./../models/Room");
const Customer = require("./../models/Customer");
const { validationResult } = require("express-validator");
const isEmpty = require("../validation/is-empty");

exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find()
      .populate({
        path: "customers",
        populate: {
          path: "rooms"
        }
      })
      .populate("currentCustomer")
      .populate("finishedCustomers")
      .sort({ createdAt: -1 });
    res.json(rooms);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate({
        path: "customers",
        populate: {
          path: "historyInRooms",
          select: "name"
        }
      })
      .populate("rooms")
      .populate("currentCustomer")
      .populate("finishedCustomers");
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
      {
        $set: req.body
      },
      { new: true }
    )
      .populate({
        path: "customers",
        populate: {
          path: "historyInRooms",
          select: "name"
        }
      })
      .populate("currentCustomer")
      .populate("finishedCustomers")
      .then(room => res.send(room))
      .catch(err => res.status(500).send(err));
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
    const room = await Room.findById(req.body.id)
      .populate({
        path: "customers",
        populate: {
          path: "historyInRooms",
          select: "name"
        }
      })
      .populate("currentCustomer")
      .populate("finishedCustomers");
    // Check for ObjectId format and post
    if (!req.body.id.match(/^[0-9a-fA-F]{24}$/) || !room) {
      return res.status(404).json({ msg: "Room not found" });
    }

    const customer = await Customer.findById(req.body.idCustomer);

    // Check for ObjectId format and post
    if (!req.body.id.match(/^[0-9a-fA-F]{24}$/) || !customer) {
      return res.status(404).json({ msg: "Customer not found" });
    }

    const customerisInRoom = room.customers.some(function(customer) {
      return customer.equals(req.body.idCustomer);
    });

    if (customerisInRoom) {
      return res.status(400).json({ msg: "Customer existing in this room" });
    } else {
      customer.historyInRooms = room._id;
      customer.save();

      await Room.findByIdAndUpdate(
        req.body.id,
        {
          $push: {
            customers: req.body.idCustomer
          }
        },
        { new: true }
      )
        .populate({
          path: "customers",
          populate: {
            path: "historyInRooms",
            select: "name"
          }
        })
        .populate("currentCustomer")
        .populate("finishedCustomers")
        .then(room => res.send(room))
        .catch(err => res.status(500).send(err));
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.addCustomerToCurrentProcessing = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const room = await Room.findById(req.body.id)
      .populate({
        path: "customers",
        populate: {
          path: "historyInRooms",
          select: "name"
        }
      })
      .populate("currentCustomer")
      .populate("finishedCustomers");

    // Check for ObjectId format and post
    if (!req.body.id.match(/^[0-9a-fA-F]{24}$/) || !room) {
      return res.status(404).json({ msg: "Room not found" });
    }

    const customer = await Customer.findById(req.body.idCustomer);

    // Check for ObjectId format and post
    if (!req.body.id.match(/^[0-9a-fA-F]{24}$/) || !customer) {
      return res.status(404).json({ msg: "Customer not found" });
    }
    const currentIdCustomer = room.currentCustomer;
    if (!isEmpty(room.currentCustomer)) {
      if (room.currentCustomer == req.body.idCustomer) {
        return res.status(400).json({ msg: "Customer is processing" });
      }
    }

    const customerisInRoom = room.customers.some(function(customer) {
      return customer.equals(req.body.idCustomer);
    });
    if (isEmpty(room.customers)) {
      await Room.findByIdAndUpdate(
        req.body.id,
        {
          $push: { finishedCustomers: currentIdCustomer },
          $set: { currentCustomer: null }
        },
        { new: true }
      )
        .populate({
          path: "customers",
          populate: {
            path: "historyInRooms",
            select: "name"
          }
        })
        .populate("currentCustomer")
        .populate("finishedCustomers")
        .then(room => res.send(room))
        .catch(err => res.status(500).send(err));
    } else {
      if (customerisInRoom) {
        if (isEmpty(currentIdCustomer)) {
          await Room.findByIdAndUpdate(
            req.body.id,
            {
              $set: {
                currentCustomer: req.body.idCustomer
              },
              $pull: { customers: req.body.idCustomer }
            },
            { new: true }
          )
            .populate({
              path: "customers",
              populate: {
                path: "historyInRooms",
                select: "name"
              }
            })
            .populate("currentCustomer")
            .populate("finishedCustomers")
            .then(room => res.send(room))
            .catch(err => res.status(500).send(err));
        } else {
          await Room.findByIdAndUpdate(
            req.body.id,
            {
              $set: {
                currentCustomer: req.body.idCustomer
              },
              $push: {
                finishedCustomers: currentIdCustomer
              },
              $pull: { customers: req.body.idCustomer }
            },
            { new: true }
          )
            .populate({
              path: "customers",
              populate: {
                path: "historyInRooms",
                select: "name"
              }
            })
            .populate("currentCustomer")
            .populate("finishedCustomers")
            .then(room => res.send(room))
            .catch(err => res.status(500).send(err));
        }
      } else {
        return res
          .status(400)
          .json({ msg: "Customer not existing in this room" });
      }
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
