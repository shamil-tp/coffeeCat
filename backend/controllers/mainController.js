const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require('../models/Comment');
const Chat = require('../models/Chat')
const Message = require('../models/Message')
const uploadImage = require("../utils/uploadImage");

exports.UserDetails = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });
    if (!user) {
      return res
        .status(401)
        .json({ message: "user not found in database", status: false });
    }
    return res
      .status(200)
      .json({
        message: "user details is send",
        status: false,
        user: user,
        token: req.cookies.token,
      });
  } catch (e) {
    console.log(e, "fetching user details failed");
    return res
      .status(500)
      .json({ message: "cannot aquire user details", status: false });
  }
};

exports.UpdateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const { name, username, bio } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update text fields
    if (name) user.name = name;
    if (username) user.username = username;
    if (bio !== undefined) user.bio = bio;

    // Handle avatar overwrite
    if (req.files?.avatar) {
      const avatar = req.files.avatar;

      const uploadedAvatar = await uploadImage(
        avatar,
        400,
        400,
        "coffeecat/dp",
        `dp__${user.dpid}` // SAME public_id → overwrite true
      );

      user.avatar = uploadedAvatar.url;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        name: user.name,
        username: user.username,
        bio: user.bio,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error(error);

    // Duplicate username handling
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(409).json({
        success: false,
        message: `${field} already exists`,
        field,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Profile update failed",
    });
  }
};

exports.AllUserList = async (req, res) => {
  try {
    let userList = await User.find();
    if (!userList) {
      return res
        .status(400)
        .json({
          message: "user list not created in the backend",
          success: false,
        });
    }
    return res
      .status(200)
      .json({
        message: "All user details collected",
        success: true,
        users: userList,
      });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "error while getting user info", success: false });
  }
};
//    JUST COPY PASTED BELOW CODE NO USE. SOMETHING THAT EXIST TO TAKE FREE SPACE. WASTE !!!

// exports.FindUserChat = async (req, res) => {
//   try {
//     let userChat = await User.findOne({ _id: req.params.id });
//     if (!userChat) {
//       return res
//         .status(400)
//         .json({ message: "user not found in db", success: false });
//     }
//     return res
//       .status(200)
//       .json({ message: "chat send", success: true, user: userChat });
//   } catch (e) {
//     return res
//       .status(500)
//       .json({ message: "user chat not found", success: false });
//   }
// };

exports.UploadPost = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.files.post);
    console.log(req.user);

    if (!req.body.caption)
      return res
        .status(400)
        .json({ message: "caption not found", success: false });
    let { caption } = req.body;
    if (!req.files.post)
      return res
        .status(400)
        .json({ message: "post file not found", success: false });
    let { post } = req.files;
    let postId = Date.now();

    const uploadedPost = await uploadImage(
      post,
      null,
      null,
      `coffeecat/posts/${req.user.username}`,
      `post_${req.user.username}_${postId}`
    );
    console.log(uploadedPost);
    await Post.create({
      user: req.user.id,
      image: {
        url: uploadedPost.url,
        publicId: uploadedPost.public_id,
      },
      caption: caption,
    });
    console.log("post uploaded");
    return res.status(200).json({ message: "post uploaded", success: true });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "server error upload failed", success: false });
  }
};

exports.GetUserPosts = async (req, res) => {
  try {
    let posts = await Post.find({ user: req.params.id });

    return res
      .status(200)
      .json({ message: "post uploaded", success: true, posts: posts });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "posts not found", success: false });
  }
};
exports.SearchUser = async (req, res) => {
  try {
    // 1. Find the user
    console.log(req.body.username);
    const user = await User.findOne({ username: req.body.username });

    // 2. SAFETY CHECK: Stop if user doesn't exist
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    // 3. FIX: Use countDocuments (plural)
    const postCount = (await Post.countDocuments({ user: user._id })) || 0;

    // 4. Return the data (fixed the message too)
    return res.status(200).json({
      message: "User found",
      success: true,
      user: user,
      postCount: postCount, // You calculated it, so you should probably send it!
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

exports.GetProfileDetails = async (req, res) => {
  try {
    const profile = await User.findOne({ _id: req.params.id });
    if(!profile){
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    const postCount = (await Post.countDocuments({ user: profile._id})) || 0;
    return res.status(200).json({
      message: "User found",
      success: true,
      profile:profile,
      postCount: postCount, // You calculated it, so you should probably send it!
    });

  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

exports.ToggleFollow = async (req, res) => {
  try {
    const targetUserId = req.params.id; // Profile you are viewing
    const currentUserId = req.body.currentUserId; // You

    // 1. Find the target user to check their current followers
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Check if YOU are already in their followers list
    // We use toString() because ObjectIds are objects
    const isFollowing = targetUser.followers.some(
      (followerId) => followerId.toString() === currentUserId
    );

    if (isFollowing) {
      // === UNFOLLOW LOGIC ===
      // Remove You from Their followers
      await User.findByIdAndUpdate(targetUserId, { $pull: { followers: currentUserId } });
      // Remove Them from Your following
      await User.findByIdAndUpdate(currentUserId, { $pull: { following: targetUserId } });

      return res.status(200).json({ success: true, message: "Unfollowed" });
    } else {
      // === FOLLOW LOGIC ===
      // Add You to Their followers
      await User.findByIdAndUpdate(targetUserId, { $addToSet: { followers: currentUserId } });
      // Add Them to Your following
      await User.findByIdAndUpdate(currentUserId, { $addToSet: { following: targetUserId } });

      return res.status(200).json({ success: true, message: "Followed" });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// 1. ADD COMMENT
exports.AddComment = async (req, res) => {
  try {
    const { text, userId } = req.body; // We get text and userId from frontend
    const postId = req.params.id;

    // Create the comment
    const newComment = await Comment.create({
      text: text,
      user: userId,
      post: postId
    });

    // Update the Post to include this comment ID (Optional, but good for counting)
    await Post.findByIdAndUpdate(postId, { $push: { comments: newComment._id } });

    // Populate the user details immediately so the frontend can show the avatar
    const populatedComment = await newComment.populate('user', 'name username avatar');

    return res.status(200).json({ success: true, comment: populatedComment });

  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 2. GET COMMENTS
exports.GetComments = async (req, res) => {
  try {
    // Find comments belonging to this Post ID and Populate User data
    const comments = await Comment.find({ post: req.params.id })
                                  .populate('user', 'name username avatar')
                                  .sort({ createdAt: -1 }); // Newest first

    return res.status(200).json({ success: true, comments: comments });
  } catch (e) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.ToggleLike = async (req,res) => {
  try{
    let postId = req.params.id
    let post = await Post.findOne({_id:postId})
    if(post.likes.includes(req.user.id)){
      post.likes.splice(post.likes.indexOf(req.user.id),1)
      post.save()
      return res.status(200).json({message:'like removed',success:true})
    }
    post.likes.push(req.user.id)
    post.save()
    return res.status(200).json({message:'like added',success:true})

  }catch(e){
    console.log(e)
    return res.status(500).json({message:'error toggling like',success:false})
  }
}
exports.FindUserChat = async (req,res) =>{
  try{
    let chat = await Chat.findOne({members: {$all:[req.params.id,req.user.id]}}).populate('members','_id username name avatar')
    if(!chat){
      let newChat = await Chat.create({
        members:[req.params.id,req.user.id]
      })
      await newChat.populate('members','_id username name avatar')
      console.log(newChat)
      return res.status(200).json({message:'new chat created',success:true,chat:newChat})
    }
    return res.status(200).json({message:'chat exists and send',success:true,chat:chat})
  }catch(e){
    console.log(e)
    return res.status(500).json({message:'error finding profile chat',success:false})
  }
}
exports.GetChat = async (req,res) =>{
  try{
    let chat = await Chat.findOne({_id:req.params.id}).populate('members','_id username name avatar')
    // if(!chat){
    //   let newChat = await Chat.create({
    //     members:[req.params.id,req.user.id]
    //   })
    //   await newChat.populate('members','_id username name avatar')
    //   console.log(newChat)
    //   return res.status(200).json({message:'new chat created',success:true,chat:newChat})
    // }
    return res.status(200).json({message:'chat send',success:true,chat:chat})
  }catch(e){
    console.log(e)
    return res.status(500).json({message:'error finding chat',success:false})
  }
}

exports.GetMessages = async(req,res) =>{
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name avatar email")
      .sort({ createdAt: 1 }); // Sort by oldest to newest

    res.json(messages);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
// controllers/mainController.js

exports.GetAllUserChats = async (req, res) => {
  try {
    const currentUserId = req.params.id;

    // 1. Find chats & Populate details
    // Sort by 'updatedAt: -1' so the newest messages appear at the top
    const userChats = await Chat.find({ 
      members: { $in: [currentUserId] } 
    })
    .populate('members', 'name username avatar bio') // 👈 Get name/avatar
    .populate('lastMessage') // 👈 Get the last text preview
    .sort({ updatedAt: -1 });

    if (!userChats || userChats.length === 0) {
      // Return empty array (Status 200), not an error
      return res.status(200).json({ users: [], success: true });
    }

    // 2. Transform Data for Frontend
    // We need to extract the "Other Person" from each chat
    const formattedChats = userChats.map(chat => {
        
        // Find the member who is NOT the current user
        const otherUser = chat.members.find(
            member => member._id.toString() !== currentUserId.toString()
        );

        if (!otherUser) return null;

        // Return a hybrid object:
        // - ID = Chat ID (so router.push works)
        // - Name/Avatar = Other User's info
        // - Bio = The last message (like WhatsApp)
        return {
            _id: chat._id, // 👈 IMPORTANT: Use Chat ID here for navigation
            name: otherUser.name,
            avatar: otherUser.avatar,
            // If there is a lastMessage, show it. Otherwise show their bio.
            bio: chat.lastMessage ? chat.lastMessage.text : otherUser.bio, 
            updatedAt: chat.updatedAt
        };
    }).filter(Boolean); // Remove any nulls

    return res.status(200).json({ 
        message: "Chats fetched", 
        users: formattedChats, // Frontend calls this "users"
        success: true 
    });

  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: e.message, success: false });
  }
}