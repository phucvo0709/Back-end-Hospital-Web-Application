const Customer = require("./../models/Customer");
const { validationResult } = require("express-validator");

exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    // Check for ObjectId format and customer
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/) || !customer) {
      return res.status(404).json({ msg: "Customer not found" });
    }

    res.json(customer);
  } catch (err) {
    console.error(err.message);

    res.status(500).send("Server Error");
  }
};

exports.postCustomer = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newCustomer = new Customer({
      name: req.body.name
    });

    const customer = await newCustomer.save();

    res.json(customer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.putCustomer = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    await Customer.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
      function(err, customer) {
        if (err) return res.status(404).json({ msg: "Customer not found" });
        res.send(customer);
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    // Check for ObjectId format and post
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/) || !customer) {
      return res.status(404).json({ msg: "Customer not found" });
    }

    await customer.remove();

    res.json({ msg: "Customer removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
