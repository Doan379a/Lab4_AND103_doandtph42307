const multer = require("multer");

const _storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
    console.log("hihi");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
    console.log("hah");
  },
});

const upload = multer({ storage: _storage });

module.exports = upload;
