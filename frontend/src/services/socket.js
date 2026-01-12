import { io } from "socket.io-client";

const URL = import.meta.env.VITE_BACKEND_URL; 

const socket = io(URL, {
  autoConnect: false, 
  withCredentials: true,       // CRITICAL: Allows cookies to be sent for auth
  transports: ["websocket"]    // CRITICAL: Forces WebSocket only (Fixes "Interrupted" error)
});

// A helper to verify connection in console
socket.onAny((event, ...args) => {
  console.log("socket event:", event, args);
});

export default socket;