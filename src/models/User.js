const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true,
        trim:true
     },
    email: {
         type: String,
         required: true,
         unique: true ,
         trim:true
        },
    password: {
        type: String,
        required: true,
        min: [6, 'Password must be atleast 6 character long']
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
     },
    isBlocked:{
        type:String,
        enum:['true','false'],
        default:'false'
    }
     
  });

  const User = mongoose.model('User',userSchema);

  module.exports = User;
  