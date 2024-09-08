const db = require("../../utils/database");

async function getUserByID(req, res) {
	try {
		const id = req.params.id;
		const result = await db.getUserByID(id);
		return res.json(result);
	} catch (error) {
		res.status(500).json({
			message: "something went wrong",
		});
	}
}

async function getUserByID(req, res) {
	try {
		const id = req.params.id;
		const result = await db.getUserByID(id);
		return res.json(result);
	} catch (error) {
		res.status(500).json({
			message: "something went wrong",
		});
	}
}

module.exports = { getUserByID };
