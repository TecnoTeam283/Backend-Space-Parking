const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true 
    },
    nitParking: {
        type: String, 
        required: true 
    },
    idUser: {
        type: String, 
        required: true 
    },
    userName: {
        type: String, 
        required: true 
    },
    cellphone: {
        type: String, 
        required: true 
    },
    dateStartBooking: {
        type: String, 
        required: true 
    },
    dateEndBooking: {
        type: String, 
        required: true 
    },
},
{
    timestamps: true,
    versionKey: false,
});

module.exports = mongoose.model('Booking', bookingSchema);

