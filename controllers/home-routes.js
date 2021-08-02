const router = require('express').Router();
const { User, Blog, Comment } = require('../models');
const withAuth = require('../utils/auto');

router.get('/', async (req, res) => {
    try {
        const dbBlogData = await Blog.findAll({
            include: [
                {
                    model: User,
                    // attributes: ['username'],
                }
            ],
        });

        const blogs = dbBlogData.map((blog) => blog.get({ plain: true }));

        res.render('homepage', {
            blogs,
            loggedIn: req.session.loggedIn,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.get('/blog/:id', async (req, res) => {
    try {
        const dbBlogData = await Blog.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    // attributes: ['username'],
                },
                {
                    model: Comment,
                    // attributes: ['content', 'username'],
                }
            ],
        });

        const blog = dbBlogData.get({ plain: true });
        
        if (!blog) {
            res.status(404).json({ message: 'No blog found with that id!' });
            return;
        }

        res.render('blog', {
            blog,
            loggedIn: req.session.loggedIn,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.get('/dashboard', withAuth, async (req, res) => {
    try {
        const dbBlogData = await Blog.findAll({
            where: {
                user_id: req.body.id, // how to pass the value of user.id
            }
        });

        const blogs = dbBlogData.map(blog => blog.get({ plain: true }));

        res.render('blog', {
            blogs,
            loggedIn: req.session.loggedIn,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.get('/dashboard/:id', withAuth, async (req, res) => {
    try {
        const dbBlogData = await Blog.findByPk(req.params.id, {
            include: [
                {
                    model: Comment,
                    // attributes: ['content'],
                }
            ],
        });

        const blog = dbBlogData.get({ plain: true });

        if (!blog) {
            res.status(404).json({ message: 'Sorry no blog found with that id!'});
        } else if (blog.user_id !== req.body.id) {
            res.status(404).json({ message: 'Sorry you have no access to editing this blog'});
            return;
        }

        res.render('blog', {
            blog,
            loggedIn: req.session.loggedIn,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
})