require('dotenv').config()

const express = require('express')
const connectDB = require('./config/db')
const cookieParser = require('cookie-parser')
const cors = require("cors");
const fileUpload = require('express-fileupload')
const connectCloudinary = require('./config/cloudinary')

const app = express()


app.use(cookieParser())



// const allowedOrigins = [
//   "http://localhost:5173",
//   "http://192.168.29.178:5173"
// ];

app.use(cors({
  origin:process.env.FRONTEND_URL,
  credentials: true
}));




app.use(express.urlencoded())
app.use(express.json())
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

const authRotue = require('./routes/authRoute')
const {isLoggedin} = require('./middlewares/authMiddleware')
const mainRoute = require('./routes/mainRoute')

app.use('/api',authRotue)
app.use('/api',isLoggedin,mainRoute)

app.get("/run-test-backend",(req,res)=>{
    return res.send(`<h1 style="text-align:center;font-size:100px;font-weight:700;color:aqua;">backend is running successfully on evenode</h1>`)
})

app.use((req, res) => {
    return res.status(500).json({
        message:"api route failed",
    })
})
const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Server running on http://192.168.29.178:${port}`)
    connectDB()
    connectCloudinary()
});