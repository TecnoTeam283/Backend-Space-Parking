const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    name: {
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

