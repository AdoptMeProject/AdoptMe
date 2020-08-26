const Comment = require("../models/comment.model")

module.exports.create = (req, res, next) => {  
  const comment = new Comment({
    ...req.body,
    user: req.currentUser._id
  })

  const redirect = () => {
    res.redirect(`/projects/${comment.project}#comments`)
  }

  comment.save()
    .then(redirect)
    .catch(redirect)
}

module.exports.delete = (req, res, next) => {
  Comment.findById(req.params.id)
    .then(comment => {
      if (comment.user.toString() === req.currentUser._id.toString()) {
        Comment.findByIdAndDelete(comment._id)
          .then(() => {
            res.redirect(`/projects/${comment.project}#comments`)
          })
          .catch(next)
      } else {
        res.redirect(`/projects/${comment.project}#comments`)
      }
    })
    .catch(next)
}
