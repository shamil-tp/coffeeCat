# coffeeCat Project Analysis

## Overview
**coffeeCat** is a social media application combining features of Instagram and WhatsApp/modern chat apps. It allows users to post updates, follow others, and chat in real-time.

## Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (using Mongoose)
- **Real-time:** Socket.io
- **Media Storage:** Cloudinary
- **Authentication:** JWT (JSON Web Tokens) in cookies

### Frontend
- **Framework:** Vue.js 3
- **Build Tool:** Vite
- **State Management:** Vuex
- **Routing:** Vue Router
- **Styling:** Bootstrap 5, Tailwind CSS, FontAwesome

## Architecture & Features

### Backend (`/backend`)
1.  **Entry Point (`index.js`):**
    - Configures Express app and Socket.io server.
    - Handles database and Cloudinary connections.
    - Sets up middleware (CORS, Cookie Parser, File Upload).
2.  **Authentication (`routes/authRoute.js`, `controllers/auth.js`):**
    - SignUp, Login, Logout functionality.
    - Uses `bcryptjs` for password hashing.
    - Issues JWTs stored in HTTP-only cookies.
3.  **Main Logic (`routes/mainRoute.js`, `controllers/mainController.js`):**
    - **User Profiles:** Get details, update profile (bio, avatar), search users.
    - **social Graph:** Follow/Unfollow logic.
    - **Posts:** Upload images, captions, delete posts.
    - **Engagement:** Like posts, add/get comments.
    - **Chat:** Find/Create chats, fetch message history, get all user chats.
4.  **Database Models (`/models`):**
    - `User`: Stores profile info, followers, following.
    - `Post`: Links to User, stores image URL, caption, likes.
    - `Comment`: Links to User and Post.
    - `Chat`: Stores member list (users) and last message reference.
    - `Message`: Stores sender, text, seen status, and reference to Chat.

### Frontend (`/frontend`)
1.  **Routing (`src/router/index.js`):**
    - **Public/Auth:** Login, Signup.
    - **Protected:** Profile (`/`), Messages, Add Post, View Profile, Chat (`/chat/:id`).
    - Uses `MainLayout` for global navigation (bottom nav bar).
2.  **State Management (`src/store`):**
    - **Auth Module:** Manages user session and token.
    - **Chat Module:** Tracks active chat.
    - **Post Module:** (Likely manages feed/posts state).
3.  **Real-time Chat:**
    - Integrated using `socket.io-client`.
    - Handles joining rooms, sending/receiving messages, and "seen" status updates.

## Key Observations
- **Hybrid Features:** The app successfully blends social feed features (posts, likes, comments) with direct messaging.
- **Real-time Polish:** The chat implementation attempts to handle complex states like "online count", "seen status", and real-time message delivery.
- **Media Handling:** Direct integration with Cloudinary for handling user avatars and post images is a robust choice.
- **Code Structure:** The backend controller (`mainController.js`) is quite large and handles diverse responsibilities; refactoring into smaller, domain-specific controllers (e.g., `ChatController`, `PostController`) could improve maintainability.
