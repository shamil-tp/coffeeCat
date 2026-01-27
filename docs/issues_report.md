# Bugs, Issues & Code Quality Report

This document outlines the issues, logical errors, and bad practices identified in the **coffeeCat** codebase.

## 🚨 Critical Issues & Security Vulnerabilities

### 1. Insecure Follow Logic (Impersonation Risk)
- **Location:** `backend/controllers/mainController.js` -> `ToggleFollow`
- **Issue:** The controller relies on `req.body.currentUserId` to identify the user performing the action.
- **Risk:** **High**. An attacker can intercept the request and change `currentUserId` to ANY user's ID, forcing them to follow/unfollow others without their consent.
- **Fix:** Always use `req.user.id` (from the auth middleware) to identify the "actor". Never trust user ID from the request body for actions that belong to the logged-in user.

### 2. Missing Input Validation & Sanitization
- **Location:** `backend/controllers/auth.js`, `backend/controllers/mainController.js`
- **Issue:**
    - **Password:** No strength checks (length, complexity). A user can set "1" as a password.
    - **Email:** No format validation.
    - **Files:** `utils/uploadImage.js` does not validate file types (MIME types). Users could potentially upload script files (`.php`, `.exe`, `.html`) disguised as images if Cloudinary settings aren't strict.
- **Risk:** **Medium/High**. Malformed data in DB, weak account security, potential Remote Code Execution (RCE) via file upload.

### 3. "Optimistic UI" Data Loss Risk
- **Location:** `frontend/src/components/Chat.vue` vs `backend/index.js`
- **Issue:** The frontend adds the message to the UI *immediately* upon sending (`this.messages.push(messageData)`). The backend listens, saves to DB, and broadcasts.
- **Risk:** **Medium**. If the database save fails (e.g., connection lost, validation error), the backend logs the error but the frontend user **still sees the message as "sent"**. It will disappear on refresh, leading to confusion and data loss.

## 🐛 Logical Errors

### 1. Self-Following
- **Location:** `backend/controllers/mainController.js` -> `ToggleFollow`
- **Issue:** There is no check to prevent a user from following themselves.
- **Fix:** Add `if (currentUserId === targetUserId) return res.status(400)...`

### 2. Socket.io State Management
- **Location:** `backend/index.js` -> `join_chat`
- **Issue:** `socket.activeRoom` is assigned a single value. If a user opens the app in two tabs (joining two different chats), `activeRoom` will be overwritten by the latest one.
- **Consequence:** The "Offline user" logic in `disconnect` might notify the wrong room or fail to notify the earlier room.

### 3. Frontend Receiver Calculation
- **Location:** `frontend/src/components/Chat.vue`
- **Issue:** The `receiver` computed property relies on `this.chat` and `this.currentUser`. If `fetchChatById` takes time or fails, `receiver` is null. The `created` hook tries to access `this.receiver._id` for `join_chat` immediately after logic that *might* still be pending or null, potentially causing "Cannot read property '_id' of undfined" errors.

## ⚠️ Bad Practices & Code Quality

### 1. "God Controller" (`mainController.js`)
- **Issue:** This single file handles Profile, Posts, Comments, Search, *and* Chat logic. It is over 600 lines long.
- **Reasoning:** Difficult to maintain, test, and read.
- **Refactor:** Split into `UserController.js`, `PostController.js`, `ChatController.js`.

### 2. Hardcoded & Fragile Paths
- **Location:** `backend/controllers/mainController.js` -> `DeleteAccount`
- **Issue:** The code uses a hardcoded string `coffeeCat/users/${userId}` to delete Cloudinary resources. `const userFolderPath = ...`.
- **Reasoning:** If you ever change the folder structure in `uploadImage`, this function will silently fail to clean up files or delete the wrong files.

### 3. Inconsistent Error Handling
- **Issue:**
    - Some catch blocks return `res.status(500).json(...)`.
    - Others just `console.log(e)` and hang (don't send a response), or send a console log but no proper error code.
    - Example: `backend/index.js` -> `socket.on` logic often just logs errors, giving no feedback to the client.

### 4. Code Hygiene
- **Issue:** Use of `// BAD GPT`, `// router SHIT CODE`, and commented-out dead code blocks.
- **Reasoning:** Makes the codebase look unprofessional and harder to read. Dead code should be removed, not commented out.

### 5. N+1 Query Performance
- **Location:** `GetAllUserChats`
- **Issue:** It fetches chats, then maps over them. If you needed to do DB lookups inside that map (you are lucky you populated earlier), it would be slow.
- **General:** `TotalSummary` runs 4 separate aggregate/count queries sequentially. Using `Promise.all` helps, but these aggregations on large datasets will be heavy.
