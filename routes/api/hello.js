const express = require("express");
const router = express.Router();

// @route  GET api/hello
// @desc   Hello text
// @access Public
router.get("/", (req, res) => {
  return res.status(200).json({ success: "ok" });
});

module.exports = router;
