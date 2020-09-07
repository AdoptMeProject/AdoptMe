const Post = require("../models/post.model")
const User = require("../models/user.model")
const Like = require("../models/like.model")
const mongoose = require('mongoose')

// GET /posts/:id
module.exports.show = (req, res, next) => {
  Post.findById(req.params.id)
    .populate('author')
    .populate('shelter')
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
    .then(post => {
      res.render('posts/show', { post })
    })
    .catch(next)
}

module.exports.edit = (req, res, next) => {
  User.find({ shelter: true })
    .then((shelterUsers) => {
      res.render('posts/edit', { shelterUsers, post: req.post })
    })
    .catch(next)
}

module.exports.update = (req, res, next) => {
  const body = req.body

  if (req.file) {
    body.image = req.file.path
  }

  const post = req.post

  post.set(body)
  post.save()
    .then(() => {
      res.redirect(`/posts/${post.id}`)
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.render("posts/edit", { error: error.errors, post });
      } else {
        next(error);
      }
    })
}

module.exports.delete = (req, res, next) => {
  req.post.remove()
    .then(() => {
      res.redirect('/posts')
    })
    .catch(next)
}

module.exports.new = (req, res, next) => {
  User.find({ shelter: true })
    .then(shelterUsers => {
      res.render('posts/new', { shelterUsers })
    })
    .catch(next)  
}

module.exports.create = (req, res, next) => {

  const post = new Post({
    ...req.body,
    image: req.file ? req.file.path : undefined,
    author: req.currentUser._id 
  })

  post.save()
    .then(post => {
      res.redirect(`/posts/${post._id}`)
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        User.find({ shelter: true })
          .then(shelterUsers => {
            res.render('posts/new', { error: error.errors, post, shelterUsers })
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
      { ['shelter.name']: new RegExp(req.query.search, "i") },
      { species: new RegExp(req.query.search, "i") },
      { size: new RegExp(req.query.search, "i") },
      { gender: new RegExp(req.query.search, "i") },
      { place: new RegExp(req.query.search, "i") },
    ]
  }

  Post.find(criteria)
    .populate('author')
    .populate('shelter')
    .populate('likes')
    .then(posts => {
      res.render('posts/list', { posts })
    })
    .catch(next)
}

module.exports.like = (req, res, next) => {
  const params = { post: req.params.id, user: req.currentUser._id };

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

module.exports.filter = (req, res, next) => {
  const params = req.params

  Post.findById()
}