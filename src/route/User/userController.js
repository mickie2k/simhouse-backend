import * as db from "../../utils/database.js";
import md5 from "md5";
import jwt from "jsonwebtoken";
import { jwt_secret } from "../../../index.js";

async function getUserByID(req, res) {
	try {
		const result = await db.getUserByID(req.params.id);
		return res.json(result);
	} catch (error) {
		res.status(500).json({
			message: "something went wrong",
		});
	}
}

// async function getUserByID2(req, res) {
// 	try {
// 		const id = req.params.id;
// 		const result = await db.getUserByID(id);
// 		console.log(req.uid + "/" + req.role);
// 		return res.json(result);
// 	} catch (error) {
// 		res.status(500).json({
// 			message: "something went wrong",
// 		});
// 	}
// }

async function userLogin(req, res) {
	try {
		const { username, password } = req.body;
		const encryptPassword = md5(password);
		if (!username || !password) {
			return res
				.status(400)
				.json({ message: "Username and password are required." });
		}

		const result = await db.userLoginDB(username, encryptPassword);
		if (result) {
			const token = jwt.sign(
				{ uid: result.CustomerID, role: "customer" },
				jwt_secret,
				{ expiresIn: "7d" }
			);
			const thisDate = new Date();
			thisDate.setDate(thisDate.getDate() + 6);
			res.cookie("token", token, {
				expires: thisDate,
				sameSite: "none",
				secure: true,
				httpOnly: true,
			});
			return res.json(result);
		} else {
			return res
				.status(401)
				.json({ message: "Username or password is incorrect." });
		}
	} catch (error) {
		res.status(500).json({
			message: "something went wrong",
		});
	}
}

async function userRegister(req, res) {
	try {
		const { username, password, fname, lname, ctel } = req.body;
		const encryptPassword = md5(password);
		const userData = {
			username,
			password: encryptPassword,
			fname,
			lname,
			ctel,
		};

		const result = await db.userRegisterDB(userData);
		if (!result) {
			throw "error";
		} else {
			return res.json({ message: "Register Success" });
		}
	} catch (error) {
		res.status(500).json({
			message: "something went wrong",
		});
	}
}

export { getUserByID, userLogin, userRegister };
