const router = require('express').Router();
const { User, Blog, Comment } = require('../../models');

// CREATE a new blog
router.post('/', async (req, res) => {
    try {
        const dbBlogData = await Blog.create(
            {
                title: req.body.title,
                content: req.body.content,
                user_id: req.session.userId,
            }
        );

        res.status(200).json(dbBlogData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// UPDATE an existing blog
router.put('/:id', async (req, res) => {
    try {
        let dbBlogData = await Blog.findByPk(req.params.id);
        if (!dbBlogData) {
            res.status(400).json({ message: 'No blog found with that id!' });
            return;
        } else if (dbBlogData.get({plain: true}).user_id !== req.session.userId) {
            res.status(400).json({ message: 'Sorry you cannot edit the blog with that id!' });
        } else {
            dbBlogData = await Blog.update(
                {
                    title: req.body.title,
                    content: req.body.content,
                    user_id: req.session.userId,
                },
                {
                    where: {
                        id: req.params.id,
                    },
                }
            );
            res.status(200).json({ message: 'Updated successfully!' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// DELETE an existing blog
router.delete('/:id', async (req, res) => {
    try {
        let dbBlogData = await Blog.findByPk(req.params.id);
        if (!dbBlogData) {
            res.status(400).json({ message: 'No blog found with that id!' });
            return;
        } else if (dbBlogData.get({plain: true}).user_id !== req.session.userId) {
            res.status(400).json({ message: 'Sorry you cannot delete the blog with that id!' });
        } else {
            dbBlogData = await Blog.destroy(
                {
                where: {
                    id: req.params.id,
                },
            });
            res.status(200).json({ message: 'Delete the blog successfully!' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// CREATE comment
router.post('/:id', async (req, res) => {
    try {
        const dbCommentData = await Comment.create(
            {
                content: req.body.content,
                user_id: req.session.userId,
                blog_id: req.params.id,
            }
        );

        res.status(200).json(dbCommentData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;