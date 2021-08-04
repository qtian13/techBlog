const router = require('express').Router();
const { User, Blog, Comment } = require('../models');
const withAuth = require('../utils/auth');

// Use withAuth middleware to prevent access to route
router.get('/', withAuth, async (req, res) => {
    try {
        // Find the logged in user based on the session ID
        const dbUserData = await User.findByPk(req.session.userId, {
            attributes: { exclude: ['password'] },
            include: [{ model: Blog }],
        });

        const user = dbUserData.get({ plain: true });
        // res.status(200).json(user);

        // display dashboard page with data of the user logged in
        res.render('dashboard', {
            ...user,
            loggedIn: req.session.loggedIn,
            dashboardPage: true
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// create new blog only when logged in
router.get('/newpost', withAuth, async (req, res) => {
    try {        
        res.render('newpost', {
            loggedIn: req.session.loggedIn,
            dashboardPage: true
        })
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// when user want to edit an existing blog
// response with the blog data with id === req.params.id when logged in
router.get('/edit/:id', withAuth, async (req, res) => {
    try {  
        const dbUserData = await User.findByPk(req.session.userId, {
            attributes: { exclude: ['password'] },
            include: [{ 
                model: Blog,
                where: { id: req.params.id },
                required: true
            }],
        });

        const user = dbUserData.get({ plain: true });

        res.render('updatepost', {
            ...user,
            loggedIn: req.session.loggedIn,
            dashboardPage: true
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;