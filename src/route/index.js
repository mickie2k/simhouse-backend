import express from "express";
import user from "./User/user.js";
import host from "./Host/host.js";
import product from "./Product/product.js";

const router = express.Router();

router.get("/", async (req, res) => {
	res.send("Hello World");
});

router.use("/user/", user);
router.use("/host/", host);
router.use("/product/", product);
export default router;
