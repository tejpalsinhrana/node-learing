const express = require('express');
const router = express.Router();
const Student = require("../model/student")
const mongoose = require("mongoose");

// Get all students
router.get('/all', (req, res, next)=>{
    Student.find()
    .then(result=>{
        res.status(200).json({
            students: result
        })
    })
    .catch(error=>{
        res.status(500).json({
            error:error
        })
    })
})

// Find student by id
router.get('/find/:id',(req, res, next)=>{
    Student.findById(req.params.id)
    .then(result=>{
        res.status(200).json({
            student:result
        })
    })
    .catch(error=>{
        res.status(500).json({
            error:error
        })
    })
})

// Create student
router.post('/create', (req, res, next)=>{
    const student = new Student({
        _id:new mongoose.Types.ObjectId,
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        gender:req.body.gender
    })
    student.save()
    .then(result=>{
        res.status(200).json({
            student:result
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
    Student.remove({_id:id})
    .then(result=>{
        res.status(200).json({
            message: 'Student deleted successfully',
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
    Student.findByIdAndUpdate({_id:req.params.id},{
        $set:{
            name:req.body.name,
            email:req.body.email,
            phone:req.body.phone,
            gender:req.body.gender      
        }
    })
    .then(result=>{
        res.status(200).json({
            student:result
        })
    })
    .catch(error=>{
        res.status(500).json({
            error:error
        })
    })
})

module.exports = router;