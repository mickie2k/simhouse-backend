require("dotenv").config();

const express = require("express");
const initSQL = require("../utils/database");
const user = require("./User/user");

const router = express.Router();
const port = process.env.PORT;
let conn = null;

router.get("/", async (req, res) => {
	res.send("Hello World");
});

router.use("/user/", user);

module.exports = router;
