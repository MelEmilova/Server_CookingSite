"use strict";

var mongoose = require("mongoose");

var ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true // unique: true,

  },
  isAllergy: {
    type: Boolean,
    required: true,
    "default": false
  },
  category: {
    type: String,
    required: true,
    "enum": ['VEGETABLES', 'MEAT', 'DAIRY', 'EGGS', 'FRUITS', 'LEGUMES', 'PASTA']
  }
});

module.exports = mongoose.model("Product", ProductSchema);