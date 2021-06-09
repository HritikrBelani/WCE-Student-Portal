const { response } = require('express');
const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const router = express.Router();
// create a post
router.post("/",async(req,res)=>{
    const newPost = new Post(req.body);
    try{
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    }
    catch (err){
        res.status(500).json(err);
    }
});


// update a post

router.put("/:id",async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
            await post.updateOne({$set:req.body});
            res.status(200).json("the post has been updated");
        }
        else{
            res.status(403).json({
                message: "you can update only your post"
            });
        }
    }
    catch(err){
        res.status(500).json(err);
    }
});

// delete a post
router.delete("/:id",async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
            await post.deleteOne();
            res.status(200).json("the post has been delete");
        }
        else{
            res.status(403).json({
                message: "you can delete only your post"
            });
        }
    }
    catch(err){
        res.status(500).json(err);
    }
});


// like/dislike  a post
router.put("/:id/like",async(req,res)=>{
    try{
        const post = await Post.findbyId(req.params.id);
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push : {likes: req.body.userId}});
            res.status(200).json("The post has been liked");
        }
        else{
            await post.updateOne({$pull:{likes: req.body.userId}});
            res.status(200).json("The post has been  disliked");
        }
    }catch(err){
        res.status(500).json(err);
    }
});
// get a post 
router.get("/:id",async(req,res)=>{
    try {
        const post = await Post.findById(req.body.id);
        res.status(200).json(post);

    } catch (error) {
        res.status.json(error);
    }
});
// get all timeline posts 

router.get("/timeline/all",async(req,res)=>{
    try {
        const currentUser = await User.findById(req.body.userId);
        const userPosts = await Post.find({userId:currentUser._id});
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId)=>{
                Post.find({userId:friendId});
            })
        );
        res.json(userPosts.concat(...friendPosts));
    } catch (error) {
        res.status(500).json(error);
    }
});
module.exports = router;