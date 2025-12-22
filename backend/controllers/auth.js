const User = require('../models/User')

exports.Signup = async (req,res) =>{
    try{
        await User.create(req.body)
    }catch(e){
        return res.status(500).json({messgae:'signup failed',error:e.message})
    }
}