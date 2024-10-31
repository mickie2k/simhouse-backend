import express from "express";
import {
	gethostByID,
	hostLogin,
	hostRegister,
	hostLogout,
	scheduleFromSimID,
} from "./hostController.js";
import { validateIntegerParams } from "../../middleware/validator.js";
import auth from "../../middleware/auth.js";
import { checkUserRole } from "../../middleware/auth.js";

const router = express.Router();

// router.get(
// 	"/:id",
// 	auth,
// 	checkUserRole("host"),
// 	validateIntegerParams,
// 	gethostByID
// );
router.post("/login", hostLogin);
router.post("/register", hostRegister);
router.get(
	"/product/:simid/schedule",
	auth,
	checkUserRole("host"),
	scheduleFromSimID
);
router.post("/logout", auth, checkUserRole("host"), hostLogout);

export default router;
