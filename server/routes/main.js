const express = require('express');
const { get } = require('mongoose');
const router = express.Router();
const Post = require('../models/Post');

//Routes

/** 
// GET
// HOME
*/
router.get('' , async (req, res) => {
    try{
    const locals = {
        title : "NodeJS Blog",
        description: "Simple Blog created with NodeJS, Express and MongoDB"
    }

    let perPage = 10;
    let page = req.query.page || 1; //set default page to 1 when first visit the page, and if have query the page (means page=? in url)

    const data = await Post.aggregate([ { $sort: {createdAt: -1 }}]) // make the oldest Blog at the top
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec();

    const count = await Post.count();
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    //render to the index.ejs in views directory
    res.render('index',{
        locals,
        data,
        current: page,
        nextPage: hasNextPage ? nextPage : null,
        currentRoute: '/'
    });
    } catch (err) {
        console.log(err);
    }
});


// Try to insert data 
// function insertPostData (){
//     Post.insertMany([
//         {
//             title: "Tideman",
//             body: "This is the body text"
//         },
//     ])
// }
// insertPostData();

/** 
// GET
// POST :id
*/
router.get('/post/:id' , async (req, res) => {

    try {
        const locals = {
            title: "Building a Blog",
            body: "This is the body text"
        }
        let slug = req.params.id;

        const data = await Post.findById({ _id: slug});
        res.render('post' , {
          locals ,
          data,
          currentRoute: `/post/${slug}`
        });
    } catch (err) {
        console.error(err);
    }
});


/** 
// POST
// POST :searchTerm
*/
router.post('/search', async (req, res) => {
    try {
      const locals = {
        title: "Seach",
        description: "Simple Blog created with NodeJs, Express & MongoDb."
      }
  
      let searchTerm = req.body.searchTerm || "";
      const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")
  
      const data = await Post.find({
        $or: [
          { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
          { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
        ]
      });
  
      res.render("search", {
        data,
        locals,
        currentRoute: '/'
      });
  
    } catch (error) {
      console.log(error);
    }
  
  });






router.get('/about', (req, res) => {
  res.render('about', {
  currentRoute: '/about'
  });
});
  

router.get('/contact', (req, res) => {
  res.render('contact', {
  currentRoute: '/contact'
  });
});


module.exports = router;

