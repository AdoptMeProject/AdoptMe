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

router.get('/auth/slack', session.isNotAuthenticated, usersController.doSocialLogin);
router.get('/login', session.isNotAuthenticated, usersController.login)
router.post('/login', session.isNotAuthenticated, usersController.doLogin)
router.post('/logout', session.isAuthenticated, usersController.logout)
router.get('/users/new', session.isNotAuthenticated, usersController.new);
router.post('/users', session.isNotAuthenticated, upload.single('avatar'), usersController.create);
router.get('/users/:id', session.isAuthenticated, usersController.show);
router.get('/users/:id/edit', session.isAuthenticated, usersController.edit);
router.post('/users/:id/edit', session.isAuthenticated, upload.single('avatar'), usersController.update);
router.post('/users/:id/delete', session.isAuthenticated, usersController.delete);
// router.get('/users/:id/activate/:token', session.isNotAuthenticated, usersController.activateUser);

router.get('/shelter/create', session.isAuthenticated, usersController.create);
router.post('/shelter/create', session.isAuthenticated, usersController.beShelter);

router.get('/projects', session.isAuthenticated, projectsController.list)
router.post('/projects', session.isAuthenticated, upload.single('image'), projectsController.create)
router.get('/projects/new', session.isAuthenticated, projectsController.new)
router.get('/projects/:id', session.isAuthenticated, projectsController.show)
router.get('/projects/:id/edit', session.isAuthenticated, projectsMiddleware.projectOwner, projectsController.edit)
router.post('/projects/:id/delete', session.isAuthenticated, projectsMiddleware.projectOwner, projectsController.delete)
router.post('/projects/:id/edit', session.isAuthenticated, projectsMiddleware.projectOwner, upload.single('image'), projectsController.update)
router.post('/projects/:id/like', session.isAuthenticated, projectsController.like)

router.post('/comments', session.isAuthenticated, commentsController.create)
router.post('/comments/:id/delete', session.isAuthenticated, commentsController.delete)

router.get('/', (req, res) => res.redirect('/login'))
// /projects


module.exports = router;
