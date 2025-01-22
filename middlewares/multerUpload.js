const multer = require('multer');
const path = require('path');
const fs = require('fs');
const storage = multer.diskStorage({
    destination: async function (req, file, cb) {      
        const uploadDir = 'public/uploads';  
        try {
            await fs.promises.access(uploadDir, fs.constants.F_OK); 
            cb(null, uploadDir);  
        } catch (err) {
            fs.mkdir(uploadDir, { recursive: true }, (err) => {
                if (err) {
                    return cb(err);  // Handle error if directory creation fails
                }
                cb(null, uploadDir);  // Proceed with the upload if directory is created
            });
        }
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });

const multerUpload = multer({ storage: storage });
module.exports = multerUpload;