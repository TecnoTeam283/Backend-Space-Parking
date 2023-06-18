const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
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
    license: {
        type: String,
        required: [true, 'Please add a license'],
        unique: true
    },
    idUser: {
        type: String,
        required: [true, 'Please add a identification'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please add a password']
    },
    vehicle: {
        type: [{
            placa: {
                type: String,
                required: [true, 'Please add a placa'],
                unique: true
            },
            model: {
                type: String,
                required: [true, 'Please add a model']
            },
      
            typeVehicle: {
                type: String,
                required: [true, 'Please add a type vehicle'],
            }
        }],
        validate: {
            validator: function (vehicle) {
                return vehicle.length <= 3; // Limitar a un máximo de tres vehículos
        },
    },
        default: [],
        required: [true, 'Please add a type vehicle'],
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

module.exports = mongoose.model('User', userSchema)
