const express = require("express");
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// register a user
router.post('/register',async(req,res) => {
    console.log('here');
  
    bcrypt.genSalt(10).then(salt=>{ // generate Password Salt
        bcrypt.hash(req.body.password,salt).then(hashedPassword=>{
            const newUser = new User({ // Creating new User 
                username: req.body.username,
                password: hashedPassword,
                email: req.body.email
            });
            newUser.save().then(savedUser=>{
                res.status(200).json(savedUser);
            }).catch(err=>{
                console.log(err);
            });
        }).catch(err=>{
            console.log(err);
        });
    }).catch(err=>{
        console.log(err);
    });
    
});

// Login a user
router.post('/login',(req,res)=>{
    const eMail = req.body.email;
    User.findOne({email: eMail}).then(user=>{
        if(user){   
            const storedPassword = user.password;
            bcrypt.compare(req.body.password,storedPassword).then(response=>{
                if(!response){
                    res.status(200).json({
                        message: 'Wrong PassWord'
                    });
                }
                else{
                   res.status(200).json({
                    message:'Login successfull'
                   });
                }
            });
        }
        else{
            res.status(404).json({
                message: 'User Not Found'
            });
        }
    }).catch(err=>{
        console.log(err);
    })
});




module.exports = router;