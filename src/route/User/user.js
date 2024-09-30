import express from "express";
import { getUserByID, userLogin, userRegister } from "./userController.js";
import { validateIntegerParams } from "../../middleware/validator.js";
import { userRegisterDB } from "../../utils/database.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

router.get("/:id", auth, validateIntegerParams, getUserByID);
router.post("/login", userLogin);
router.post("/register", userRegister);

export default router;
