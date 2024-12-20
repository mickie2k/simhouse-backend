import { ExpressAuth } from "@auth/express";

import dotenv from "dotenv";
import express from "express";
import router from "./src/route/index.js";
import { initSQL } from "./src/utils/database.js";
import google from "@auth/express/providers/google";
import cors from "cors";
import cookieParser from "cookie-parser";
// Load environment variables
dotenv.config();
const app = express();
const port = process.env.PORT;
const jwt_secret = process.env.JWT_SECRET;
const allowedOrigins = process.env.CORS_ORIGINS.split(',');

app.use(cookieParser());
app.use(express.json());
// app.set("trust proxy", true);
// app.use("/auth/*", ExpressAuth({ providers: [google] }));
app.use(
	cors({
		origin: allowedOrigins,
		credentials: true,
	})
);

app.use("/", router);
app.use("/image", express.static("upload"));
app.listen(port, async () => {
	await initSQL();
	console.log(`Example app listening on port ${port}`);
});

export { jwt_secret };
