require("dotenv").config();
const mysql = require("mysql2/promise");
let conn = null;
async function initSQL() {
	try {
		conn = await mysql.createConnection({
			host: process.env.HOST,
			user: process.env.DB_USER,
			database: process.env.DB,
		});
		console.log("connection Database");
	} catch (error) {
		console.log(error);
	}
}

async function getUserByID(id) {
	try {
		const sql = "SELECT * FROM host WHERE hostID = ?";
		const [rows] = await conn.query(sql, id);
		return rows;
	} catch (error) {
		return false;
	}
}

module.exports = { initSQL, getUserByID };
