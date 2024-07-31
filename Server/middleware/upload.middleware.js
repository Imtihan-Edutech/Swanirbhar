const path = require('path');
const crypto = require('crypto');
const fs = require('fs-extra');
const multer = require('multer');

const fileFilter = (req, file, cb) => {
    const filetypes = {
        'profilePic': /jpeg|jpg|png/,
        'coverImage': /jpeg|jpg|png/,
        'thumbnail': /jpeg|jpg|png/,
        'demoVideo': /mp4/,
        'notes': /pdf|txt/
    };

    const filetypeRegex = filetypes[file.fieldname];

    if (filetypeRegex) {
        const extname = filetypeRegex.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypeRegex.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            req.fileValidationError = 'File type not supported';
            return cb(null, false);
        }
    } else {
        req.fileValidationError = 'File type not supported';
        return cb(null, false);
    }
};

const diskStorage = (baseDir, folders) => {
    fs.ensureDirSync(baseDir);

    return multer.diskStorage({
        destination: (req, file, cb) => {
            const folder = folders[file.fieldname] || '';
            const fullFolderPath = path.join(baseDir, folder);
            fs.ensureDir(fullFolderPath, err => cb(err, fullFolderPath));
        },
        filename: (_, file, cb) => {
            const randomBytes = crypto.randomBytes(16).toString('hex');
            cb(null, `${randomBytes}${Date.now()}${path.extname(file.originalname)}`);
        }
    });
};

const multerConfig = (baseDir, folders) => multer({
    storage: diskStorage(baseDir, folders),
    fileFilter
});

module.exports = { multerConfig, diskStorage };
