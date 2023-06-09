const express = require('express');
const router = express.Router();
const { registerUser, registerParking, loginUsers, updateUser, getUser, recoverPassword, resetUpdatePassword, getUserParking, getRole, getAllParking, updateUserParking, search, getBooking, createBooking} = require('../Controllers/userController');
// const { protect } = require('../Middleware/authMiddleware');

router.post('/registerUser', registerUser);
router.post('/registerParking', registerParking);
router.post('/login', loginUsers);
router.patch('/updateUser/:idUser', updateUser);
router.patch('/updateUserParking/:idUserParking', updateUserParking);
router.patch('/updatePassword', resetUpdatePassword);
router.patch('/recoverPassword', recoverPassword);
router.post('/rolUser', getRole);
router.post('/meUser', getUser);
router.post('/meUserParking', getUserParking);
router.get('/getParking', getAllParking);
router.post('/search', search);
router.get('/getBooking', getBooking);
router.post('/createBooking', createBooking);

module.exports = router