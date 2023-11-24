const CustomError = require("../errors/customError");
const User = require("../models/User");

const getAllUsers = async(_req,res,next)=>{
        try{
              const user = await User.find({});
              if(!user){
                    return next(new CustomError('Not User found',404));
              }
              res.status(200).json({user});

        }catch(err){
             next(new CustomError('Getting all user failed',500));
        }
}

const blockUser = async(req,res,next)=>{
      const userId = req.params.userId;

      try{
            const user = await User.findOne({_id:userId});
            if(!user){
                   return next(new CustomError('User not found',404));
            }   
            if(user.isBlocked == 'true'){
                  return next(new CustomError('User already Blocked',406));
            }
            user.isBlocked = 'true';
            await user.save();
            res.status(200).json({message:'User action blocked successfully'});

      }catch(err){
            next(new CustomError('User blocking failed',500));
      }
}

const unblockUser = async(req,res,next)=>{
      const userId = req.params.userId;
      try{
            const user = await User.findOne({_id:userId});
            if(!user){
                   return next(new CustomError('User not found',404));
            }   
            if(user.isBlocked == 'false'){
                  return next(new CustomError('User already unblocked',406));
            }
            user.isBlocked = 'false';
            await user.save();
            res.status(200).json({message:'User action unblocked successfully'});
      }catch(err){
            next(new CustomError('User unblocking failed',500));
      }
}

module.exports = {
    getAllUsers,
    unblockUser,
    blockUser
}