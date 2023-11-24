const CustomError = require("../errors/customError");

const authenticateUser = (req, _res, next) => {
    const authenticatedUserId = req.user.id;  // The authenticated user's ID
    const requestedUserId = req.params.userId;
  
    if (authenticatedUserId !== requestedUserId) {
      return next(new CustomError('Unauthorized', 403));
    }
  
    next();  
  };


 module.exports = authenticateUser;