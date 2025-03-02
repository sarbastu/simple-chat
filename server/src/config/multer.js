import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderPath = `uploads/users/${req.user._id}/profileImages`;
    fs.mkdirSync(folderPath, { recursive: true });
    cb(null, folderPath);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${extension}`);
  },
});

const upload = multer({ storage });

export default upload;
