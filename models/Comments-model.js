const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");


const CommentSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
    unique: true
  },
  comment: {
    type: String,
    required: true
  },
  recipe: {
    type: ObjectId,
    ref: "Recipe"
  }
});


module.exports = mongoose.model("Comment", CommentSchema);