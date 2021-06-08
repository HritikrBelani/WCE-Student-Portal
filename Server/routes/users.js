const express = require("express");
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

 // update a user
router.put("/:id",(req,res)=>{
    console.log('in update');
    if(req.params.id===req.body.UserId || req.body.isAdmin){
        if(req.body.password){
            bcrypt.genSalt(10).then(salt=>{
                bcrypt.hash(req.body.password,salt).then(hashedPassword=>{
                    req.body.password = hashedPassword;
                    User.findByIdAndUpdate(req.params.id,{$set:req.body}).then(user=>{
                        res.status(200).json(user);
                    }).catch(err=>{
                        console.log(err);
                    });
                }).catch(err=>{
                    console.log(err);
                });
            }).catch(err=>{
                console.log(err);
            });
        }
        else{
            User.findByIdAndUpdate(req.params.id,{$set:req.body}).then(user=>{
                res.status(200).json(user);
            }).catch(err=>{
                console.log(err);
            });
        }
    }
    else{
        res.status(403).json({
            message: 'You can update only your account'
        });
    }
});
// Delete a User account
router.delete('/:id',(req,res)=>{
    if(req.params.id===req.body.UserId || req.body.isAdmin){
            User.findByIdAndDelete(req.params.id).then(user=>{
                if(user){
                    res.status(200).json(user);
                }
                else{
                    res.status(200).json({
                        message:'No Such user found'
                    });
                }
            }).catch(err=>{
                console.log(err);
            });
        }
    else{
        res.status(500).json({
            message: 'you can only delete your account'
        });
    }
});
// Get a User
router.get("/:id",(req,res)=>{
    User.findById(req.params.id).then(user=>{
        if(user){
            res.status(200).json(user);
        }
        else{
            res.status(404).json({
                message: "User Not found"
            });
        }
    }).catch(err=>{
        res.status(500).json(err);
    });
});

// Follow a User

router.put("/:id/follow",async (req,res)=>{
    if(req.params.id !== req.body.UserId){
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.UserId);
            if(!user.followers.includes(req.body.UserId)){
                await user.updateOne({$push : {followers: req.body.UserId}});
                await currentUser.updateOne({$push: {following: req.params.id}});
                res.status(200).json({
                    message: "You started  following this user"
                });
            }
            else{
                res.status(403).json({
                    message: 'You already follow this user'
                });
            }    
        } catch (error) {
            res.status(500).json(error);
        }
    }
    else{
        res.status(500).json({
            message:'You cannot Follow yourself'
        });
    }
});

router.put("/:id/unfollow",async (req,res)=>{
    if(req.params.id !== req.body.UserId){
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.UserId);
            if(user.followers.includes(req.body.UserId)){
                await user.updateOne({$pull : {followers: req.body.UserId}});
                await currentUser.updateOne({$pull: {following: req.params.id}});
                res.status(200).json({
                    message: "You started unfollowing this user"
                });
            }
            else{
                res.status(403).json({
                    message: 'You do not follow this user'
                });
            }    
        } catch (error) {
            res.status(500).json(error);
        }
    }
    else{
        res.status(500).json({
            message:'You cannot UnFollow yourself'
        });
    }
});
module.exports = router;