import express from "express";
import user from "./User/user.js";

const router = express.Router();

router.get("/", async (req, res) => {
	res.send("Hello World");
});

router.use("/user/", user);

export default router;
