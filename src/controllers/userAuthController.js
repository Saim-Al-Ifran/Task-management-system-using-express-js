const CustomError = require('../errors/customError');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcrypt');
const {jwtSecretKey} = require('../secret')

const registerController = async(req,res,next)=>{
        const {username,email,password,role} = req.body;
        try{
              const user = await User.findOne({email:email});
              if(user){
                    return next(new CustomError('User already exists with this email',403));
              }

              const saltRounds = 10;
              const hashedPassword = await bcrypt.hash(password,saltRounds);
              const newUser = new User({username,email,password:hashedPassword,role});
              
              await newUser.save();

              const responseUser = {
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
              };
              
              return res.status(201).json({message:'User Created successfully',responseUser});

        }catch(err){
             next(new CustomError('Something went wrong',500));
        }
};

const loginController = async(req,res,next)=>{
      const{email,password} = req.body;
      try{
        const user = await User.findOne({email:email});
        if(!user){
              return next(new CustomError('User not found',404));
        }      

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
              return next(new CustomError('Invalid Credential',403));
        }

        const payload = {
            id:user.id,
            name:user.username,
            email:user.email,
            role:user.role
        }

        const token = jwt.sign(payload,jwtSecretKey,{expiresIn:'1hr'});
        res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 });
        if(!token){
             return next(new CustomError('Failed to generate token'));
        }

        return res.status(202).json({message:'Login Successfull',token});

      }catch(err){
            next(new CustomError('Something went wrong',500));
      }

};

const logoutController =  (_req, res) => {
      res.clearCookie('jwt');
      res.status(200).json({ message: 'Logged out successfully' });
};
    

const resetPassController = async(req,res,next)=>{

        try{
              const userId = req.user.id;
              const user = await User.findById({_id:userId});          
              if(!user){
                      next(new CustomError('Unauthorized',401));
              }
              const { oldPassword, newPassword } = req.body;

              if (!await bcrypt.compare(oldPassword, user.password)) {
                  return next(new CustomError('Incorrect old password', 400));
              }
              const hashedPassword = await bcrypt.hash(newPassword, 10);

              // Update the user's password
              user.password = hashedPassword;
              await user.save();
          
              res.json({ message: 'Password changed successfully' });

        }catch(err){

        }

};


module.exports ={
    registerController,
    loginController,
    logoutController,
    resetPassController
}