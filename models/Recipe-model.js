const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

const RecipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: false
    },

    description: {
        type: String,
        required: true
    },

    imageUrl: {
        type: String,
        required: true
    },

    productQuantities: [{
        type: ObjectId,
        ref: 'Quantity',
    }],

    authorId: {
        type: ObjectId,
        ref: "User"
    },
    authorName:{
        type:String,
        required: true
    }, 
    likedNumber: {
        type: Number
    },

    comments: [{
        type: ObjectId,
        ref: 'Comment',
    }],
});


module.exports = mongoose.model("Recipe", RecipeSchema);