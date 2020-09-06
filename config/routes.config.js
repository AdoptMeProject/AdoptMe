const express = require('express');
const router = express.Router();
const session = require('../middlewares/session.middleware')
const postsMiddleware = require('../middlewares/post.middleware')
const postController = require('../controllers/post.controller')
const usersController = require('../controllers/users.controller')
const commentsController = require('../controllers/comments.controller')
const upload = require('../config/multer.config');
const passport = require('passport')


router.get('/auth/slack', session.isNotAuthenticated, usersController.doSocialLogin);
router.get('/auth/google', session.isNotAuthenticated, usersController.doSocialLoginGoogle);
router.get('/auth/google/callback', session.isNotAuthenticated, usersController.googleCallback);
router.get('/login', session.isNotAuthenticated, usersController.login)
router.post('/login', session.isNotAuthenticated, usersController.doLogin)
router.post('/logout', session.isAuthenticated, usersController.logout)
router.get('/users/new', session.isNotAuthenticated, usersController.new);
router.post('/users', session.isNotAuthenticated, upload.single('avatar'), usersController.create);
router.get('/users/:id', session.isAuthenticated, usersController.show);
router.get('/users/:id/activate/:token', session.isNotAuthenticated, usersController.activateUser);
router.get('/users/:id/edit', session.isAuthenticated, usersController.edit);
router.post('/users/:id/edit', session.isAuthenticated, upload.single('avatar'), usersController.update);
router.post('/users/:id/delete', session.isAuthenticated, usersController.delete);

router.get('/shelter/create', session.isAuthenticated, usersController.createShelter);
router.post('/shelter/create', session.isAuthenticated, usersController.beShelter);

router.get('/posts', session.isAuthenticated, postController.list)
router.post('/posts', session.isAuthenticated, upload.single('image'), postController.create)
router.get('/posts/new', session.isAuthenticated, postController.new)
router.get('/posts/:id', session.isAuthenticated, postController.show)
router.get('/posts/:id/edit', session.isAuthenticated, postsMiddleware.postOwner, postController.edit)
router.post('/posts/:id/delete', session.isAuthenticated, postsMiddleware.postOwner, postController.delete)
router.post('/posts/:id/edit', session.isAuthenticated, postsMiddleware.postOwner, upload.single('image'), postController.update)
router.post('/posts/:id/like', session.isAuthenticated, postController.like)

router.post('/comments', session.isAuthenticated, commentsController.create)
router.post('/comments/:id/delete', session.isAuthenticated, commentsController.delete)

router.get('/', (req, res) => res.redirect('/posts'))
// /posts


module.exports = router;
