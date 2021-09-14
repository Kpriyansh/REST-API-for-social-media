const router = require('express').Router();
const User = require('../Controller/User');
const bcrypt = require('bcryptjs');
//update
router.put('/:id', async (req, res) => {
    if (req.body.id === req.params.id && req.body.oldpassword) {
        try {
            const user = await User.findOne({
                id: req.body.id,
            });
            await bcrypt.compare(req.body.oldpassword, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(404).json('Incorrect credentials');
                    }
                })
                .catch(err => res.status(404).json('Try again'));

        }
        catch (err) {
            return res.status(400).json('Cannot update');
        }
        try {
            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            })
            res.json(user);
        }
        catch (err) {
            res.status(400).json('Cannot update');
        }

    } else {
        res.status(400).json('Wrong credentials');
    }
})


//delete

router.delete('/:id', async (req, res) => {
    if (req.body.id === req.params.id && req.body.password) {
        try {
            const user = await User.findOne({
                id: req.body.id,
            });
            await bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(404).json('Incorrect credentials');
                    }
                })
                .catch(err => res.status(404).json('Try again'));
            await User.deleteOne({ id: req.params.id });
            res.json('Account deleted successfully');

        }
        catch (err) {
            return res.status(400).json('Cannot delete the account. Try again');
        }


    } else {
        res.status(400).json('Wrong credentials');
    }
})

//geting user,
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const data = {
            id: user.id,
            username: user.username,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profilePicture: user.profilePicture,
            coverPicture: user.coverPicture,
            isAdmin: user.isAdmin,
            description: user.description,
            country: user.country,
            dob: user.dob.toString().substr(0, 10)
        }
        res.json(data);
    } catch (err) {
        res.status(404).json('Not found');
    }
})

//follow
router.put('/:id/follow', async (req, res) => {
    if (req.body.userid !== req.params.id) {
        try {
            
            const thisUser = await User.findById(req.body.userid);
            const thatUser = await User.findById(req.params.id);
            if (!thatUser.followers.includes(req.body.id)) {
                await thisUser.updateOne({ $push: { following: req.params.id } });
                await thatUser.updateOne({ $push: { followers: req.body.userid } });
                return res.status(200).json("User has been followed");
            } else {
                res.status(403).json('You are already following the user');
            }
        } catch (error) {
            res.status(404).json('Something went wrong');
        }
    } else {
        res.status(403).json('You cannot follow yourself');
    }
})
// unfollow
router.delete('/:id/unfollow', async (req, res) => {
    if(req.params.id === req.body.userid){
        return res.status(500).json('Meaningless');
    }
    try {
        const thisUser = await User.findById(req.body.userid);
        const thatUser = await User.findById(req.params.id);
        if (thisUser.following.includes(thatUser.id)) {
            await thisUser.updateOne({ $pull: { following: req.params.id } });
            await thatUser.updateOne({ $pull: { followers: req.body.userid } });
            res.json("User unfollowed");
        } else {
            res.status(403).json('You are not follwing this user');
        }
    } catch (err) {
        res.status(404).json('Something went wrong');
    }
})


module.exports = router