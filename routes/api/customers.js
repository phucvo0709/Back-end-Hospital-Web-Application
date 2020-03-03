const express = require("express");
const router = express.Router();
const controllerCustomer = require("../../controllers/customer");
const middlewareCustomer = require("../../middleware/customer");

// @route api/customers
router
  .get("/", controllerCustomer.getCustomers)
  .post(
    "/",
    [middlewareCustomer.postCustomer],
    controllerCustomer.postCustomer
  );

// @route api/customers/:id
router
  .get("/:id", controllerCustomer.getCustomer)
  .put("/:id", [middlewareCustomer.putCustomer], controllerCustomer.putCustomer)
  .delete("/:id", controllerCustomer.deleteCustomer);

module.exports = router;
