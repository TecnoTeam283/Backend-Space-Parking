const mongoose = require('mongoose');

const userParkingSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add a email'],
        unique: true
    },
    cellphone: {
        type: String,
        required: [true, 'Please add a cellphone'],
        unique: true
    },
    idUserParking: {
        type: String,
        required: [true, 'Please add a identification'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please add a password']
    },
    nameParking: {
        type: String,
        required: [true, 'Please add a name parking'],
    },
    address: {
        type: String,
        required: [true, 'Please add a address'],
    },
    location: {
        type: [Number], // [latitud, longitud]
        required: [true, 'Please add a location'],
    },
    cellphoneParking: {
        type: String,
        required: [true, 'Please add a cellphone parking'],
        unique: true
    },
    nit: {
        type: String,
        required: [true, 'Please add a nit'],
        unique: true
    },
    hourStart: {
        type: String,
        required: [true, 'Please add a hour start'],
    },
    hourEnd: {
        type: String,
        required: [true, 'Please add a hour end'],
    },
    capacity: {
        type: [{
            space: {
                type: String,
                required: true,
            },
            state: {
                type: String,
                enum: ['available', 'busy', 'reserved', 'notAvailable'],
                default: 'available',
            },
        }],
        validate: {
            validator: function (value) {
                return value.length <= 50; // Validar que haya máximo 50 espacios
            },
            // message: `The maximum number of spaces is 50`,
        },
        required: [true, 'Please add a capacity'],
    },
    priceMotorcycle: {
        type: Number,
        required: [true, 'Please add a priceMotorcycle'],
    },
    priceCar: {
        type: Number,
        required: [true, 'Please add a priceCar'],
    },
    roles: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role", 
    },
},
{
    timestamps: true,
    versionKey: false,
})

module.exports = mongoose.model('UserParking', userParkingSchema)