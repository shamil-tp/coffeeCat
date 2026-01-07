const express = require('express')
const router = express.Router()

const { Login, Signup, Logout} = require('../controllers/auth')

router
    .route('/signup')
    .post(Signup)
router
    .route('/login')
    .post(Login)
router
    .route('/logout')
    .get(Logout)
    
module.exports = router