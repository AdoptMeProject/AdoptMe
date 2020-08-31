require('dotenv').config();
require("../config/db.config");

const User = require('../models/user.model')
const Comment = require('../models/comment.model')
const Post = require('../models/post.model')
const Like = require('../models/like.model');
const faker = require('faker');

const users = []

function createUser(shelter = false) {
  const user = new User({
    name: faker.name.findName(),
    email: faker.internet.email(),
    avatar: faker.internet.avatar(),
    password: '123456789A',
    bio: faker.lorem.paragraph(),
    shelter,
    avtivation: {
      active: true
    }
  })

  return user.save()
}

function createPost(user, shelter) {
  const post = new Post({
    name: faker.company.companyName(),
    description: faker.lorem.paragraph(),
    url: faker.internet.url(),
    github: faker.internet.url(),
    image: faker.image.image(),
    author: user._id,
    shelter: shelter._id
  })

  return post.save()
}

function createComment(post) {
  const comment = new Comment({
    text: faker.lorem.paragraph(),
    user: users[Math.floor(Math.random() * users.length)]._id,
    post: post._id
  })

  return comment.save()
}

function createLike(post ) {
  const like = new Like({
    user: users[Math.floor(Math.random() * users.length)]._id,
    post: post._id
  })

  return like.save()
}

function restoreDatabase() {
  return Promise.all([
    User.deleteMany({}),
    Comment.deleteMany({}),
    post.deleteMany({}),
    Like.deleteMany({})
  ])
}

function seeds() {
  restoreDatabase()
    .then(() => {
      console.log('Database restored!')

      createUser(true)
        .then(shelter => {
          console.log(`shelter - ${shelter.email}`)
          console.log()

          for (let i = 0; i < 100; i++) {
            createUser()
              .then(user => {
                console.log(user.email)

                users.push(user)

                for (let j = 0; j < 3; j++) {
                  createPost(user, shelter)
                    .then(post => {
                      for (let k = 0; k < 10; k++) {
                        createComment(post)
                        createLike(post)
                      }
                    })
                }
              })
          }
        })
    })

}

seeds()
