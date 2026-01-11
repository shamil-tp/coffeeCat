const sendCookie = async (user, res) => {
    try {
        const token = await user.getJwtToken()
        const isProduction = process.env.NODE_ENV === 'production';
        const options = {
            expires: new Date(Date.now() + (7 * 60 * 60 * 1000)),
            httpOnly: true,
            secure: isProduction ? true : false,
            sameSite: isProduction ? 'None' : 'Lax',
            path:'/'
        }
  
        return res.cookie('token', token, options).status(200).json({
            message: 'Login Successful',
            success:true
        })
    } catch (e) {
        console.log('error while generating cookie')
        console.log(e)
        return res.status(500).json({
            message:'Cookie Not generated',
            success:false
        })
        
    }
}

module.exports = sendCookie