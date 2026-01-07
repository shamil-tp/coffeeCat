const jwt = require('jsonwebtoken')

exports.isLoggedin = (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.clearCookie('token').status(401).json({message:'no token in middleware'})
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        return next()
    } catch (e) {
        console.log(e)
        return res.clearCookie('token').status(401).json({message:'Please login again'})
       
    }
}
