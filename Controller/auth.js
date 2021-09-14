const express = require('express');
const registerRouter = express.Router();
const signinRouter = express.Router();
const User = require('./User');
const bcrypt = require('bcryptjs');



registerRouter.post('/register', async (req, res) => {

    try {
        if(!req.body.username.length||!req.body.email.length||!req.body.password.length){
            return res.status(500).json('Invalid data');
        }
        const findUser = await User.findOne({email : req.body.email});
        if(findUser){
           return res.status(400).json('user already exist');
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const user = await new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        })
        await user.save();
        // console.log(user);
        res.json(user);
    }
    catch (err) {
        res.status(400).json('error');
    }


});

signinRouter.post('/signin', async (req, res) => {

    if (!req.body.email || !req.body.password) {
        return res.status(404).json('Invalid credentials');
    }
    try {
        const user = await User.findOne({
            email: req.body.email
        })
        if (user === null) {
            res.status(404).json('Not found');
        }
        await bcrypt.compare(req.body.password, user.password)
            .then((valid) => {
                if (valid)
                    return res.json(user);
                res.status(404).json('Incorrect email or password');
            })
            .catch(error => {
                res.status(400).json('Not found');
            })

    }
    catch (err) {
        res.status(400).status('error');
    }


})
module.exports = {
    registerRouter: registerRouter,
    signinRouter: signinRouter
}