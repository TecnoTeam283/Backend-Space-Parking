const express = require('express');
const router = express.Router();
const { registerUser, registerParking, loginUsers, updateUser, getUser, recoverPassword, resetUpdatePassword, getUserParking, getRole, getAllParking, updateUserParking, search, getBooking, getBookingById, getBookingByNitParking, createBooking, getUserSpaces, updateSpaceById, addVehiclesToUser, updateVehicles} = require('../Controllers/userController');
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
router.get('/getBookingsByNitParking/:nitParking', getBookingByNitParking)
router.get('/getSpacesById/:idUserParking', getUserSpaces)
router.patch('/updateSpaceById/:idUserParking/:_id', updateSpaceById)
router.post('/createBooking', createBooking);
router.post('/addVehicles/:idUser', addVehiclesToUser);
router.patch('/updateVehicles/:idUser/:vehicleId', updateVehicles);


module.exports = router