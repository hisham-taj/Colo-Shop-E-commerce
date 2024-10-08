
const express = require('express');
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');

const app = express();
const port = 3000;


// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/user")
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error: ", err));


// Session middleware configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_here',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: 'mongodb://localhost:27017/user', 
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Routes
const userRouter = require('./routers/userRouter');
const adminRouter = require('./routers/adminRouter');
app.use('/index', userRouter);
app.use('/admin',adminRouter);

app.listen(port, () => console.log(`Server running on http://localhost:${port}/index`));
