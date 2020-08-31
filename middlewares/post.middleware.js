const Post = require('../models/post.model')

module.exports.postOwner = (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post.author.toString() === req.currentUser.id.toString()) {
        req.post = post
        next()
      } else {
        res.redirect(`/posts/${req.params.id}`)
      }
    })
    .catch(next)
}