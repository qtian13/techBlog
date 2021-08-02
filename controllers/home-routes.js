const router = require('express').Router();
const { User, Blog, Comment } = require('../models');
const withAuth = require('../utils/auth');
const Op = require('sequelize').Op;

// get all blogs with users' info
router.get('/', async (req, res) => {
    try {
        const dbBlogData = await Blog.findAll({
            include: [
                {
                    model: User,
                    attributes: ['username']
                }
            ],
        });

        const blogs = dbBlogData.map((blog) => blog.get({ plain: true }));
        res.status(200).json(blogs);

        // res.render('homepage', {
        //     blogs,
        //     loggedIn: req.session.loggedIn,
        // });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// GET a certain blog with complete contents and comments
router.get('/blog/:id', async (req, res) => {
    try {
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

        const blog = dbBlogData.get({ plain: true });
        
        if (!blog) {
            res.status(404).json({ message: 'No blog found with that id!' });
            return;
        }

        if (blog.comments.length != 0) {
            const dbCommentData = await Comment.findAll(
                {
                    where: {
                        id: {[Op.in]: [1 , 2]},
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
        
        res.status(200).json(blog);

        // res.render('blog', {
        //     blog,
        //     loggedIn: req.session.loggedIn,
        // });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});


// GET all blogs of user logged in right now
router.get('/dashboard', withAuth, async (req, res) => {
    try {
        const dbBlogData = await Blog.findAll({
            where: {
                user_id: req.session.userId,
            }
        });

        const blogs = dbBlogData.map(blog => blog.get({ plain: true }));
        res.status(200).json(blogs);

        // res.render('blog', {
        //     blogs,
        //     loggedIn: req.session.loggedIn,
        // });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// 
router.get('/dashboard/:id', withAuth, async (req, res) => {
    try {
        const dbBlogData = await Blog.findByPk(req.params.id);
        const blog = dbBlogData.get({ plain: true })
        if (!blog) {
            res.status(404).json({ message: 'Sorry no blog found with that id!'});
            return;
        } else if (blog.user_id !== req.session.userId) {
            res.status(404).json({ message: 'Sorry the blog with that id is not yours!'});
            return;
        } else {
            res.status(200).json(blog);
            return;
        }

        // res.render('blog', {
        //     blog,
        //     loggedIn: req.session.loggedIn,
        // });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;