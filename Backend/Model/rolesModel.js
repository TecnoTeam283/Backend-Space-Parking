const mongoose = require('mongoose');

const roleSchema = mongoose.Schema({
    name: String,
},
{
    timestamps: true,
    versionKey: false,
})

module.exports = mongoose.model('Role', roleSchema)