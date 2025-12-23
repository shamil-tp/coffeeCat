const User = require('../models/User')
const sendCookie = require('../utils/sendCookie')
const uploadImgae = require('../utils/uploadImage')

exports.Register = async (req, res) => {
    try {
      let { name, username, email, password} = req.body
      console.log('BODY:', req.body)
      console.log('FILES:', req.files)
  
      let dp = null
  
      if (req.files?.photo) {
        dp = await uploadImage(req.files.photo, 400, 400, 'dp')
      }
  
      await User.create({
        name,
        username,
        mail: email,
        phone,
        role,
        password,
        dp: dp ? dp.url : null,
      })
  
      return res.status(200).json({
        message: 'Registration successful'
      })
    } catch (e) {
      console.error(e)
      return res.status(500).json({
        message: 'Something went wrong'
      })
    }
  }


exports.Login = async (req, res) => {
    try {
      const { username, password } = req.body
      const user = await User.findOne({ username: username })
      if (!user) {
        return res.status(400).json({ message: "User not found" })
      }
      const validation = await user.isValidatedPassword(password)
      if (!validation) {
        return res.status(400).json({ message: "password is incorrect" })
      }
      req.user = username
      return sendCookie(user, res)
    } catch (e) {
      console.log(e)
      return res.status(500).json({message:"error while login"})
    }
  }