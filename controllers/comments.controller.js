const Comment = require("../models/comment.model")

module.exports.create = (req, res, next) => {
  console.log(req.currentUser);  
  const comment = new Comment({
    ...req.body,
    user: req.currentUser._id
  })

  const redirect = () => {
    res.redirect(`/posts/${comment.post}#comments`)
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
            res.redirect(`/posts/${comment.post}#comments`)
          })
          .catch(next)
      } else {
        res.redirect(`/posts/${comment.post}#comments`)
      }
    })
    .catch(next)
}
