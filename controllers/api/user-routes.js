const router = require('express').Router();
const { User } = require('../../models');

// CREATE a new user
router.post('/', async (req, res) => {
    try {
        const dbUserData = await User.create({
            username: req.body.username,
            password: req.body.password,
        });

        req.session.save(() => {
            req.session.loggedIn = true;
            req.session.userId = dbUserData.get({ plain: true }).id;
            
            res.status(200).json(dbUserData);
        })
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// login to an existing account
router.post('/login', async (req, res) => {
    try {
        const dbUserData = await User.findOne({
            where: {
                username: req.body.username,
            },
        });

        // if username is not found
        if (!dbUserData) {
            res.status(400).json({ message: 'Incorrect username or password. Please try again!' });
            return;
        }

        const validPassword = await dbUserData.checkPassword(req.body.password);

        // if username and password do not match
        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect username or password. Please try again!' });
            return;
        }

        req.session.save(() => {
            req.session.loggedIn = true;
            req.session.userId = dbUserData.get({ plain: true }).id;

            res.status(200).json({ user: dbUserData, message: 'You are now logged in!' });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// logout the current account and destroy the session
router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

module.exports = router;