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
export async function getUserName(req, res) {
	try {
		const result = await db.getUserNameDB(req.uid);
		return res.json(result);
	} catch (error) {
		res.status(500).json({
			message: "something went wrong",
		});
	}
}

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
		const { username, password, fname, lname } = req.body;
		const encryptPassword = md5(password);
		const userData = {
			username,
			password: encryptPassword,
			fname,
			lname,
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

async function userLogout(req, res) {
	try {
		res.clearCookie("token");
		return res.json({ message: "Logout Success" });
	} catch (error) {
		res.status(500).json({
			message: "something went wrong",
		});
	}
}

async function bookingFromCustomerID(req, res) {
	try {
		const result = await db.bookingFromCustomerIDDB(req.uid);
		return res.json(result);
	} catch (error) {
		res.status(500).json({
			message: "something went wrong",
		});
	}
}

async function scheduleFromBookingID(req, res) {
	try {
		const result = await db.scheduleFromBookingIDDB(
			req.params.bookingid,
			req.uid
		);

		return res.json(result);
	} catch (error) {
		res.status(500).json({
			message: "something went wrong",
		});
	}
}

async function bookingSim(req, res) {
	try {
		const { simid, scheduleid } = req.body;

		const bookingData = {
			simid,
			scheduleid,
			customerid: req.uid,
		};
		const checkSchedule = await db.checkScheduleDB(bookingData);
		if (!checkSchedule) {
			return res.status(400).json({
				message: "The selected time is unavailable. Please try another time.",
			});
		}
		const [result, status] = await db.bookingSimDB(bookingData);
		if (!status) {
			throw "error";
		} else {
			return res.json({ message: "Booking Success", bookingid: result });
		}
	} catch (error) {
		res.status(500).json({
			message: "something went wrong",
		});
	}
}

export async function requestCancel(req, res) {
	try {
		const bookingid = req.params.bookingid;
		const customerID = req.uid;
		const result = await db.cancelBookByCustomer(bookingid, customerID);

		const message =
			result.affectedRows > 0
				? "Booking has been canceled."
				: "Booking cannot be canceled.";
		const status = result.affectedRows > 0;
		return res.json({ status: status, message: message });
	} catch (error) {
		res.status(500).json({
			message: "something went wrong",
		});
	}
}

export {
	getUserByID,
	userLogin,
	userRegister,
	userLogout,
	bookingFromCustomerID,
	scheduleFromBookingID,
	bookingSim,
};
