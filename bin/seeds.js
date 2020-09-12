require('dotenv').config();
require("../config/db.config");
const mongoose = require('mongoose');

const User = require('../models/user.model')
const Post = require('../models/post.model')
const faker = require('faker');

const users = [
  { name: 'ALBA Protectora', email: faker.internet.email(), avatar: 'https://img.miwuki.com/p/AD9GVA/250', password: '1234', shelter: true, address: 'ALBA Protectora, Camino del Corral, 60, 28816 Camarma de Esteruelas, Madrid', city: 'Madrid', locationTest: 'ALBA+Protectora,Madrid+Spain', phone: faker.phone.phoneNumber(), bio: faker.lorem.paragraph(fava), activation: { active: true } },
  { name: 'Asociación Almanimal', email: 'bimba@almanimal.org', avatar: 'https://almanimal.co/wp-content/uploads/2019/09/almanimal-logo-e1567906343260.jpg', password: '1234', shelter: true, address: faker.address.streetAddress(), city: 'Madrid - Brunete, Boadilla del Monte', locationTest: 'Ironhack,Madrid+Spain', phone: faker.phone.phoneNumber(), bio: faker.lorem.paragraph(fava), activation: { active: true } },
  { name: 'ANAA Asociación Amigos de los Animales', email: faker.internet.email(), avatar: 'https://pbs.twimg.com/profile_images/1179340461460381697/Ag1K6at5_400x400.jpg', password: '1234', shelter: true, address: 'ANAA Protectora De animales, 28150 Valdetorres de Jarama, Madrid, España', locationTest: 'ANNA+Protectora+de+animales,Madrid+Spain', city: 'Madrid - Fuente el Saz de Jarama', phone: '916 672 036', bio: faker.lorem.paragraph(fava), activation: { active: true } },
  { name: 'Asociación Abrazo Animal', email: 'ayuda@abrazoanimal.org', avatar: 'https://abrazoanimal.org/wp-content/uploads/2019/01/logo-abrazo-animal.gif', password: '1234', shelter: true, address: 'Avda. Del tren del Talgo n 4, 28290 Las Matas, Madrid', city: 'Madrid', locationTest: 'Abrazo+Animal,Madrid+Spain', phone: '916 301 524', bio: faker.lorem.paragraph(), activation: { active: true } },
  { name: 'Asociación Las Nieves', email: faker.internet.email(), avatar: 'https://adopta.pacma.es/wp-content/uploads/2015/10/LOGO-LAS-NIEVES-267x300.jpg', password: '1234', shelter: true, address: faker.address.streetAddress(), city: 'Madrid', locationTest: 'Ironhack,Madrid+Spain', phone: '918 139 126', bio: faker.lorem.paragraph(), activation: { active: true } },
  { name: 'CICAM', email: faker.internet.email(), avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTEkBErH9GcGhEHrr2pPKN8YcHHD8AriYFbhw&usqp=CAU', password: '1234', shelter: true, address: 'Camino de La Dehesa, s/n, 28220; Majadahonda', city: 'Madrid - Majadahonda', locationTest: 'CICAM+Majadahonda,Madrid+Spain', phone: faker.phone.phoneNumber(), bio: faker.lorem.paragraph(fava), activation: { active: true } },
  { name: 'Salvando Peludos', email: faker.internet.email(), avatar: 'https://salvandopeludos.org/wp-content/uploads/2020/04/logoRedondo.png', password: '1234', shelter: true, address: 'Calle de Benicarló, Arroyomolinos, 28939 Madrid', city: 'Madrid - Arroyomolinos', locationTest: 'El+Campito+Salvando+Peludos,Madrid+Spain', phone: faker.phone.phoneNumber(), bio: faker.lorem.paragraph(fava), activation: { active: true } },
  { name: 'La Voz Animal', email: faker.internet.email(), avatar: 'https://static.guiaongs.org/wp-content/uploads/2015/12/vanimal_destacada-360x336.png', password: '1234', shelter: true, address: faker.address.streetAddress(), city: 'Madrid', locationTest: 'ASOCIACION+LA+VOZ+ANIMAL,Madrid+Spain', phone: faker.phone.phoneNumber(), bio: faker.lorem.paragraph(fava), activation: { active: true } },
  { name: 'NuevaVida Adopciones', email: 'gestionadopciones@nuevavida-adopciones.org', avatar: 'https://img.miwuki.com/p/2VRNJ5/250', password: '1234', shelter: true, address: faker.address.streetAddress(), city: 'Madrid', locationTest: 'NUEVAVIDA+Adopciones,Madrid+Spain', phone: faker.phone.phoneNumber(), bio: faker.lorem.paragraph(), activation: { active: true } },
  { name: 'Perrigatos en apuros', email: 'info@perrigatosenapuros.org', avatar: 'http://perrigatosenapuros.org/images/logo_perrigatos2.png', password: '1234', shelter: true, address: 'Perrigatos en Apuros, Calle del Marqués, 11, 28320 Pinto, Madrid', city: 'Madrid - Pinto', locationTest: 'Perrigatos+en+Apuros,Madrid+Spain', phone: faker.phone.phoneNumber(), bio: faker.lorem.paragraph(fava), activation: { active: true } },
  { name: 'Pérrikus', email: faker.internet.email(), avatar: 'http://perrikus.org/wp-content/uploads/2016/08/Img_logo2-1.png', password: '1234', shelter: true, address: faker.address.streetAddress(), city: 'Madrid', locationTest: 'perrikus,Madrid+Spain', phone: faker.phone.phoneNumber(), bio: faker.lorem.paragraph(fava), activation: { active: true } },
  { name: 'Rivanimal', email: faker.internet.email(), avatar: 'https://rivanimal.org/_mibambu/_rivanimal/imas/logo.jpg', password: '1234', shelter: true, address: faker.address.streetAddress(), city: 'Madrid', locationTest: 'Rivanimal,Madrid+Spain', phone: faker.phone.phoneNumber(), bio: faker.lorem.paragraph(fava), activation: { active: true } },
  { name: 'Aratadopta', email: 'aratadopciones@gmail.com', avatar: 'http://www.aratadopta.com/attachments/Image/logo_CAAT.jpg', password: '1234', shelter: true, address: 'Centro de acogida animal. Paseo Joaquín Ruiz Gimenez 30', city: 'Madrid', locationTest: 'Centro+de+Acogida+Animal,Madrid+Spain', phone: faker.phone.phoneNumber(), bio: faker.lorem.paragraph(fava), activation: { active: true } },
  { name: 'Proa', email: 'adopciones@proaweb.org', avatar: 'https://img.miwuki.com/p/9DEG7U/250', password: '1234', shelter: true, address: 'Proa, 28025 Leganés, Madrid', city: 'Madrid - Leganés', locationTest: 'Proa,Madrid+Spain', phone: faker.phone.phoneNumber(), bio: faker.lorem.paragraph(fava), activation: { active: true } },
]

const species = ['Dog', 'Cat', 'Others']
const age = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
const size = ['Small', 'Medium', 'Big']
const gender = ['Male', 'Female']
const urgent = [true, false]

const createdUsers = []

function createUser(data) {
  const user = new User(data)

  return user.save()
}

function createPost(user) {
  const post = new Post({
    name: faker.lorem.word(),
    description: faker.lorem.paragraph(),
    url: faker.internet.url(),
    image: faker.image.cats(),
    author: user._id,
    species: species[Math.floor(Math.random() * species.length)],
    gender: gender[Math.floor(Math.random() * species.length)],
    age: age[Math.floor(Math.random() * species.length)],
    size: size[Math.floor(Math.random() * species.length)],
    urgent: urgent[Math.floor(Math.random() * species.length)],
    breed: faker.lorem.word(),
    place: user.city,
  })

  return post.save()
}

function restoreDatabase() {
  return Promise.all([
    User.deleteMany({}),
    Post.deleteMany({}),
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
            }
          })
          .catch(e => console.log('Error: ', e))
      });
    })

}

seeds()
