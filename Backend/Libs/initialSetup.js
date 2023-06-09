const Role = require('../Model/rolesModel');

const createRoles = async()=>{
try {
    const count = await Role.estimatedDocumentCount()

    if(count > 0) return;

    const values = await Promise.all([
        new Role({name: "user"}).save(),
        new Role({name: "adminParking"}).save(),
    ])
    console.log(`data ${values}`.bgGreen.underline)
    } catch (error) {
        console.error(error)
     }
}

module.exports = {
    createRoles
}