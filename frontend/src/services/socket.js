import { io } from "socket.io-client";

const URL = import.meta.env.VITE_BACKEND_URL; 

const socket = io(URL, {
  autoConnect: false // We will connect manually when the user logs in or opens chat
});

// A helper to verify connection in console
socket.onAny((event, ...args) => {
  console.log("socket event:", event, args);
});

export default socket;