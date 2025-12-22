require('dotenv').config()

const express = require('express')
const connectDB = require('./config/db')
const cookieParser = require('cookie-parser')
const cors = require("cors");
const fileUpload = require('express-fileupload')

const app = express()


app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.urlencoded())
app.use(express.json())
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

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
    console.log(`Server running on http://localhost:${port}`)
    connectDB()
    connectCloudinary()
});