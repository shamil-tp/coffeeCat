const express = require('express')
const router = express.Router()

const { Login, Signup} = require('../controllers/auth')

router
    .route('/signup')
    .post(Signup)
router
    .route('/login')
    .post(Login)
    
module.exports = router