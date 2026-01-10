import { io } from "socket.io-client";

const URL = "http://localhost:3000"; 

const socket = io(URL, {
  autoConnect: false // We will connect manually when the user logs in or opens chat
});

// A helper to verify connection in console
socket.onAny((event, ...args) => {
  console.log("socket event:", event, args);
});

export default socket;