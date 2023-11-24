const CustomError = require("../errors/customError");
const User = require("../models/User");
const Task = require("../models/Task");

const getUser = async(req,res,next)=>{  
        const userId = req.params.userId;
        try{
              const userInfo =  await User.find({_id:userId });
              res.status(200).json({userInfo});
        }catch(err){
               next(new CustomError('Failed to get User',501));
        }
}
const updateUser = async(req,res,next)=>{
      const {username,email} = req.body;
      const userId = req.params.userId;
      try{
            const user = await User.findOne({_id:userId});
            if(!user){
                    return next(new CustomError('User not found!',402));
            }
            user.username = username;
            user.email = email;
            await user.save();
            const responseUser = {
                username:user.username,
                email:user.email
            }
            res.status(200).json({responseUser});

      }catch(err){
          //console.log(err.message);
          next(new CustomError('Updating User failed',501));
      }
}

const getTaskStats = async(req,res,next)=>{
      try{
        const userId = req.user.id; 

        const completedTasksCount = await Task.countDocuments({
          author: userId,
          status: 'Completed',
        });

        const incompleteTasksCount = await Task.countDocuments({
          author: userId,
          status: { $ne: 'Completed' },
        });
    
        res.status(200).json({
          completedTasks: completedTasksCount,
          incompleteTasks: incompleteTasksCount,
        });
      }catch(err){
          console.log(err.message);
          next(new CustomError('Error retrieving task statistics', 500));
      }
}


// const getCategoriesFromTasks = async (req, res, next) => {
//     const authorId = req.user.id;
  
//     try {
//       const categories = await Task.aggregate([
//         { $match: { author: authorId } }, // Filter tasks by author
//         { $group: { _id: '$category' } },
//         { $project: { category: '$_id', _id: 0 } }
//       ]);
  
//       res.status(200).json({ categories });
//     } catch (err) {
//       console.error(err);
//       next(new CustomError('Failed to fetch categories from tasks', 500));
//     }
//   };
  
  

module.exports ={
    getUser,
    updateUser,
    getTaskStats,
    
}