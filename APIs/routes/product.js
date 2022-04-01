const express = require('express');
const router = express.Router();
const Product = require("../model/product")
const mongoose = require("mongoose");

// Get all products
router.get('/all',(req, res, next)=>{
    Product.find()
    .then(result=>{
        res.status(200).json({
            products:result
        })
    })
    .catch(error=>{
        res.status(500).json({
            error:error
        })
    })
})

// Find product by id
router.get('/find/:id',(req, res, next)=>{
    Product.findById(req.params.id)
    .then(result=>{
        res.status(200).json({
            product:result
        })
    })
    .catch(error=>{
        res.status(500).json({
            error:error
        })
    })
})

// Create product
router.post('/create', (req, res, next)=>{
    const product = new Product({
        _id:new mongoose.Types.ObjectId,
        code:req.body.code,
        title:req.body.title,
        description:req.body.description,
        mrp:req.body.mrp,
        discountPrecent:req.body.discount,
        imagePath:req.body.image
    })
    product.save()
    .then(result=>{
        res.status(200).json({
            product:result
        })
    })
    .catch(error=>{
        res.status(500).json({
            error:error
        })
    })
})

// Delete product by id 
router.delete('/delete/:id', (req, res, next)=>{
    id = req.params.id;
    Product.remove({_id:id})
    .then(result=>{
        res.status(200).json({
            message:"Product deleted successfully",
            result: result
        })
    })
    .catch(error=>{
        res.status(500).json({
            error:error
        })
    })
})

// Update product by id 
router.put('/update/:id', (req, res, next)=> {
    Product.findOneAndUpdate({_id:req.params.id},{
        $set:{
            code:req.body.code,
            title:req.body.title,
            description:req.body.description,
            mrp:req.body.mrp,
            discountPrecent:req.body.discount,
            imagePath:req.body.image  
        }
    })
    .then(result=>{
        res.status(200).json({
            product:result
        })
    })
    .catch(error=>{
        res.status(500).json({
            error:error
        })
    })
})

module.exports = router;