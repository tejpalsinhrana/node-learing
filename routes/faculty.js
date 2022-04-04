const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");

router.get('/', (req, res, next)=>{
    res.status(200).json({
        message: 'This is a faculty get request'
    })
})

router.post('/', (req, res, next)=>{
    res.status(200).json({
        message: 'This is a faculty post request'
    })
})


module.exports = router;