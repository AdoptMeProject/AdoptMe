const mongoose = require('mongoose')
const User = require('../models/user.model')
const mailer = require('../config/mailer.config');
const passport = require('passport')
const { postOwner } = require('../middlewares/post.middleware')


// ======> LOGIN
module.exports.login = (req, res, next) => {
  res.render('users/login')
}

module.exports.doSocialLogin = (req, res, next) => {
  const passportController = passport.authenticate("slack", (error, user) => {
    if (error) {
      next(error);
    } else {
      req.session.userId = user._id;
      res.redirect("/");
    }
  })
  

  passportController(req, res, next);
}

module.exports.doSocialLoginGoogle = (req, res, next) => {
  const passportController = passport.authenticate("google", { scope: ['profile', 'email'] })

  passportController(req, res, next);
}

module.exports.googleCallback = (req, res, next) => {
  const passportController = passport.authenticate("google", (error, user) => {
    if (error) {
      next(error);
    } else {
      req.session.userId = user._id;
      res.redirect("/");
    }
  })

  passportController(req, res, next);
}


module.exports.doLogin = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        user.checkPassword(req.body.password)
          .then(match => {
            if (match) {
              if (user.activation.active) {
                req.session.userId = user._id

                res.redirect('/posts')
              } else {
                res.render('users/login', {
                  error: {
                    validation: {
                      message: 'Your account is not active, check your email!'
                    }
                  }
                })
              }
            } else {
              res.render('users/login', {
                error: {
                  email: {
                    message: 'user not found'
                  }
                }
              })
            }
          })
      } else {
        res.render("users/login", {
          error: {
            email: {
              message: "user not found",
            },
          },

        });
      }
    })
    .catch(next)
}

// ======> CREATE USER

module.exports.new = (req, res, next) => {
  res.render('users/new')
}

module.exports.create = (req, res, next) => {
  console.log(req.body);
  const user = new User({
    ...req.body,
    shelter: false,
    avatar: req.file ? req.file.path : undefined
  });

  user.save()
    .then(user => {
      mailer.sendValidationEmail({
        name: user.name,
        email: user.email,
        id: user._id.toString(),
        activationToken: user.activation.token
      })
    })
    .then(user => {
    
      console.log('entra en el then');
   
      res.render('users/login', {
        message: 'Check your email for activation'
      })
    })

    .catch((error) => {

      console.log('entra en el error', error);
      if (error instanceof mongoose.Error.ValidationError) {
        res.render("users/new", { error: error.errors, user });
      } else if (error.code === 11000) { // error when duplicated user
        res.render("users/new", {
          user,
          error: {
            email: {
              message: 'user already exists'
            }
          }
        });
      } else {
        next(error);
      }
    })
    .catch(next)
}

module.exports.activateUser = (req, res, next) => {
  User.findOne({ _id: req.params.id, "activation.token": req.params.token })
    .then(user => {
      if (user) {
        user.activation.active = true;

        user.save()
          .then(user => {
            res.render('users/login', {
              message: 'Your account has been activated, log in below!'
            })
          })
          .catch(e => next)
      } else {
        res.render('users/login', {
          error: {
            validation: {
              message: 'Invalid link'
            }
          }
        })
      }
    })
    .catch(e => next)
}

module.exports.logout = (req, res, next) => {
  req.session.destroy()

  res.redirect('/login')
}

// ======> USER HOME
module.exports.usersHome = (req, res, next) => {
  res.render('users/home')
}

// ======> SHELTER LIST

module.exports.sheltersList = (req, res, next) => {
  const criteria = {}

  if (req.query.search) {
    res.locals.search = req.query.search
    criteria['$or'] = [
      { name: new RegExp(req.query.search, "i") },
      // { ['author.name']: new RegExp(req.query.search, "i") },
      // { ['shelter.name']: new RegExp(req.query.search, "i") },
      { species: new RegExp(req.query.search, "i") }
    ]
  }

  User.find(criteria)
    // .populate('author')
    // .populate('shelter')
    // .populate('likes')
    .then(users => {
      res.render('users/shelter/list', { users })
    })
    .catch(next)
}

// ======> EDIT USER
module.exports.edit = (req, res, next) => {
  User.findById(req.params.id)
    .then(user => {
      res.render('users/edit', { user })
    })
    .catch(next)
}

module.exports.update = (req, res, next) => {
  const body = req.body

  if (req.file) {
    body.avatar = req.file.path
  }

  User.findByIdAndUpdate(req.params.id, body, { runValidators: true, new: true })
    .then(user => {
      if (user) {
        res.redirect(`/users/${user._id}`)
      } else {
        res.redirect('/posts')
      }
    })
    .catch(next)
}

// ======> USER DETAIL
module.exports.show = (req, res, next) => {
  User.findById(req.params.id)
    .populate({
      path: "posts",
      populate: "shelter"
    })
    .populate({
      path: "shelterposts",
      populate: "author"
    })
    .then(user => {
      res.render('users/show', { user })
    })
    .catch(next)
}

// ======> DELETE USER

module.exports.delete = (req, res, next) => {
  if (req.params.id.toString() === req.currentUser.id.toString()) {
    req.currentUser.remove()
      .then(() => {
        req.session.destroy()
        res.redirect("/login")
      })
      .catch(next)
  } else {
    res.redirect('/posts')
  }
}

// ======> USER CHANGE TO SHELTER

module.exports.createShelter = (req, res, next) => {
  res.render('users/shelter/create')
}


module.exports.beShelter = (req, res, next) => {

  const bodyFields = {
    shelter: true,
    city: req.body.city,
    address: req.body.address,
    phone: req.body.phone,
  }
  const city = req.body.city;
  const address = req.body.address;
  const phone = req.body.phone;

  if (!city || !address || !phone) {
    res.render('users/shelter/create', {
      city,
      address,
      phone,
      errors: {
        city: city ? undefined : 'Write down a city',
        address: address ? undefined : 'Write down an address',
        phone: phone ? undefined : 'Write down a phone',
      }
    });
    } else {
    User.findByIdAndUpdate(req.session.userId, {
      $set: bodyFields
    }, {
      safe: true,
      upsert: true,
      new: true
    }).then(user => {
      if (!user) {
        next(createError(404, 'User not found'));
      } else {
        res.redirect('/posts')
      }
    })
    .catch(error => next(error));
  }
}

