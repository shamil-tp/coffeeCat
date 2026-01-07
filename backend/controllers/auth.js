const User = require('../models/User')
const sendCookie = require('../utils/sendCookie')
const uploadImage = require('../utils/uploadImage')

exports.Signup = async (req, res) => {
    try {
      let { name, username, email, password} = req.body
      // console.log('BODY:', req.body)
      // console.log('FILES:', req.files)
      let dpid = Date.now()
      const user = await User.findOne({email:email})
      if(user){
        return res.status(200).json({
        success: false,
        message: 'Registration Failed User Exist'
      })
      }
      
  
      let avatar = null
  
      if (req.files?.avatar) {
        avatar = await uploadImage(req.files.avatar, null, null, 'coffeecat/dp',`dp__${dpid}`)
      }
      await User.create({
        dpid,
        name,
        username,
        email,
        password,
        avatar: avatar ? avatar.url : null,
      })
  
      return res.status(200).json({
        success: true,
        message: 'Registration successful'
      })
    } catch (e) {
      if (e.code === 11000) {
    const field = Object.keys(error.keyValue)[0]

    return res.status(409).json({
      success: false,
      message: `${field} already exists`,
      field
    })
  }
      console.error(e)
      return res.status(500).json({
        message: 'Something went wrong'
      })
    }
  }


exports.Login = async (req, res) => {
    try {
      const { email, password } = req.body
      const user = await User.findOne({ email:email })
      if (!user) {
        return res.status(400).json({ message: "User not found",success:false })
      }
      const validation = await user.isValidatedPassword(password)
      if (!validation) {
        return res.status(400).json({ message: "password is incorrect",success:false })
      }
      return sendCookie(user, res)
    } catch (e) {
      console.log(e)
      return res.status(500).json({message:"error while login",success:false})
    }
  }

exports.Logout = (req, res) => {
  try{
    res.clearCookie("token");
    return res.status(200).json({ message: "Logout successful",success:true });
  }catch(e){
    console.log(e)
  return res.status(500).json({message:'logout failed',success:false})
 
  }
  
}