import jwt from "jsonwebtoken";
import { jwt_secret } from "../../index.js";
export default async function auth(req, res, next) {
	try {
		// const authHeader = req.header("Authorization"); // jwttoken store in frontend
		// if (!authHeader) {
		// 	return res.status(401).send("Authentication Failed");
		// }
		// const authToken = authHeader.split(" ")[1]; // end jwttoken check

		const authToken = req.cookies.token;
		const user = jwt.verify(authToken, jwt_secret);
		req.uid = user.uid;
		req.role = user.role;
		next();
	} catch (error) {
		res.status(500).send("Token Invalid");
	}
}
