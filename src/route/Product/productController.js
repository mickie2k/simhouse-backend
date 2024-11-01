import * as db from "../../utils/database.js";
async function getProductAll(req, res) {
	try {
		let page = parseInt(req.query?.page) || 1;
		let limit = parseInt(req.query?.limit) || 30;
		let type = parseInt(req.query?.type) || null;

		if (limit < 1) {
			limit = 30; // Reset to default if limit is less than 1
		}
		if (page < 1) {
			page = 1; // Reset to default if page is less than 1
		}
		page = (page - 1) * limit;
		let result;
		if (type !== null) {
			result = await db.productAllByTypeDB(type, limit, page);
		} else {
			result = await db.productAllDB(limit, page);
		}

		return await res.json(result);
	} catch (error) {
		res.status(500).json({
			message: "something went wrong",
		});
	}
}

async function getProductID(req, res) {
	try {
		let simid = req.params.simid;
		const result = await db.productidDB(simid);
		return res.json(result);
	} catch (error) {
		res.status(500).json({
			message: "something went wrong",
		});
	}
}

export async function getProductBooking(req, res) {
	try {
		const simid = req.params.simid;

		const result = await db.productBookingDB(simid);
		return res.json(result);
	} catch (error) {
		res.status(500).json({
			message: "something went wrong",
		});
	}
}

export { getProductAll, getProductID };
