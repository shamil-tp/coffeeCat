const router = require('express').Router()
const {
    UserDetails, 
    UpdateProfile, 
    AllUserList, 
    // FindUserChat, BAD GPT
    UploadPost, 
    GetUserPosts, 
    SearchUser, 
    GetProfileDetails, 
    ToggleFollow, 
    AddComment, 
    GetComments, 
    ToggleLike,
    FindUserChat,
    GetChat,
    GetMessages,
    GetAllUserChats,
    DeletePost,
    DeleteAccount
} = require('../controllers/mainController')

router
    .route('/profile')
    .get(UserDetails)
router
    .route('/update-profile')
    .post(UpdateProfile)
router
    .route('/all-users-list')
    .get(AllUserList)
// router SHIT CODE
//     .route('/find-user-chat/:id')
//     .get(FindUserChat)
router
    .route('/uploadpost')
    .post(UploadPost)
router
    .route('/userposts/:id')
    .get(GetUserPosts)
router
    .route('/search-user')
    .post(SearchUser)
router
    .route('/get-profiledetails/:id')
    .get(GetProfileDetails)
router
    .route('/toggle-follow/:id')
    .post(ToggleFollow)
router.post('/add-comment/:id', AddComment);
router.get('/get-comments/:id', GetComments);

router
    .route('/toggle-like/:id')
    .post(ToggleLike)
router
    .route('/chat/user/:id')
    .post(FindUserChat)
router
    .route('/chat/:id')
    .get(GetChat)
router
    .route('/messages/:chatId')
    .get(GetMessages)
router
    .route('/fetch-all-user-chats/:id')
    .get(GetAllUserChats)
router
    .route('/delete-post/:id')
    .get(DeletePost)
router
    .route('/delete-account')
    .get(DeleteAccount)
// router
//     .route('/chat/:id')
//     .post(FindChat)
module.exports = router