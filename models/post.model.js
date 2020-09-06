const mongoose = require("mongoose");
const Comment = require('./comment.model')
const Like = require('./like.model')

const postSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Post title is required'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    url: {
      type: String,
      trim: true,
      // required: [true, 'post url is required'],
    },
    place: {
      type: String, 
      trim: true,
      required: [true, 'Location is required'],
    },
    species: {
      type: String,
      enum: ['Dog', 'Cat', 'Others'],
      required: [true, 'Species is required'],
    },
    breed: {
      type: String, 
    },
    gender: {
      type: String,
      enum: ['Male', 'Female']
    },
    age: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    },
    size: {
      type: String,
      enum: ['Small', 'Medium', 'Big']
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shelter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

postSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
  justOne: false,
});

postSchema.virtual("likes", {
  ref: "Like",
  localField: "_id",
  foreignField: "post",
  count: true
});

postSchema.post('remove', function (next) {
  Promise.all([
    Like.deleteMany({ post: this._id }),
    Comment.deleteMany({ post: this._id })
  ])
    .then(next)
})

const Post = mongoose.model("post", postSchema);

module.exports = Post;
