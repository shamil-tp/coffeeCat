import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },

    avatar: {
      type: String, // URL
      default: ''
    },

    bio: {
      type: String,
      default: ''
    },

    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],

    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  { timestamps: true } // createdAt, updatedAt
)
userSchema.pre('save',async function(){

  if(!(this.isModified('password'))){
      return
  }

  this.password= await bcrypt.hash(this.password,10)
  return

})


userSchema.methods.isValidatedPassword = async function(userSendPassword){
  return await bcrypt.compare(userSendPassword,this.password)
}


userSchema.methods.getJwtToken = function(){
  return jwt.sign(
      {    
          id:this.id,
          name:this.name,
          role:this.role
      },
      process.env.JWT_SECRET,
      {expiresIn:'8h'}
  )
} 

module.exports =  mongoose.model('User', userSchema);
