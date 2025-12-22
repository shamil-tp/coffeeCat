import mongoose from 'mongoose'

const chatSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }
    ],

    lastMessage: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
)

export default mongoose.model('Chat', chatSchema)
