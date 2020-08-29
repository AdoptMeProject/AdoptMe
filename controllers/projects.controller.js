const Project = require("../models/project.model")
const User = require("../models/user.model")
const Like = require("../models/like.model")
const mongoose = require('mongoose')

// GET /projects/:id
module.exports.show = (req, res, next) => {
  Project.findById(req.params.id)
    .populate('author')
    .populate('staff')
    .populate('likes')
    .populate({
      path: 'comments',
      options: {
        sort: {
          createdAt: -1
        }
      },
      populate: 'user'
    })
    .then(project => {
      res.render('projects/show', { project })
    })
    .catch(next)
}

module.exports.edit = (req, res, next) => {
  User.find({ staff: true })
    .then((staffUsers) => {
      res.render('projects/edit', { staffUsers, project: req.project })
    })
    .catch(next)
}

module.exports.update = (req, res, next) => {
  const body = req.body

  if (req.file) {
    body.image = req.file.path
  }

  const project = req.project

  project.set(body)
  project.save()
    .then(() => {
      res.redirect(`/projects/${project.id}`)
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.render("projects/edit", { error: error.errors, project });
      } else {
        next(error);
      }
    })
}

module.exports.delete = (req, res, next) => {
  req.project.remove()
    .then(() => {
      res.redirect('/projects')
    })
    .catch(next)
}

module.exports.new = (req, res, next) => {
  User.find({ staff: true })
    .then(staffUsers => {
      res.render('projects/new', { staffUsers })
    })
    .catch(next)  
}

module.exports.create = (req, res, next) => {
  const project = new Project({
    ...req.body,
    image: req.file ? req.file.path : undefined,
    author: req.currentUser._id 
  })

  project.save()
    .then(project => {
      res.redirect(`/projects/${project._id}`)
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        User.find({ staff: true })
          .then(staffUsers => {
            res.render('projects/new', { error: error.errors, project, staffUsers })
          })
          .catch(next) 
      } else {
        next(error);
      }
    })

}

module.exports.list = (req, res, next) => {
  const criteria = {}

  if (req.query.search) {
    res.locals.search = req.query.search
    criteria['$or'] = [
      { name: new RegExp(req.query.search, "i") },
      { ['author.name']: new RegExp(req.query.search, "i") },
      { ['staff.name']: new RegExp(req.query.search, "i") }
    ]
  }

  Project.find(criteria)
    .populate('author')
    .populate('staff')
    .populate('likes')
    .then(projects => {
      res.render('projects/list', { projects })
    })
    .catch(next)
}

module.exports.like = (req, res, next) => {
  const params = { project: req.params.id, user: req.currentUser._id };

  Like.findOne(params)
    .then(like => {
      if (like) {
        Like.findByIdAndRemove(like._id)
          .then(() => {
            res.json({ like: -1 });
          })
          .catch(next);
      } else {
        const newLike = new Like(params);

        newLike.save()
          .then(() => {
            res.json({ like: 1 });
          })
          .catch(next);
      }
    })
    .catch(next);
}