const router = require('express').Router();
const Post = require('../Controller/Post');
const Comment = require('../Controller/Comment');
const { findById } = require('../Controller/Comment');
const User = require('../Controller/User');
//post
router.post('/', async (req, res) => {
    try {
        const newpost = await new Post(req.body);
        const saved = await newpost.save();
        res.status(200).json(saved);
    } catch (err) {
        res.status(400).json('something went wrong');
    }
})
//getpost

router.get('/:id',async (req,res) =>{
    try {
        const post = findById(req.params.id);
        res.json(post);
    } catch (error) {
        res.status(400).json('Something went wrong');
    }
})

//update

router.put('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (post.userid === req.body.userid) {
            await post.updateOne({ $set: req.body });
            res.json('Post updated');
        } else {
            res.status(500).json('Can update yours posts only');
        }

    } catch (err) {
        res.status(404).json('something went wrong');
    }
})

//likepost
router.put('/:id/like', async (req,res) =>{
    try {
        const post = await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userid)){
            await post.updateOne({$push:{likes : req.body.userid}});
            res.json('You liked the post');
        }else{
            await post.updateOne({$pull:{likes:req.body.userid}});
            res.json('You disliked the post');
        }
    } catch (error) {
        res.json(400).json('Something went wrong');
    }
})

//comment

router.post('/:id/comments', async (req, res) => {
    try {
        // const post = await Post.findById(req.params.id);
        const comment = await new Comment({
            userid:req.body.userid,
            desc:req.body.desc,
            postid:req.params.id,
            time: Date()
        })
        const saved = await comment.save();
        res.json(saved);
    } catch (err) {
        res.status(400).json('something went wrong');
    }
})

//delete comment 

router.delete('/comments/:id', async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        
        if (req.body.userid === comment.userid) {
            await Comment.findByIdAndDelete(req.params.id);
            res.json('Post deleted');
        } else {
            return res.json(400).json('Can delete yours comments only');
        }
    } catch (error) {
        res.status(404).json('something went wrong');
    }
})

//edit comment

router.put('/comments/:id',async (req,res) =>{
    try {
        const comment = await Comment.findById(req.params.id);
        if(comment.userid === req.body.userid){
            await Comment.findByIdAndUpdate(req.params.id,{
                $set:req.body
            })
            res.json('comment updated');
        }else{
            res.status(400).json('Can edit only your comments');
        }
    } catch (error) {
        res.status(400).json('something went wrong');   
    }
})
//getcomment
router.get('/comments/:id', async (req,res) => {
    try{
        const comment = await Comment.findById(req.params.id);
        res.json(comment);
    }catch(err){
        res.status(404).json('Not found');
    }
})
//get all comments of a post
router.get('/:postid/comments',async (req,res) => {
    try{
        const allComments = await Comment.find({
            postid:req.params.postid
        });
        res.json(allComments);
    }catch(err){
        res.status(404).json('Not found');
    }
});

//get timeline

router.get('/timeline/all', async(req,res) => {
    try {
        const user = await User.findById(req.body.userid);
        const userPosts = await Post.find({userid:user.id});
        
        const friendPosts = await Promise.all(user.following.map((friendID)=>{
            return Post.find({userid:friendID});
        }))
        res.json(userPosts.concat(...friendPosts));
    } catch (error) {
        res.status(404).json('Not found');
    }
})
module.exports = router;