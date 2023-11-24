const CustomError = require('../errors/customError');
const Task = require('../models/Task');


const createTaskController = async(req,res,next)=>{
    
    const {title,description,dueDate,status,priority,category} = req.body;
    const userId = req.user.id;
    try {
         
        const newTask = new Task({
          title: title,
          description: description,
          dueDate: dueDate,
          author: userId, // Assuming you have the author's ObjectId in the request body
          status: status,
          priority: priority,
          category: category, 
        });
    
        // Save the task to the database
        await newTask.save();
        res.status(201).json({ message: 'Task created successfully', task: newTask });

      } catch (error) {
      
        console.error(error);
        next(new CustomError('Error creating task',400));
      }
};

const getAllTaskController = async(req,res,next)=>{
    const userId = req.user.id;
    try{
          const task = await Task.find({author:userId});
          if(!task){
              return  next(new CustomError('No task found',404))
          }
          res.status(200).json({message:'found all tasks',task});
    }catch(err){
          // console.error(err);
          next(new CustomError('Fetching task Failed',501));
    }
};

const getSingleTaskController = async(req,res,next)=>{
    try{
        const task = req.task;
        res.status(200).json({message:'Found task',task});
    }catch(err){
        console.error(err);
        next(new CustomError('Failed to get singleTask',502));
    }
}

const updateTaskController = async(req,res,next)=>{  
            const taskId = req.task._id;  
            const updatedData = req.body;  

            try {
                const updatedTask = await Task.findByIdAndUpdate(
                    taskId,
                    updatedData,
                    { new: true, runValidators: true }
                );

                if (!updatedTask) {
                    return next(new CustomError('Task not found', 404));
                }

                res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
            } catch (err) {
                console.error(err.message);
                next(new CustomError('Updating task failed', 500));
            }
};

const deleteTaskController   = async(req,res,next)=>{
    const taskId = req.params.taskId; // Assuming taskId is passed as a route parameter

    try {
        const deletedTask = await Task.findByIdAndDelete(taskId);

        if (!deletedTask) {
            return next(new CustomError('Task not found', 404));
        }

        res.status(202).json({message:"Task deleted successfully"});  
    } catch (err) {
        console.error(err.message);
        next(new CustomError('Deleting task failed', 500));
    }
};


const completeTaskController = async(req,res,next)=>{
    const taskId = req.params.taskId;
    const {newStatus} = req.body;

    try{
          const task = await Task.findById({_id:taskId});
          if(!task){
             return  next(new CustomError('Task not found',403));
          }
          task.status = newStatus;

          await task.save();
          res.status(200).json({message:'Task completed successfully',task});
    }catch(err){
        
        next(new CustomError('Completing task failed',509));
    }
};

const priorityTaskController = async(req,res,next)=>{
    const taskId = req.params.taskId; 
    const {newPriority} = req.body;  
    console.log(newPriority);

    try {
        const task = await Task.findById(taskId);

        if (!task) {
            return next(new CustomError('Task not found', 404));
        }
        task.priority = newPriority;
        const updatedTask = await task.save();

        res.status(200).json({ message: 'Priority updated successfully', task: updatedTask });
    } catch (err) {
        console.error(err.message);
        next(new CustomError('Updating priority failed', 500));
    }
};

const searchTaskController = async(req,res,next)=>{
    const { title } = req.query;
      
    try {
      const tasks = await Task.find({
        title: {
          $regex: title,
          $options: 'i',
        },
      });
  
      if (tasks.length === 0) {
        return next(new CustomError('Task not found with that title', 402));
      }
      res.status(200).json(tasks);
    } catch (err) {
      console.log(err.message);
      next(new CustomError('Error searching for tasks', 501));
    }
};


module.exports = {
    createTaskController,
    updateTaskController,
    getAllTaskController,
    getSingleTaskController,
    deleteTaskController,
    completeTaskController,
    priorityTaskController,
    searchTaskController
};


