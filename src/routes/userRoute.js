const express = require('express');
 
const {
     registerController,
     loginController,
     logoutController,
     resetPassController
     } = require('../controllers/userAuthController');

const { authenticate } = require('../middlewares/auth');
const { validateLogin, validateRegistration } = require('../validators/auth');
const runValidation = require('../validators');
const { getUser, updateUser, getTaskStats } = require('../controllers/userController');
const authenticateUser = require('../middlewares/authUser');
 

  
const route = express.Router();

// user auth route
route.post('/register',validateRegistration,runValidation,registerController);
route.post('/login',validateLogin,runValidation,loginController);
route.post('/logout',authenticate,logoutController);
route.post('/change-password',authenticate,resetPassController);

// user action route
route.get('/user/:userId',authenticate,authenticateUser,getUser);
route.put('/user/:userId',authenticate,authenticateUser,updateUser);
route.put('/user/:userId',authenticate,authenticateUser,updateUser);
route.get('/user/dashboard/stats',authenticate,getTaskStats);
//route.get('/user/dashboard/categories',authenticate,getCategoriesFromTasks);

 
 

module.exports = route;