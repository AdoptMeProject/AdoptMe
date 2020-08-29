const Project = require("./project.model")
const Comment = require("./comment.model")
const Like = require("./like.model")
//Like --> cambiar por Me interesa o algo así y se guarda en el perfil
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
  phone: {
    type: Number
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

userSchema.virtual("projects", {
  ref: "Project",
  localField: "_id",
  foreignField: "author",
  justOne: false,
});

userSchema.virtual("staffProjects", {
  ref: "Project",
  localField: "_id",
  foreignField: "staff",
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
    Project.deleteMany({ author: this._id }),
    Like.deleteMany({ user: this._id }),
    Comment.deleteMany({ user: this._id })
  ])
    .then(next)
})

userSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password);
}

const User = mongoose.model("User", userSchema);

module.exports = User;
