const express = require("express");
const router = express.Router();
const controllerRoom = require("../../controllers/room");
const middlewareRoom = require("../../middleware/room");

// @route api/customers
router
  .get("/", controllerRoom.getRooms)
  .post("/", [middlewareRoom.postRoom], controllerRoom.postRoom);

// @route api/customers/:id
router
  .get("/:id", controllerRoom.getRoom)
  .put("/:id", [middlewareRoom.putRoom], controllerRoom.putRoom)
  .delete("/:id", controllerRoom.deleteRoom);

module.exports = router;
