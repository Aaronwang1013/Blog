const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcrypt'); //decrypt the password
const jwt = require('jsonwebtoken');//cookies
const marked = require('marked');

const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;



/** 
// GET
// Check Login 
*/

const authMiddleware = (req, res , next) => {
    const token = req.cookies.token;

    if (!token){
        return res.status(401).json({ message: 'Unauthorized'}); //can be change to res.render, and render to a new page if unauthorized
    }

    try {
        const decoded = jwt.verify(token , jwtSecret);
        req.userId = decoded.userId;
        next();
    }catch(err){
        res.status(401).json({message: "Unathorized"});
    }
}

/** 
// GET
// Admin - Login Page
*/
router.get('/admin' , async (req, res) => {

    try {
        const locals = {
            title: "admin",
            body: "This is the body text"
        }
        res.render('admin/index' , { locals , layout: adminLayout });
    } catch (err) {
        console.error(err);
    }
});



/** 
// POST
// Admin - CheckLogin
*/
router.post('/admin' , async (req, res) => {
    try {
        const {username , password} = req.body;
        
        const user = await User.findOne({username});

        //get the user and password and check with database
        if (!user) {
        return res.status(401).json({message : 'Invalid user or password'});
        }

        const ispasswordValid = await bcrypt.compare(password, user.password);

        if (!ispasswordValid) {
            return res.status(401).json({message : 'Invalid user or password'});
        }
        //save token to cookie
        const token = jwt.sign({ userId: user._id}, jwtSecret);
        res.cookie('token', token , {httpOnly: true});
        res.redirect('/dashboard');

    } catch (err) {
        console.error(err);
    }
});


/** 
// GET
// Admin - Dashboard
*/
router.get('/dashboard' ,authMiddleware , async (req, res) => {
    try {
         const locals = {
            title: "Dashboard",
            description: "Simple Blog created with NodeJS , Express and MongoDB."
         }
         const data = await Post.find();
         res.render('admin/dashboard',{
            locals,
            data,
            layout: adminLayout
         });
    } catch (errors){
        console.log(errors);
    }
});
// router.post('/admin' , async (req, res) => {
//     try {
//         const {username , password} = req.body;
//         if(req.body.username == 'admin' && req.body.password == 'password'){
//             res.redirect('/');
//         } else {
//             res.send('Wrong username or password');
//         }
//         res.redirect('/admin');
//     } catch (err) {
//         console.error(err);
//     }
// });


/**
 * GET /
 * Admin - Create New Post
得到Add Post頁面
*/
router.get('/add-post' ,authMiddleware , async (req, res) => {
  try {
       const locals = {
          title: "ADD POST",
          description: "Simple Blog created with NodeJS , Express and MongoDB."
       }
       const data = await Post.find();
       res.render('admin/add-post',{
          locals,
          layout: adminLayout
       });
  } catch (errors){
      console.log(errors);
  }
});

/**
 * Post /
 * Admin - Create New Post
 *將使用者輸入的資訊加入資料庫
*/
router.post('/add-post' ,authMiddleware , async (req, res) => {
  try {
       const newPost = new Post({
          title: req.body.title,
          body: req.body.body
       })
      await Post.create(newPost);
      res.redirect('/dashboard'); 
  } catch (errors){
      console.log(errors);
  }
});



/**
 * GET /
 * Admin - Edit Post
*/
router.get('/edit-post/:id', async (req, res) => {
    try {
  
      const locals = {
        title: "Edit Post",
        description: "Free NodeJs User Management System",
      };
  
      const data = await Post.findOne({ _id: req.params.id });
  
      res.render('admin/edit-post', {
        locals,
        data,
        layout: adminLayout
      })
  
    } catch (error) {
      console.log(error);
    }
  
  });
  
  
/**
** PUT /
* Admin - Create New Post
*/
router.put('/edit-post/:id', async (req, res) => {
  try {
  
    await Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      updatedAt: Date.now()
    });
  
    res.redirect(`/edit-post/${req.params.id}`);
  
  } catch (error) {
      console.log(error);
  }
  
});
/** 
// POST
// Admin - Register
*/

router.post('/register' , async (req, res) => {
    try {
        const {username , password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        try{
            const user = await User.create({username , password:hashedPassword});
            res.status(201).json({message: 'User created successfully', user});
        }catch (err) {
            if (err.code === 11000){
                res.status(409).json({message: 'User already exists'});
            }
            res.status(500).json({message:"internal server error", err});
        }
    } catch (err) {
        console.error(err);
    }
});

/**
 * DELETE /
 * Admin - Delete Post
*/
router.delete('/delete-post/:id', async (req, res) => {

    try {
      await Post.deleteOne( { _id: req.params.id } );
      res.redirect('/dashboard');
    } catch (error) {
      console.log(error);
    }
  
  });

/** 
// PUT
// Admin - Create new Post
*/
router.put('/edit-post/:id'  , async (req, res) => {
    try {
        await Post.findByIdAndUpdate(req.params.id, { 
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now()
        });
        res.redirect(`/edit/${req.params.id}`);
    } catch (errors){
        console.log(errors);
    }
});

/**
 * GET /
 * Admin Logout
*/
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    //res.json({ message: 'Logout successful.'});
    res.redirect('/');
  });




  
module.exports = router;

