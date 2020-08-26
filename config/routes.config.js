const express = require('express');
const router = express.Router();
const session = require('../middlewares/session.middleware')
const projectsMiddleware = require('../middlewares/project.middleware')
const projectsController = require('../controllers/projects.controller')
const usersController = require('../controllers/users.controller')
const commentsController = require('../controllers/comments.controller')
const upload = require('../config/multer.config');

// session.isAuthenticated
// session.isNotAuthenticated

router.get('/auth/slack', usersController.doSocialLogin);
router.get('/login', usersController.login)
router.post('/login', usersController.doLogin)
router.post('/logout', usersController.logout)
router.get('/users/new', usersController.new);
router.post('/users', upload.single('avatar'), usersController.create);
router.get('/users/:id', usersController.show);
router.get('/users/:id/edit', usersController.edit);
router.post('/users/:id/edit', upload.single('avatar'), usersController.update);
router.post('/users/:id/delete', usersController.delete);
// router.get('/users/:id/activate/:token', usersController.activateUser);

router.get('/projects', projectsController.list)
router.post('/projects', upload.single('image'), projectsController.create)
router.get('/projects/new', projectsController.new)
router.get('/projects/:id', projectsController.show)
router.get('/projects/:id/edit', projectsMiddleware.projectOwner, projectsController.edit)
router.post('/projects/:id/delete', projectsMiddleware.projectOwner, projectsController.delete)
router.post('/projects/:id/edit', projectsMiddleware.projectOwner, upload.single('image'), projectsController.update)
router.post('/projects/:id/like', projectsController.like)

router.post('/comments', commentsController.create)
router.post('/comments/:id/delete', commentsController.delete)

router.get('/', (req, res) => res.redirect('/projects'))

module.exports = router;
