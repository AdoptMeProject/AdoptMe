require('dotenv').config();
require("../config/db.config");
const mongoose = require('mongoose');

const User = require('../models/user.model')
const Comment = require('../models/comment.model')
const Post = require('../models/post.model')
const Like = require('../models/like.model');
const faker = require('faker');
const { create } = require('../models/comment.model');

const users = [
  { name: 'ALBA Protectora', email: faker.internet.email(), avatar: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fpetshelter.miwuki.com%2Fprotectora-asociacion-alba-madrid-2714&psig=AOvVaw2U1kSpKyEAXx74t9Lj9v-t&ust=1599324274720000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCID4y635z-sCFQAAAAAdAAAAABAD', password: '1234', shelter: true, address: 'ALBA Protectora, Camino del Corral, 60, 28816 Camarma de Esteruelas, Madrid', city: 'Madrid', phone: faker.phone.phoneNumber(), bio: faker.lorem.paragraph(), activation: { active: true } },
  { name: 'Asociación Almanimal', email: 'bimba@almanimal.org', avatar: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.facebook.com%2FAsociaci%25C3%25B3n-Almanimal-302737063162160%2F&psig=AOvVaw3QboDAS653lpwLH5h66oXh&ust=1599324821525000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCICR87P7z-sCFQAAAAAdAAAAABAD', password: '1234', shelter: true, address: faker.address.streetAddress(), city: 'Madrid - Brunete, Boadilla del Monte', phone: faker.phone.phoneNumber(), bio: faker.lorem.paragraph(), activation: { active: true } },
  { name: 'ANAA Asociación Nacional Amigos de los Animales', email: faker.internet.email(), avatar: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Ftwitter.com%2Fasociacion_anaa&psig=AOvVaw0EaX1rwLI_gEd1Y1aR2_Xw&ust=1599325140287000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCIjVxcr8z-sCFQAAAAAdAAAAABAD', password: '1234', shelter: true, address: 'ANAA Protectora De animales, 28150 Valdetorres de Jarama, Madrid, España', city: 'Madrid - Fuente el Saz de Jarama', phone: '916 672 036', bio: faker.lorem.paragraph(), activation: { active: true } },
  { name: 'Asociación Abrazo Animal', email: 'ayuda@abrazoanimal.org', avatar: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.facebook.com%2Fabrazoanimal.org%2F&psig=AOvVaw08BlgbNAollg_OwyaQhUwi&ust=1599325266124000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCKDxgob9z-sCFQAAAAAdAAAAABAD', password: '1234', shelter: true, address: 'Avda. Del tren del Talgo n 4, 28290 Las Matas, Madrid', city: 'Madrid', phone: '916 301 524', bio: faker.lorem.paragraph(), activation: { active: true } },
  { name: 'Asociación Las Nieves', email: faker.internet.email(), avatar: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fadopta.pacma.es%2Flas-nieves%2F&psig=AOvVaw2krVfxfw_n72iNyZ7SHYss&ust=1599325456260000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCLjBpeD9z-sCFQAAAAAdAAAAABAD', password: '1234', shelter: true, address: faker.address.streetAddress(), city: 'Madrid', phone: '918 139 126', bio: faker.lorem.paragraph(), activation: { active: true } },
  { name: 'CICAM', email: faker.internet.email(), avatar: faker.image.cats(), password: '1234', shelter: true, address: 'Camino de La Dehesa, s/n, 28220; Majadahonda', city: 'Madrid - Majadahonda', phone: faker.phone.phoneNumber(), bio: faker.lorem.paragraph(), activation: { active: true } },
  { name: 'Salvando Peludos', email: faker.internet.email(), avatar: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.facebook.com%2Felcampitosalvandopeludos%2F&psig=AOvVaw3bKXhSH91N4ndBNd21kqGW&ust=1599326069243000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCLivpIaA0OsCFQAAAAAdAAAAABAK', password: '1234', shelter: true, address: 'Calle de Benicarló, Arroyomolinos, 28939 Madrid', city: 'Madrid - Arroyomolinos', phone: faker.phone.phoneNumber(), bio: faker.lorem.paragraph(), activation: { active: true } },
  { name: 'La Voz Animal', email: faker.internet.email(), avatar: '', password: '1234', shelter: true, address: faker.address.streetAddress(), city: 'Madrid', phone: faker.phone.phoneNumber(), bio: faker.lorem.paragraph(), activation: { active: true } },
  { name: 'NuevaVida Adopciones', email: 'gestionadopciones@nuevavida-adopciones.org', avatar: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Ftwitter.com%2Fnuevavidaadop&psig=AOvVaw0avEfhUGzfyKfeQdR_bdVs&ust=1599327358969000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCLigzeuE0OsCFQAAAAAdAAAAABAD', password: '1234', shelter: true, address: faker.address.streetAddress(), city: 'Madrid', phone: faker.phone.phoneNumber(), bio: faker.lorem.paragraph(), activation: { active: true } },
  { name: 'Perrigatos en apuros', email: 'info@perrigatosenapuros.org', avatar: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.facebook.com%2Fperrigatosenapuros%2F&psig=AOvVaw3AOzCLiWSIzgl-bnUBbjav&ust=1599327447945000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCPD_tJWF0OsCFQAAAAAdAAAAABAI', password: '1234', shelter: true, address: 'Perrigatos en Apuros, Calle del Marqués, 11, 28320 Pinto, Madrid', city: 'Madrid - Pinto', phone: faker.phone.phoneNumber(), bio: faker.lorem.paragraph(), activation: { active: true } },
  { name: 'Pérrikus', email: faker.internet.email(), avatar: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fm.facebook.com%2FPerrikus-Protectora-104958492888704%2F&psig=AOvVaw13vc04mI9VYTgRKSLv7o2D&ust=1599327534412000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCPjioL-F0OsCFQAAAAAdAAAAABAD', password: '1234', shelter: true, address: faker.address.streetAddress(), city: 'Madrid', phone: faker.phone.phoneNumber(), bio: faker.lorem.paragraph(), activation: { active: true } },
  { name: 'Rivanimal', email: faker.internet.email(), avatar: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Frivanimal.org%2F&psig=AOvVaw1HVrwMXt6DvsdcTcWQIeS-&ust=1599327798361000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCLiYob2G0OsCFQAAAAAdAAAAABAD', password: '1234', shelter: true, address: faker.address.streetAddress(), city: 'Madrid', phone: faker.phone.phoneNumber(), bio: faker.lorem.paragraph(), activation: { active: true } },
  { name: 'Aratadopta', email: 'aratadopciones@gmail.com', avatar: 'https://www.google.com/url?sa=i&url=http%3A%2F%2Fwww.aratadopta.com%2F&psig=AOvVaw1XTT9nYo5qT0Xovlsbp2tn&ust=1599327819739000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCIDitseG0OsCFQAAAAAdAAAAABAI', password: '1234', shelter: true, address: 'Centro de acogida animal. Paseo Joaquín Ruiz Gimenez 30', city: 'Madrid', phone: faker.phone.phoneNumber(), bio: faker.lorem.paragraph(), activation: { active: true } },
  { name: 'Proa', email: 'adopciones@proaweb.org', avatar: '', password: '1234', shelter: true, address: 'Proa, 28025 Leganés, Madrid', city: 'Madrid - Leganés', phone: faker.phone.phoneNumber(), bio: faker.lorem.paragraph(), activation: { active: true } },
]

const species = ['Dog', 'Cat', 'Others']
const age = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
const size = ['Small', 'Medium', 'Big']
const gender = ['Male', 'Female']

const createdUsers = []

function createUser(data) {
  const user = new User(data)

  return user.save()
}

function createPost(user) {
  const post = new Post({
    name: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    url: faker.internet.url(),
    image: faker.image.cats(),
    author: user._id,
    species: species[Math.floor(Math.random() * species.length)],
    gender: gender[Math.floor(Math.random() * species.length)],
    age: age[Math.floor(Math.random() * species.length)],
    size: size[Math.floor(Math.random() * species.length)],
    breed: faker.lorem.word(),
    place: user.city,
  })

  return post.save()
}

function createComment(post) {
  const comment = new Comment({
    text: faker.lorem.paragraph(),
    user: createdUsers[Math.floor(Math.random() * createdUsers.length)]._id,
    post: post._id
  })

  return comment.save()
}

function createLike(post ) {
  const like = new Like({
    user: createdUsers[Math.floor(Math.random() * createdUsers.length)]._id,
    post: post._id
  })

  return like.save()
}

function restoreDatabase() {
  return Promise.all([
    User.deleteMany({}),
    Comment.deleteMany({}),
    Post.deleteMany({}),
    Like.deleteMany({})
  ])
}

function seeds() {

  restoreDatabase()
    .then(() => {
      console.log('Database restored!')

      users.forEach(userData => {
        createUser(userData)
          .then((user) => {
            createdUsers.push(user)
            console.log(`${user.name} added to the database`);
            for (let i = 0; i < 3; i++) {
              createPost(user)
                .then(post => {
                  for (let j = 0; j < 10; j++) {
                    createComment(post)
                    createLike(post)
                  }
                })
            }
          })
          .catch(e => console.log('Error: ', e))
      });
    })

}

seeds()
