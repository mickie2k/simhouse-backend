const validateIntegerBody = (req, res, next) => {
	const { number } = req.body; // assuming the body has a property called 'number'

	if (typeof number === "number" && Number.isInteger(number)) {
		next(); // Valid, proceed to the next middleware or route handler
	} else {
		res
			.status(400)
			.json({ error: "Request body must contain an integer value." });
	}
};

const validateIntegerParams = async (req, res, next) => {
	const id = req.params.id; // assuming the body has a property called 'number'
	const parseId = parseInt(id);

	if (Number.isInteger(parseId)) {
		next(); // Valid, proceed to the next middleware or route handler
	} else {
		res
			.status(400)
			.json({ error: "Request Params must contain an integer value." });
	}
};

export { validateIntegerBody, validateIntegerParams };
