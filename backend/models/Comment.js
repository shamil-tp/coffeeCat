const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

// ✅ AUTOMATICALLY INCREMENT COMMENT COUNT
// We use 'post' save instead of 'pre' save to ensure the comment 
// was actually successful before we count it.
commentSchema.post('save', async function (doc) {
  try {
    // 'doc' refers to the comment that was just saved
    await mongoose.model('Post').findByIdAndUpdate(doc.post, {
      $inc: { commentsCount: 1 } // Increment count by 1
    });
  } catch (error) {
    console.log('Error updating comment count:', error);
  }
});

// ✅ (OPTIONAL) AUTOMATICALLY DECREMENT IF DELETED
// If you ever delete comments, you'll want this too:
commentSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    try {
      await mongoose.model('Post').findByIdAndUpdate(doc.post, {
        $inc: { commentsCount: -1 } // Decrement count by 1
      });
    } catch (error) {
      console.log('Error decreasing comment count:', error);
    }
  }
});

module.exports = mongoose.model('Comment', commentSchema);