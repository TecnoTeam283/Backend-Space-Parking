const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../Model/userModel');
const UserParking = require('../Model/userParkingModel');
const Role = require('../Model/rolesModel');
const Booking = require('../Model/bookingsModel');
const nodemailer = require('nodemailer')
const crypto = require('crypto');
const moment = require('moment');

const generateRandom = () => {
    const password = crypto.randomBytes(4).toString('hex');
    return password;
};

const registerUser = asyncHandler(async(req, res) => {
    const { name, email, cellphone, idUser, password, placa, model, license, vehicle, roles} = req.body

    if (!name || !email || !cellphone || !password || !idUser || !placa || !model || !license || !vehicle ) {
        res.status(400)
        throw new Error('Please add all fields')
    }

    // Check if user exists
    const userExists = await User.findOne({ email })

    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create User
    const user = await User.create({
        name,
        email,
        cellphone,
        idUser,
        password: hashedPassword,
        placa,
        model,
        license,
        vehicle,
    })

    if(roles){
        const foundRoles = await Role.find({name: {$in: roles}})
        user.roles = foundRoles.map(role => role._id)
    } else {
        const role = await Role.findOne({name: "user"})
        user.roles = [role._id]
    }

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            cellphone: user.cellphone,
            idUser: user.idUser,
            placa: user.placa,
            model: user.model,
            license: user.license,
            vehicle: user.vehicle,
            rol: user.roles,
            // role: user.Role,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }

    const savedUser = await user.save()

    // console.log(savedUser);
});

const registerParking = asyncHandler(async(req, res) => {
    const { name, email, cellphone, idUserParking, password, nameParking, address, cellphoneParking, nit, hourStart, hourEnd, capacity, priceMotorcycle, priceCar, roles} = req.body

    if (!name || !email || !cellphone || !idUserParking || !password || !nameParking || !address || !cellphoneParking || !nit || !hourStart || !hourEnd || !capacity || !priceMotorcycle || !priceCar) {
        res.status(400)
        throw new Error('Please add all fields')
    }

    // Check if user exists
    const userExists = await UserParking.findOne({email})

    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create User
    const user = await UserParking.create({
        name,
        email,
        cellphone,
        idUserParking,
        password: hashedPassword,
        nameParking,
        address,
        cellphoneParking,
        nit,
        hourStart,
        hourEnd,
        capacity: Array.from({ length: capacity }, (_, index) => ({
          space: `Space ${index + 1}`,
          state: 'available',
      })),
        priceMotorcycle,
        priceCar
    })

    if(roles){
        const foundRoles = await Role.find({name: {$in: roles}})
        user.roles = foundRoles.map(role => role._id)
    } else {
        const role = await Role.findOne({name: "adminParking"})
        user.roles = [role._id]
    }

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            cellphone: user.cellphone,
            idUserParking: user.idUserParking,
            nameParking: user.nameParking,
            address: user.address,
            cellphoneParking: user.cellphoneParking,
            nit: user.nit,
            hourStart: user.hourStart,
            hourEnd: user.hourEnd,
            capacity: user.capacity,
            rol: user.roles,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
    
    const savedUser = await user.save()
    // console.log(savedUser);
});

const loginUsers = asyncHandler(async(req, res) => {
    const { email, password } = req.body

    // Check for user email
    const user = await User.findOne({email}).populate('roles')
    const userParking = await UserParking.findOne({email}).populate('roles')

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            phone: user.cellphone,
            idUser: user.idUser,
            license: user.license,
            roles: user.roles.name,
            vehicle: user.vehicle,
            placa: user.placa,
            token: generateToken(user._id),
            msg: "User Registrado"
        })}

    if (userParking && (await bcrypt.compare(password, userParking.password))) {
        res.json({
            _id: userParking.id,
            idUserParking: userParking.idUserParking,
            name: userParking.name,
            nameParking: userParking.nameParking,
            email: userParking.email,
            cellphone: userParking.cellphone,
            cellphoneParking: userParking.cellphoneParking,
            address: userParking.address,
            hourStart: userParking.hourStart,
            hourEnd: userParking.hourEnd,
            priceCar: userParking.priceCar,
            priceMotorcycle: userParking.priceMotorcycle,
            nit: userParking.nit,
            roles: userParking.roles.name,
            capacity: userParking.capacity,
            token: generateToken(userParking._id),
            msg: "Parking Registrado"
        })
}
     else {
        res.status(400)
        throw new Error('Invalid credentials')
    }
    console.log(user);
    console.log(userParking);
});

const recoverPassword = asyncHandler(async(req, res) => {
    const { email } = req.body

    if(!email) res.status(400).send({msg: "Debe ingresar el email"})

    const user = await User.findOne({email});
    const userParking = await UserParking.findOne({email});

    let dataUsers;
    if(user!==null){
        dataUsers=user
    } else if(userParking!==null){
        dataUsers=userParking
    }

        let newPassword = generateRandom();
            if(dataUsers){
                let config = {
                    host: "smtp.gmail.com",
                    port: 587,
                    auth: {
                        user: "workTeam20045@gmail.com", // generated ethereal user
                        pass: "atikmavfxfxwgxjw", // generated ethereal password
                    },
                }
                let mensaje = {
                from: 'workTeam20045@gmail.com', // sender address
                to: dataUsers.email,
                // list of receivers
                subject: "Recuperacion de contraseña Space Parking", // Subject line
                text: `¿Hola, has olvidado tu contraseña? \n Para ingresar a tu cuenta de nuevo deberas usar esta contraseña: 
                Tu nueva contraseña es: ${newPassword} \n\n Cuado ingreses no olvides cambiar tu contraseña`
            }
            
            const transport = nodemailer.createTransport(config)
            const info = transport.sendMail(mensaje)
            //   console.log(info)
            
            if(newPassword){
                const salt = bcrypt.genSaltSync(10)
                const hashPassword = bcrypt.hashSync(newPassword, salt)
                newPassword = hashPassword
            }
            // console.log(newPassword);

            let roleUser = `${dataUsers.roles}`
    
            if(roleUser.split("")[23]=="5"){
                User.updateOne({email}, { $set: { password: newPassword } }).then(()=>{
                    res.json({
                        msg: "Se cambio la contraseña User"
                    })
                })
            }else if(roleUser.split("")[23]=="6"){
                UserParking.updateOne({email}, { $set: { password: newPassword } }).then(()=>{
                    res.json({
                        msg: "Se cambio la contraseña UserParking"
                    })
                })
            }
        } else {
            res.status(400)
            throw new Error('Invalid email')
        }
});

const resetUpdatePassword = asyncHandler( async (req, res) => {
    // const { id } = req.params;
    const { currentPassword, newPassword, email } = req.body;
  
    const user = await User.findOne({ email });
    const userParking = await UserParking.findOne({ email });

    let dataUsers;
    if(user!==null){
        dataUsers=user
    } else if(userParking!==null){
        dataUsers=userParking
    }

    if (!dataUsers) {
      return res.json({ status: "User Not Exists!" });
    }

// Validacion de la contraseña ingresada con la de la base de datos
    const passwordMatch = await bcrypt.compare(currentPassword, dataUsers.password);
    if (!passwordMatch) {
      return res.json({ status: 'Incorrect Current Password' });
    }
    try {
      const encryptedPassword = await bcrypt.hash(newPassword, 10);
      await dataUsers.updateOne(
        {
          $set: {
            password: encryptedPassword,
          },
        }
      );
  
      res.json({ 
        email: email,
        newPassword: newPassword,  
        status: "Verified"
     });

    } catch (error) {
      res.json({ status: "Error"});
      console.log(dataUsers);
    }
});

const getRole = asyncHandler(async(req, res) =>{
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    const userParking = await UserParking.findOne({email: email})
    if (user) {
        const {roles} = user;
        res.status(200).json({

          roles,
        //   idUser
        });
      }
      else if (userParking) {
        const {roles} = userParking;
        res.status(200).json({
            
          roles,
        //   idUserParking

        });
        
      } else {
        res.status(404).json({ message: 'Usuario no encontrado' });
      }
});

const getUser = asyncHandler(async(req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email: email });

  if (user) {
    const { _id, name, email, cellphone, license, idUser, roles, placa } = user;
    res.status(200).json({
      _id,
      name,
      email,
      cellphone,
      license,
      idUser,
      roles,
      placa
    });
  } else {
    res.status(404).json({ message: 'Usuario no encontrado' });
  }
});

const getUserParking = asyncHandler(async(req, res) => {
    const { email } = req.body;
    const userParking = await UserParking.findOne({ email: email });
    if (userParking) {
        const { _id, name, email, cellphone, idUserParking, nameParking, address, cellphoneParking, hourStart, hourEnd,  priceCar, priceMotorcycle, nit, capacity } = userParking;
        
        res.status(200).json({
            id: _id,
            name,
            email,
            cellphone,
            idUserParking,
            nameParking,
            address,
            cellphoneParking,
            hourStart,
            hourEnd,
            priceCar,
            priceMotorcycle,
            nit,
            capacity
        });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
});

const getAllParking = asyncHandler(async(req, res) => {
    UserParking.find().then((data, err) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error de servidor');
        } else {
          res.json(data);
        }
      });
});

const updateUser = asyncHandler(async(req, res) => {
    const { idUser } = req.params;
    const { name, cellphone } = req.body;

    try {
      const user = await UserParking.findOne({idUser});
      if(user){
        const newInfo ={
          name: name,
          cellphone: cellphone,
        }
        await  User.updateOne({idUser: idUser}, {$set: newInfo})
      }
    } catch (err) {
      res.status(500).json({ err: 'Error al actualizar los datos del usuario' });
    }

    // User.findOneAndUpdate(idUser, { name, cellphone }, { new: true })
    //     .then(updatedUser => {
    //      res.json(updatedUser);
    // })
    // .catch(error => {
    //   res.status(500).json({ error: 'Error al actualizar los datos del usuario' });
    // });
});

const updateUserParking = asyncHandler(async(req, res) => {
    const { idUserParking } = req.params;
    const { name, cellphone, address, cellphoneParking } = req.body;
    
    try {
      const parking = await UserParking.findOne({idUserParking});
      if(parking){
        const newInfo ={
          name: name,
          cellphone: cellphone,
          address: address,
          cellphoneParking: cellphoneParking,
        }
        await  UserParking.updateOne({idUserParking: idUserParking}, {$set: newInfo})
      }
    } catch (err) {
      res.status(500).json({ err: 'Error al actualizar los datos del usuario' });
    }

    // UserParking.findOneAndUpdate(idUserParking, { name, cellphone, address, cellphoneParking }, { new: true })
    //     .then(updatedUserParking => {
    //      res.json(updatedUserParking);
    // })
    // .catch(error => {
    //   res.status(500).json({ error: 'Error al actualizar los datos del usuario' });
    // });
});

const search = asyncHandler(async(req, res) => {
    const searchTerm = req.body.searchTerm;

    try {
      // Utiliza una expresión regular para hacer coincidir la dirección con el término de búsqueda
      const regex = new RegExp(searchTerm, 'i');
  
      // Realiza la búsqueda filtrando por la dirección
      const resultados = await UserParking.find({ address: regex });
  
      // Envía los resultados de la búsqueda al cliente
      res.send('Resultados de búsqueda: ' + searchTerm + '\n' + JSON.stringify(resultados));
    } catch (error) {
      console.log('Error en la búsqueda:', error);
      res.status(500).send('Error en la búsqueda');
    }
});

const getBooking = asyncHandler(async(req, res) => {
    try {
        const bookings = await Booking.find();
        res.json(bookings);
      } catch (error) {
        res.status(500).json({ error: 'Error al obtener las reservas' });
      }
});

const getBookingById = asyncHandler(async(req,res) =>{
    const { idUser } = req.params;
    const bookings = await Booking.find({ idUser: idUser });

    if (bookings.length > 0) {
        const bookingData = bookings.map((booking) => {
          const { name, nitParking, dateStartBooking, dateEndBooking } = booking;
          return {
            name,
            nitParking,
            dateStartBooking,
            dateEndBooking,
          };
        });
    
        res.status(200).json(bookingData);
      } else {
        res.status(404).json({ message: 'Este usuario no tiene reservas' });
      }
});

const createBooking = asyncHandler(async(req, res) => {
    try {
        const { name, nitParking, idUser, dateStartBooking, duration } = req.body;
        const formattedStartBooking = moment(dateStartBooking).format('YYYY-MM-DD HH:mm:ss');
        const formattedEndBooking = moment(dateStartBooking).add(duration, 'minutes').format('YYYY-MM-DD HH:mm:ss');

    // Calcular fecha de finalización sumando la duración

        // Verificacion reserva activa dentro del tiempo
        const existingBooking = await Booking.findOne({
          idUser,
          $or: [
            {
              dateStartBooking: { $lte: formattedStartBooking }, // La reserva existente comienza antes o al mismo tiempo que la nueva reserva
              dateEndBooking: { $gt: formattedStartBooking } // La reserva existente termina después de que comience la nueva reserva
            },
            {
              dateStartBooking: { $lt: formattedEndBooking }, // La reserva existente comienza antes de que termine la nueva reserva
              dateEndBooking: { $gte: formattedEndBooking } // La reserva existente termina al mismo tiempo o después de que termine la nueva reserva
            },
            {
              dateStartBooking: { $gte: formattedStartBooking }, // La reserva existente comienza después de que comience la nueva reserva
              dateEndBooking: { $lte: formattedEndBooking } // La reserva existente termina antes de que termine la nueva reserva
            }
          ]
        });

        if (existingBooking) {
          return res.status(400).json({ error: 'Ya tienes una reserva activa' });
        }

        const userParking = await UserParking.findOne({ nit: nitParking });
        if (!userParking) {
          return res.status(400).json({ error: 'No se encontró el parqueadero' });
        }
    
        let availableSpace;
        for (const space of userParking.capacity) {
          if (space.state === 'available') {
            space.state = 'reserved';
            availableSpace = space;
            break;
          }
        }
    
        if (!availableSpace) {
          return res.status(400).json({ error: 'No hay espacios disponibles para reservar' });
        }
    
        userParking.save();
    
    
        const booking = new Booking({ name,  nitParking, idUser, dateStartBooking: formattedStartBooking, dateEndBooking: formattedEndBooking });
        await booking.save();
    
        res.json({ mensaje: 'Reserva creada exitosamente' });
      } catch (error) {
        res.status(500).json({ error: 'Error al crear la reserva' });
      }
});

const getUserSpaces = asyncHandler(async(req,res) =>{
    const { idUserParking } = req.params;
    const userParking = await UserParking.findOne({ idUserParking: idUserParking });

    if (userParking) {
      const userSpaces = userParking.capacity;

      // `userSpaces` es un arreglo que contiene los espacios del usuario de parqueadero
      res.status(200).json(userSpaces);
    } else {
      res.status(404).json({ message: 'Este usuario no tiene Espacios' });
  }
});

const updateSpaceById = asyncHandler(async(req, res) => {
  const { _id, idUserParking } = req.params;
  const { state } = req.body;

  UserParking.findOneAndUpdate(
    { idUserParking: idUserParking, 'capacity._id': _id}, // Filtra por el ID del usuario y el ID del espacio
    { $set: { 'capacity.$.state': state } }, // Actualiza el estado del espacio
    { new: true }
  )
    .then(updatedUser => {
      if (!updatedUser) {
        res.status(404).json({ error: 'Usuario o espacio no encontrado' });
      } else {
        res.json(updatedUser);
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Error al actualizar el estado del espacio' });
    });
});

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '90d', 
    })
}

module.exports = {
    registerUser,
    registerParking,
    loginUsers,
    updateUser,
    updateUserParking,
    getRole,
    getUser,
    getUserParking,
    recoverPassword,
    resetUpdatePassword,
    getAllParking,
    search,
    getBooking,
    getBookingById,
    createBooking,
    getUserSpaces,
    updateSpaceById
}