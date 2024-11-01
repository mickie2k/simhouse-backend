import express from "express";
import {
	userLogin,
	userRegister,
	userLogout,
	bookingFromCustomerID,
	scheduleFromBookingID,
	bookingSim,
	getUserName,
	requestCancel,
} from "./userController.js";
import { validateIntegerParams } from "../../middleware/validator.js";
import auth from "../../middleware/auth.js";
import { checkUserRole } from "../../middleware/auth.js";

const router = express.Router();

router.post("/login", userLogin);
router.post("/register", userRegister);
router.get("/username", auth, getUserName);
router.post("/logout", auth, userLogout);
router.get("/booking", auth, checkUserRole("customer"), bookingFromCustomerID);
router.get(
	"/booking/:bookingid/schedule",
	auth,
	checkUserRole("customer"),
	scheduleFromBookingID
);
router.post("/booking", auth, checkUserRole("customer"), bookingSim);
router.delete(
	"/booking/:bookingid",
	auth,
	checkUserRole("customer"),
	requestCancel
);
export default router;
