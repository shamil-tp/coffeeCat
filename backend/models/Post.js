import mongoose from 'mongoose'

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    image: {
      type: String,
      required: true
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

export default mongoose.model('Post', postSchema)
