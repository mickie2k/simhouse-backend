require("dotenv").config();

const express = require("express");
const route = require("./src/route/index");
const db = require("./src/utils/database");
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use("/", route);

app.listen(port, async () => {
	await db.initSQL();
	console.log(`Example app listening on port ${port}`);
});
