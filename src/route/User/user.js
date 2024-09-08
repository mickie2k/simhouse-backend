const express = require("express");
const router = express.Router();
const user = require("./userController");

router.get("/:id", user.getUserByID);

module.exports = router;
