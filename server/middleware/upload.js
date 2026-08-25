const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/products");
    },

    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);

        const name =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1e9) +
            ext;

        cb(null, name);
    }
});

const fileFilter = (req, file, cb) => {
    const allowed = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp"
    ];

    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed"), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

module.exports = upload;