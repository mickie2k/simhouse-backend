import express from "express";
import * as productController from "./productController.js";
const router = express.Router();
router.get("/", async (req, res) => {
	res.send("Hello Product");
});

router.get("/all", productController.getProductAll);
router.get("/id/:simid", productController.getProductID);
router.get("/id/:simid/booking", productController.getProductBooking);
export default router;
