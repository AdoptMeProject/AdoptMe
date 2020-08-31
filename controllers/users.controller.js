const mongoose = require('mongoose')
const User = require('../models/user.model')
// const mailer = require('../config/mailer.config');
const passport = require('passport')
const { postOwner } = require('../middlewares/post.middleware')

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

module.exports.doLogin = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        user.checkPassword(req.body.password)
          .then(match => {
            if (match) {
              // if (user.activation.active) {
                req.session.userId = user._id

                res.redirect('/posts')
                          // /users/home
                //--> cambiar de posts a ¿?¿?
              // } else {
              //   res.render('users/login', {
              //     error: {
              //       validation: {
              //         message: 'Your account is not active, check your email!'
              //       }
              //     }
              //   })
              // }
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

module.exports.new = (req, res, next) => {
  res.render('users/new')
}

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

module.exports.create = (req, res, next) => {
  console.log(req.body);
  const user = new User({
    ...req.body,
    shelter: false,
    // avatar: req.file ? req.file.path : undefined
  });

  user.save()
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

// module.exports.activateUser = (req, res, next) => {
//   User.findOne({ _id: req.params.id, "activation.token": req.params.token })
//     .then(user => {
//       if (user) {
//         user.activation.active = true;

//         user.save()
//           .then(user => {
//             res.render('users/login', {
//               message: 'Your account has been activated, log in below!'
//             })
//           })
//           .catch(e => next)
//       } else {
//         res.render('users/login', {
//           error: {
//             validation: {
//               message: 'Invalid link'
//             }
//           }
//         })
//       }
//     })
//     .catch(e => next)
// }

module.exports.logout = (req, res, next) => {
  req.session.destroy()

  res.redirect('/login')
}

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

module.exports.createShelter = (req, res, next) => {
  res.render('users/shelter/create')
}

// ===========> ejemplo

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
// }

// ===========> lo que intentamos con un update

// module.exports.beShelter = (req, res, next) => {
//   const body = req.body

//   User.findByIdAndUpdate(req.params.id, body, { shelter: true })
//     .then(user => {
//       if (user) {
//         console.log(user.shelter);
//         res.redirect(`/users/${user._id}`)
//       } else {
//         res.redirect('/posts')
//       }
//     })
//     .catch(next)
// }


// ===========> lo que hay en el post.controller

// module.exports.beShelter = (req, res, next) => {
//   const body = req.body

//   // if (req.file) {
//   //   body.image = req.file.path
//   // }

//   const user = req.user

//   user.set(body)
//   user.set(shelter)
//   user.save()
//     .then(() => {
//       res.redirect(`/users/${user._id}`)
//     })
//     .catch((error) => {
//       if (error instanceof mongoose.Error.ValidationError) {
//         res.render("/shelter/create", { error: error.errors, post });
//       } else {
//         next(error);
//       }
//     })
// }