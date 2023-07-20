const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Set the destination folder where uploaded files will be stored
    cb(null, path.join(__dirname, '../../../images/user/userphoto'));
  },
  filename: function (req, file, cb) {
    // Set the filename for the uploaded file
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

module.exports = upload;
