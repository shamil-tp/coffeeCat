require('dotenv').config()


const http = require('http');
const { Server } = require('socket.io'); 
const express = require('express')
const connectDB = require('./config/db')
const cookieParser = require('cookie-parser')
const cors = require("cors");
const fileUpload = require('express-fileupload')
const connectCloudinary = require('./config/cloudinary')
const Message = require('./models/Message')
const User = require('./models/User')
const Chat = require('./models/Chat')

const app = express()

app.set('trust proxy', 1);

const server = http.createServer(app);

// 2. Initialize Socket.io and attach it to the server
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL, // Ensure this matches Vercel URL exactly (no trailing slash)
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ["websocket", "polling"] // 👈 Add this line to ensure compatibility
});

app.use(cors({
  origin:process.env.FRONTEND_URL,
  credentials: true
}));

// 3. Create a connection event (The "Phone Operator")
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // We will add chat logic here later
    // 1. JOIN ROOM
  // The frontend sends the Chat ID to join
  socket.on("join_chat", async(chatId,receiverId) => {
    socket.join(chatId);

    socket.activeRoom = chatId

    // 🔥 FIX 2: Calculate count immediately
    const room = io.sockets.adapter.rooms.get(chatId);
    const size = room ? room.size : 0;

    // 🔥 FIX 3: Broadcast count to EVERYONE in room (so they see you are online)
    io.to(chatId).emit("people_count", size);
    // try{
    //   await Message.updateMany(
    //     {
    //       chat:chatId,
    //       sender:receiverId,
    //       seen:false
    //     },
    //     {
    //       $set:{seen:true}
    //     }
    //   )
    //   console.log("sender _id: ",user)
    // }catch(e){
    //   console.log(e)
    //   console.log("error while reading message")
    // }
    try {
      // Update DB
      await Message.updateMany(
        { chat: chatId, sender: receiverId, seen: false },
        { $set: { seen: true } }
      );
      
      // 🔥 FIX 4: Tell the other user "I read your messages"
      // This turns their grey ticks blue instantly
      socket.to(chatId).emit("messages_read");

    } catch (e) {
      console.log(e);
    }
    console.log(`User ${socket.id} joined room: ${chatId}`);
  });

//   // 2. SEND MESSAGE
//   // The frontend sends the message data
//   socket.on("new_message", (newMessageReceived) => {
//     const { chatId } = newMessageReceived;
    
//     // Check if chat ID exists
//     if (!chatId) return console.log("No Chat ID provided");

//     // Broadcast to everyone in that room EXCEPT the sender
//     // .to(room).emit(event, data)
//     socket.to(chatId).emit("message_received", newMessageReceived);
    
//     // (Optional) If you want to send it to the sender too (usually handled by UI optimistically), remove "to"
//     // io.in(chatId).emit("message_received", newMessageReceived);
//   });


socket.on("new_message", async (newMessageReceived) => {
    const { chatId, text, sender } = newMessageReceived;

    if (!chatId || !text) return;
  const room = io.sockets.adapter.rooms.get(chatId);
    const seen = room?.size > 1 ? true : false;
    console.log("room: ", room," seen: ",seen)
    try {
      // 1. Save to MongoDB
      let message = await Message.create({
        sender: sender._id,
        text: text,
        chat: chatId,
        seen:seen
      });

      // 2. Populate the sender info (so the frontend gets name & avatar)
      message = await message.populate("sender", "name avatar");
      // (Optional) Populate the chat info if needed
      message = await message.populate("chat"); 

      // 3. Send the SAVED message to the room
      // We send the 'message' object from DB because it has the real _id and createdAt
      socket.to(chatId).emit("message_received", message);
      socket.to(chatId).emit("people_count",room?.size)
      
      // OPTIONAL: Update the Chat model to show "Latest Message" in the inbox
      await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id });

    } catch (error) {
      console.log("Error saving message:", error);
    }
  });




  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
    // 🔥 FIX 6: Handle Offline Status
    // If we stored the room ID earlier, we can notify the remaining person
    if (socket.activeRoom) {
      const chatId = socket.activeRoom;
      const room = io.sockets.adapter.rooms.get(chatId);
      const size = room ? room.size : 0;
      
      // Tell the person left behind that you are gone
      io.to(chatId).emit("people_count", size);
    }
  });
});

app.use(cookieParser())



// const allowedOrigins = [
//   "http://localhost:5173",
//   "http://192.168.29.178:5173"
// ];






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

// app.listen(port, () => {
//     console.log(`Server running on http://192.168.29.178:${port}`)
//     connectDB()
//     connectCloudinary()
// });

server.listen(port, () => {
    console.log(`Server running on port:${port}`)
    connectDB()
    connectCloudinary()
});