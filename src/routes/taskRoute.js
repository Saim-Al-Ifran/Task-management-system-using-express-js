const express = require('express');
 

const {
    createTaskController,
    getAllTaskController,
    deleteTaskController,
    completeTaskController,
    searchTaskController,
    priorityTaskController,
    updateTaskController,
    getSingleTaskController
} = require('../controllers/TaskController');
 
const { authenticate } = require('../middlewares/auth');
const { authorizeTaskAccess } = require('../middlewares/taskAuth');


const route = express.Router();


route.post('/tasks',authenticate,createTaskController);

route.get('/tasks',authenticate,getAllTaskController);

route.get('/tasks/search',authenticate,searchTaskController);

route.get('/tasks/:taskId',authenticate,authorizeTaskAccess,getSingleTaskController);

route.put('/tasks/:taskId',authenticate,authorizeTaskAccess,updateTaskController);//this route need to be teseted

route.delete('/tasks/:taskId',authenticate,authorizeTaskAccess,deleteTaskController);//this route need to be teseted

route.patch('/tasks/complete/:taskId',authenticate,authorizeTaskAccess,completeTaskController);//this route need to be teseted

route.patch('/tasks/priority/:taskId',authenticate,authorizeTaskAccess,priorityTaskController);//this route need to be teseted
 

 

module.exports = route;