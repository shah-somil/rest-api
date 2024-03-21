const express = require('express');
const multer = require('multer');
const { createUser, updateUser, deleteUser, getAll, uploadImage } = require('../controllers/userController');
const router = express.Router();

router.post('/user/create', createUser);
router.put('/user/update', updateUser);
router.delete('/user/delete', deleteUser);
router.get('/user/getAll', getAll);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.' + file.mimetype.split('/')[1]);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif') {
        cb(null, true);
    } else {
        cb(new Error('Only JPEG, PNG, and GIF files are allowed'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.post('/user/uploadImage', upload.single('image'), uploadImage);


module.exports = router;
