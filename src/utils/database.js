import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();
let conn = null;
async function initSQL() {
	try {
		conn = await mysql.createConnection({
			host: process.env.HOST,
			user: process.env.DB_USER,
			database: process.env.DB,
			multipleStatements: false,
		});
		console.log("connection Database");
	} catch (error) {
		console.log("can't connect to Database");
	}
}

async function getUserByID(id) {
	try {
		const sql = "SELECT * FROM host WHERE hostID = ?";
		const [rows] = await conn.query(sql, [id]);
		return rows;
	} catch (error) {
		return false;
	}
}

async function userLoginDB(username, password) {
	try {
		const sql =
			"SELECT CustomerID, Username, FName, LName, CTel FROM customer WHERE Username = ? AND Password = ?";
		const [rows] = await conn.query(sql, [username, password]);
		return rows[0];
	} catch (error) {
		return false;
	}
}

async function userRegisterDB(userData) {
	try {
		const sql = "INSERT INTO customer SET ? ";
		const [rows] = await conn.query(sql, userData);
		return true;
	} catch (error) {
		return false;
	}
}

export { initSQL, getUserByID, userLoginDB, userRegisterDB };
