const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const app = express();

// Route import
const userRoute = require('./routes/user');
const studentRoute = require('./routes/student');
const facultyRoute = require('./routes/faculty');
const productRoute = require('./routes/product');

// mongoose.connect('mongodb://localhost:27017/myapp');
mongoose.connect(`mongodb+srv://root:root@cluster0.zw8r4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)

// Database connection failed
mongoose.connection.on('error', err=>{
    console.log("Connection failed")
})

// Database connected successfully
mongoose.connection.on('connected', conn=>{
    console.log("Connected with database....")
})


app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

// Create routes
app.use('/user', userRoute)
app.use('/student', studentRoute);
app.use('/faculty', facultyRoute);
app.use('/product', productRoute)

// If route not found 
app.use((req, res, next)=>{
    res.status(404).json({
        error: 'bad request'
    })
});

module.exports = app;