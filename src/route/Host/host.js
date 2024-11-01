import express from "express";
import {
	gethostByID,
	hostLogin,
	hostRegister,
	hostLogout,
	scheduleFromSimID,
	bookingFromSimID,
	scheduleFromBookingID,
	confirmBooking,
	uploadSimulator,
} from "./hostController.js";
import { validateIntegerParams } from "../../middleware/validator.js";
import auth from "../../middleware/auth.js";
import { checkUserRole } from "../../middleware/auth.js";
import upload from "../../middleware/upload.js";

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

router.post("/product", auth, checkUserRole("host"), upload, uploadSimulator);

router.get(
	"/product/:simid/schedule",
	auth,
	checkUserRole("host"),
	scheduleFromSimID
);

router.get(
	"/product/:simid/booking",
	auth,
	checkUserRole("host"),
	bookingFromSimID
);
router.get(
	"/product/:simid/booking/:bookingid/schedule",
	auth,
	checkUserRole("host"),
	scheduleFromBookingID
);

router.put(
	"/product/:simid/booking/:bookingid",
	auth,
	checkUserRole("host"),
	confirmBooking
);

router.post("/logout", auth, checkUserRole("host"), hostLogout);

export default router;
