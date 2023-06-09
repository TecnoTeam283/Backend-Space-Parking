const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config();
const { errorHandler } = require('../Backend/Middleware/errorMiddleware')
const connectDB = require('../Backend/Config/db')
const port = process.env.PORT || 5000;
const { createRoles } = require('../Backend/Libs/initialSetup');
const cors = require('cors');

const app = express();
createRoles();
connectDB();

const corsOptions = {
    origin: '*'
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/api/users', require('./Routes/userRoutes'));

app.use(errorHandler)

app.listen(port, () => console.log(`Server started on port ${port}`));