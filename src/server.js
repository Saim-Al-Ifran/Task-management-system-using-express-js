const express = require('express');
const app = express();
const userAuthRoute = require('./routes/userRoute');
const taskRoute = require('./routes/taskRoute');
const adminRoute = require('./routes/adminRoute');
const xss = require('xss-clean');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

require('dotenv').config()



//middleware 
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(xss());

// api prefix
app.use('/api/auth',userAuthRoute);
app.use('/api/user',taskRoute);
app.use('/api/admin',adminRoute);

//default error hanlder
app.use((err, _req, res, _next) => {
	const message = err.message ? err.message : 'Server Error Occurred';
	const status = err.status ? err.status : 500;
	res.status(status).json({
		    message,
                status
	});
});


connectDB(process.env.CONNECTION_STRING)
.then(()=>{
	app.listen(3000, ()=>{
		console.log("Server is Listening at 3000 port")
	})
})
.catch((err)=>{
	  console.log(err.message);
})

