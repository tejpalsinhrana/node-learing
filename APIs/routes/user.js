const express = require('express');
const router = express.Router();
const User = require("../model/user")
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');


// Signup user
router.post('/signup', (req, res, next)=>{

    // Password encrypt 
    bcrypt.hash(req.body.password, 10, function(err, hash) {
        if(err) {
            return res.status(500).json({
                message:err
            })
        } else {

            // Create user in database
            const user = new User({
                _id:new mongoose.Types.ObjectId,
                username:req.body.username,
                firstName:req.body.firstName,
                lastName:req.body.lastName,
                email:req.body.email,
                password:hash,
                phone:req.body.phone,
                gender:req.body.gender,
                role:req.body.role
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
router.post('/login', (req, res, next)=>{
    User.find({username:req.body.username})
    // exec()
    .then(user=>{
        // Check user exist or not
        if (user.length > 1) {
            return res.status(401).json({
                message: 'Invalid credentials.'
            })
        }

        // Password compare with hash
        bcrypt.compare(req.body.password, user[0].password, (err, result)=>{
            if (!result) {
                return res.status(401).json({
                    message: 'Invalid credentials.'
                })
            }
            if (result) {
                // Create JWT token
                const token = jwt.sign({ 
                        username: user[0].username, 
                        firstName:user[0].firstName,
                        lastName:user[0].lastName,
                        email:user[0].email,
                        phone:user[0].phone,
                        gender:user[0].gender,
                        role:user[0].role,
                    },
                    'Dummy key',
                    {
                        expiresIn:"1h"   
                    }
                );
                res.status(200).json({
                    token : token
                })
            }
        })
    })
})

// Get all users
router.get('/all', (req, res, next)=>{
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
router.get('/find/:id',(req, res, next)=>{
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
router.delete('/delete/:id', (req, res, next)=>{
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
router.put('/update/:id', (req, res, next)=> {
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