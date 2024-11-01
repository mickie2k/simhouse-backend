import multer from "multer";

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./upload");
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, "simImage-" + uniqueSuffix + file.originalname);
	},
});

const upload = multer({ storage: storage }).fields([
	{ name: "file1", maxCount: 1 },
	{ name: "file2", maxCount: 1 },
	{ name: "file3", maxCount: 1 },
]);

export default upload;
