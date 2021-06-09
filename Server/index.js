const express = require("express");
const app = express();
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const PostRoutes = require('./routes/Posts');
dotenv.config();

mongoose.connect(process.env.MONGO_URL,{useNewUrlParser:true,useUnifiedTopology:true},()=>{
    console.log("Connected to MongoDB");
});
// middleware

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use("/api/user",userRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/posts",PostRoutes);
app.listen(5000,()=>{
    console.log('Server is running');
});
