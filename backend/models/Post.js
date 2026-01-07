const mongoose = require('mongoose')
const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    image: {
      url:{
        type:String,
        required:true,
      },
      publicId:{
        type:String,
        required:true,
      }
    },

    caption: {
      type: String,
      default: ''
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],

    commentsCount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
)

// export default mongoose.model('Post', postSchema)
module.exports = mongoose.model('Post',postSchema)
