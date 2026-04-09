const mongoose=require("mongoose");
const bcrypt = require ("bcrypt");
const jwt = require("jsonwebtoken");


const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,

    },
    email:{
        type:String,
        required:true,
        lowercase:true
    },
    username:{
         type:String,
        required:true,
        lowercase:true,
        unique:true
    },
    password:{
        type:String,
        required:[true,"password is required "],


    },
    refreshToken:{
        type:String
    },
    

    
},
{
    timestamps:true
})

//lets use a mongoose middleware >>
userSchema.pre("save",async function (){
    //this pre or post these are called mo goose hooks or mongoose plug ins
    if(!this.isModified("password")) return;
    //basically jer password update zhala tarach he middleware run honar next otherwise jer nahi zhala update ter ethun next()


    this.password = await bcrypt.hash(this.password,10);

})


userSchema.methods.isPasswordCorrect= async function(password){
     return await bcrypt.compare(password,this.password);
    
    }


userSchema.methods.generateAccessToken=function(){
    return jwt.sign({
        id:this._id,
        name:this.name,
        email:this.email,
        username:this.username
    },
    process.env.ACCESS_TOKEN_SECRET,

      {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
      }

)
}

userSchema.methods.generateRefreshToken=function(){
    return jwt.sign({
        _id:this._id,
       
    },
    process.env.REFRESH_TOKEN_SECRET,

      {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
      }

)
}


const User= mongoose.model("User",userSchema);

module.exports = User;
