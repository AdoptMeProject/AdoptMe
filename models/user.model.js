const post = require("./post.model")
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const generateRandomToken = () => {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  return token;
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: [3, "Name needs at last 3 chars"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [EMAIL_PATTERN, "Email is invalid"],
  },
  avatar: {
    type: String,
    default: 'https://res.cloudinary.com/ddjnw7lmb/image/upload/v1599303759/ironsummerpost/xjdrromxlewwb1euhdcv.png'
  },
  password: {
    type: String,
    minlength: [4, "password min length is 4"]
  },
  shelter: {
    type: Boolean,
    default: false
  },
  address: {
    type: String
  },
  city: {
    type: String
  },
  locationMap: { 
    type: { type: String }, 
    coordinates: [Number] 
  },
  locationTest: {
    type: String
  },
  phone: {
    type: String
  },
  bio: {
    type: String
  },
  activation: {
    active: {
      type: Boolean,
      default: false
    },
    token: {
      type: String,
      default: generateRandomToken
    }
  },
  social: {
    slack: String
  }
},
{ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.virtual("posts", {
  ref: "post",
  localField: "_id",
  foreignField: "author",
  justOne: false,
});

userSchema.virtual("shelterposts", {
  ref: "post",
  localField: "_id",
  foreignField: "shelter",
  justOne: false,
});

userSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    bcrypt.hash(this.password, 10).then((hash) => {
      this.password = hash;
      next();
    });
  } else {
    next();
  }
})

userSchema.post('remove', function (next) {
  Promise.all([
    post.deleteMany({ author: this._id }),
  ])
    .then(next)
})

userSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password);
}

const User = mongoose.model("User", userSchema);

module.exports = User;
