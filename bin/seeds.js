require('dotenv').config();
require("../config/db.config");

const User = require('../models/user.model')
const Comment = require('../models/comment.model')
const Project = require('../models/project.model')
const Like = require('../models/like.model');
const faker = require('faker');

const users = []

function createUser(staff = false) {
  const user = new User({
    name: faker.name.findName(),
    email: faker.internet.email(),
    avatar: faker.internet.avatar(),
    password: '123456789A',
    bio: faker.lorem.paragraph(),
    staff,
    avtivation: {
      active: true
    }
  })

  return user.save()
}

function createProject(user, staff) {
  const project = new Project({
    name: faker.company.companyName(),
    description: faker.lorem.paragraph(),
    url: faker.internet.url(),
    github: faker.internet.url(),
    image: faker.image.image(),
    author: user._id,
    staff: staff._id
  })

  return project.save()
}

function createComment(project) {
  const comment = new Comment({
    text: faker.lorem.paragraph(),
    user: users[Math.floor(Math.random() * users.length)]._id,
    project: project._id
  })

  return comment.save()
}

function createLike(project ) {
  const like = new Like({
    user: users[Math.floor(Math.random() * users.length)]._id,
    project: project._id
  })

  return like.save()
}

function restoreDatabase() {
  return Promise.all([
    User.deleteMany({}),
    Comment.deleteMany({}),
    Project.deleteMany({}),
    Like.deleteMany({})
  ])
}

function seeds() {
  restoreDatabase()
    .then(() => {
      console.log('Database restored!')

      createUser(true)
        .then(staff => {
          console.log(`STAFF - ${staff.email}`)
          console.log()

          for (let i = 0; i < 100; i++) {
            createUser()
              .then(user => {
                console.log(user.email)

                users.push(user)

                for (let j = 0; j < 3; j++) {
                  createProject(user, staff)
                    .then(project => {
                      for (let k = 0; k < 10; k++) {
                        createComment(project)
                        createLike(project)
                      }
                    })
                }
              })
          }
        })
    })

}

seeds()
