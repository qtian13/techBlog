const router = require('express').Router();
const { User, Blog, Comment } = require('../models');
const withAuth = require('../utils/auth');
const Op = require('sequelize').Op;

router.get('/', async (req, res) => {
    console.log("get home request");
    try {
        // get all blogs and JOIN with user data
        const dbBlogData = await Blog.findAll({
            include: [
                {
                    model: User,
                    attributes: ['username']
                }
            ],
        });

        // Serialize data so the template can read it
        const blogs = dbBlogData.map((blog) => blog.get({ plain: true }));

        console.log(blogs);
        // Pass serialized data and session flag into template
        res.render('homepage', {
            blogs,
            loggedIn: req.session.loggedIn,
            dashboardPage: false
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.get('/blog/:id', async (req, res) => {
    try {
        // GET a certain blog with complete contents and comments
        const dbBlogData = await Blog.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['username'],
                },
                {
                    model: Comment,
                }
            ],
        });

        // if no blog match the id
        if (!dbBlogData) {
            res.status(404).json({ message: 'No blog found with that id!' });
            return;
        }

        const blog = dbBlogData.get({ plain: true });

        // find all the comments data related to this blog
        commentsIdArr = blog.comments.map(comment => comment.id);
        if (blog.comments.length != 0) {
            const dbCommentData = await Comment.findAll(
                {
                    where: {
                        id: {[Op.in]: commentsIdArr},
                    },
                
                    include: [{
                        model: User,
                        attributes: ['username'],
                    }]
                },
            );
            const comments = dbCommentData.map(comment => comment.get({plain: true}));
            blog.comments = comments;
        }
        
        res.render('blog', {
            ...blog,
            loggedIn: req.session.loggedIn,
            dashboardPage: false
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.get('/login', (req, res) => {
    // If the user is already logged in, redirect the request to another route
    if (req.session.loggedIn) {
      res.redirect('/dashboard');
      return;
    }
  
    res.render('login', {
        dashboardPage: false
    });
});

router.get('/signup', (req, res) => {
    // If the user is already logged in, redirect the request to another route
    console.log(req.session.log)
    if (req.session.loggedIn) {
      res.redirect('/dashboard');
      return;
    }
  
    res.render('signup', {
        dashboardPage: false
    });
});
  

module.exports = router;