const express = require('express');
const { authenticate } = require('../middlewares/auth');
const { getAllUsers, blockUser, unblockUser } = require('../controllers/adminController');
const authorizeAdmin = require('../middlewares/authAdmin');
const route = express.Router();

route.get('/users',authenticate,authorizeAdmin,getAllUsers);
route.get('/block/user/:userId',authenticate,authorizeAdmin,blockUser);
route.get('/unblock/user/:userId',authenticate,authorizeAdmin,unblockUser);
 
module.exports = route;