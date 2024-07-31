const validateFileSize = (req, res, next) => {
    const fileLimits = {
        'profilePic': 1 * 1024 * 1024,
        'thumbnail': 1 * 1024 * 1024,
        'coverImage': 1 * 1024 * 1024,
        'demoVideo': 50 * 1024 * 1024,
        'notes': 5 * 1024 * 1024
    };

    const files = req.files;

    for (const field in files) {
        for (const file of files[field]) {
            if (file.size > fileLimits[field]) {
                return res.status(400).json({ message: `${field} size exceeds limit` });
            }
        }
    }

    next();
};

module.exports = validateFileSize;
