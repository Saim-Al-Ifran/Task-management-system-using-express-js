const CustomError = require("../errors/customError");
const Task = require("../models/Task");

const authorizeTaskAccess = async (req, res, next) => {
    const userId = req.user.id;
 
    try {
      const taskId = req.params.taskId;
      const task = await Task.findOne({ _id: taskId });
  
      if (!task) {
        return next(new CustomError('Task not found', 402));
      }
      console.log({
        userId:userId,
        authorId:task.author.toString()
    });
  
      if (task.author.toString() !== userId) {
        return next(new CustomError('Unauthorized', 403));
      }

      req.task = task;  
      next(); 
    } catch (err) {
      console.error(err);
      next(new CustomError('Failed to get singleTask', 502));
    }
  };

  module.exports = {
    authorizeTaskAccess
  }
  