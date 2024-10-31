import * as db from "../../utils/database.js";
import md5 from "md5";
import jwt from "jsonwebtoken";
import { jwt_secret } from "../../../index.js";

async function gethostByID(req, res) {
	try {
		const result = await db.gethostByID(req.params.id);
		return res.json(result);
	} catch (error) {
		res.status(500).json({
			message: "something went wrong",
		});
	}
}

// async function gethostByID2(req, res) {
// 	try {
// 		const id = req.params.id;
// 		const result = await db.gethostByID(id);
// 		console.log(req.uid + "/" + req.role);
// 		return res.json(result);
// 	} catch (error) {
// 		res.status(500).json({
// 			message: "something went wrong",
// 		});
// 	}
// }

async function hostLogin(req, res) {
	try {
		const { username, password } = req.body;

		if (!username || !password) {
			return res
				.status(400)
				.json({ message: "username and password are required." });
		}
		const encryptPassword = md5(password);

		const result = await db.hostLoginDB(username, encryptPassword);
		if (result) {
			const token = jwt.sign({ uid: result.HostID, role: "host" }, jwt_secret, {
				expiresIn: "7d",
			});
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
				.json({ message: "username or password is incorrect." });
		}
	} catch (error) {
		res.status(500).json({
			message: "something went wrong",
			error: error,
		});
	}
}

async function hostRegister(req, res) {
	try {
		const { username, password, fname, lname, htel, lat, long, addressDetail } =
			req.body;
		const encryptPassword = md5(password);
		const hostData = {
			username,
			password: encryptPassword,
			fname,
			lname,
			htel,
			lat,
			long,
			addressDetail,
		};

		const result = await db.hostRegisterDB(hostData);
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

async function hostLogout(req, res) {
	try {
		res.clearCookie("token");
		return res.json({ message: "Logout Success" });
	} catch (error) {
		res.status(500).json({
			message: "something went wrong",
		});
	}
}

async function bookingFromSimID(req, res) {
	try {
		const result = await db.hostBookingFromSimIDDB(req.params.simid, req.uid);
		return res.json(result);
	} catch (error) {
		res.status(500).json({
			message: "something went wrong",
		});
	}
}

async function scheduleFromBookingID(req, res) {
	try {
		const result = await db.hostScheduleFromBookingIDDB(
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

async function scheduleFromSimID(req, res) {
	try {
		const result = await db.hostScheduleFromSimIDDB(req.params.simid, req.uid);
		return res.json(result);
	} catch (error) {
		res.status(500).json({
			message: "something went wrong",
		});
	}
}
export { gethostByID, hostLogin, hostRegister, hostLogout, scheduleFromSimID };
