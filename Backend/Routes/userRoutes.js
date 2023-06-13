const express = require('express');
const router = express.Router();
const { registerUser, registerParking, loginUsers, updateUser, getUser, recoverPassword, resetUpdatePassword, getUserParking, getRole, getAllParking, updateUserParking, search, getBooking, getBookingById,createBooking, getUserSpaces, updateSpaceById} = require('../Controllers/userController');
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
router.get('/getAllBookings', getBooking);
router.get('/getBookingsById/:idUser', getBookingById)
router.get('/getSpacesById/:idUserParking', getUserSpaces)
router.patch('/updateSpaceById/:idUserParking/:_id', updateSpaceById)
router.post('/createBooking', createBooking);

module.exports = router