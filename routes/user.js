require("dotenv").config();
const express = require('express');
const router = express.Router();
const User = require("../model/user")
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const auth = require("../middleware/auth");
const jwt = require('jsonwebtoken');




// User register
router.post('/register', async (req, res, next)=>{

    const { username, firstName, lastName, email, password, phone, gender, role } = req.body;

    // Validate user input
    if (!(username && firstName && lastName && email && password && phone && gender && role)) {
        res.status(400).json("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUserByUsername = await User.findOne({ username });

    if (oldUserByUsername) {
      return res.status(409).json("username Already Exist. Please Login");
    }

    const oldUserByEmail = await User.findOne({ email });

    if (oldUserByEmail) {
      return res.status(409).json("Email Already Exist. Please Login");
    }


    // Password encrypt password
    bcrypt.hash(password, 10, function(err, hash) {
        if(err) {
            return res.status(500).json({
                message:err
            })
        } else {

            // Create user in database
            const user = new User({
                _id:new mongoose.Types.ObjectId,
                username,
                firstName,
                lastName,
                email: email.toLowerCase(),
                password:hash,
                phone,
                gender,
                role
            })
            user.save()
            .then(result=>{
                res.status(200).json({
                    user:result
                })
            })
            .catch(error=>{
                res.status(500).json({
                    error:error
                })
            })
        }
    });
})

// User login
router.post('/login', async (req, res, next)=>{
    
    const { username, password } = req.body;

    // Validate user input
    if (!(username && password)) {
        res.status(400).json("Please provide username and password");
    }

    // Validate if user exist in our database
    const user = await User.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        const token = jwt.sign(
            { user_id: user._id, role: user.role, username },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );

        return res.status(200).json({ token : token })
    }
    return res.status(400).json({error:"Invalid Credentials"});
})

// Get all users
router.get('/all', auth, (req, res, next)=>{
    User.find()
    .then(result=>{
        res.status(200).json({
            users: result
        })
    })
    .catch(error=>{
        res.status(500).json({
            error:error
        })
    })
})

// Find user by id
router.get('/find/:id', auth, (req, res, next)=>{
    User.findById(req.params.id)
    .then(result=>{
        res.status(200).json({
            user:result
        })
    })
    .catch(error=>{
        res.status(500).json({
            error:error
        })
    })
})

// Delete user by id 
router.delete('/delete/:id', auth, (req, res, next)=>{
    id = req.params.id;
    User.remove({_id:id})
    .then(result=>{
        res.status(200).json({
            message: 'User deleted successfully',
            result: result
        })
    })
    .catch(error=>{
        res.status(200).json({
            error:error
        })
    })
})


// Update user
router.put('/update/:id', auth, (req, res, next)=> {
    bcrypt.hash(req.body.password, 10, function(err, hash) {
        if(err) {
            return res.status(500).json({
                message:err
            })
        } else {
            User.findByIdAndUpdate({_id:req.params.id},{
                $set:{
                    username:req.body.username,
                    firstName:req.body.firstName,
                    lastName:req.body.lastName,
                    email:req.body.email,
                    password:hash,
                    phone:req.body.phone,
                    gender:req.body.gender,
                    userType:req.body.userType
                }
            })
            .then(result=>{
                res.status(200).json({
                    user:result
                })
            })
            .catch(error=>{
                res.status(500).json({
                    error:error
                })
            })
        }
    });
})

module.exports = router;