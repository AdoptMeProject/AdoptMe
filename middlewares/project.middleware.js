const Project = require('../models/project.model')

module.exports.projectOwner = (req, res, next) => {
  Project.findById(req.params.id)
    .then(project => {
      if (project.author.toString() === req.currentUser.id.toString()) {
        req.project = project
        next()
      } else {
        res.redirect(`/projects/${req.params.id}`)
      }
    })
    .catch(next)
}