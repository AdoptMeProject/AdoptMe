const mongoose = require("mongoose");
const Comment = require('../models/comment.model')
const Like = require('../models/like.model')

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    url: {
      type: String,
      trim: true,
      // required: [true, 'Project url is required'],
    },
    github: {
      type: String,
      trim: true,
      // required: [true, 'Github url is required'],
    },
    image: {
      type: String,
      // required: [true, 'Image is required'],
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

projectSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "project",
  justOne: false,
});

projectSchema.virtual("likes", {
  ref: "Like",
  localField: "_id",
  foreignField: "project",
  count: true
});

projectSchema.post('remove', function (next) {
  Promise.all([
    Like.deleteMany({ project: this._id }),
    Comment.deleteMany({ project: this._id })
  ])
    .then(next)
})

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
