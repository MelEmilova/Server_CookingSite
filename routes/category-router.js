const { Router } = require("express");
const Recipe = require("../models/Recipe-model");
const User = require("../models/User-model");
const Quantity = require('../models/Quantity-model');
const isAuth = require('../utilis/auth');
const router = Router();


router.get('/find-recipe-meat', (req, res) => {
  let resultMeat = [];
  let finalResult = [];
  Recipe.find().lean().populate({
    path: "productQuantities",
    populate: {
      path: 'product'
    }
  }).then(data => {
    data.map(recipe => {
      recipe.productQuantities.map(quant => {
        if (quant.product.category === "MEAT") {
          resultMeat.push(recipe);
        }
      });
    });
    for (let i = 1; i < resultMeat.length; i++) {
      const el1 = resultMeat[i];
      const el2 = resultMeat[i - 1];
      if (el1._id != el2._id) {
        finalResult.push(el1);
      }
    }
    finalResult.push(resultMeat[0]);
    return res.send(finalResult);
  });
});

router.get('/find-recipe-dairy', (req, res) => {
  let resultMeat = [];
  let finalResult = [];
  Recipe.find().lean().populate({
    path: "productQuantities",
    populate: {
      path: 'product'
    }
  }).then(data => {
    data.map(recipe => {
      recipe.productQuantities.map(quant => {
        if (quant.product.category === "DAIRY") {
          resultMeat.push(recipe);
        }
      });
    });
    for (let i = 1; i < resultMeat.length; i++) {
      const el1 = resultMeat[i];
      const el2 = resultMeat[i - 1];
      if (el1._id != el2._id) {
        finalResult.push(el1);
      }
    }
    finalResult.push(resultMeat[0]);
    return res.send(finalResult);
  });
});

router.get('/find-recipe-vegetables', (req, res) => {
  let resultMeat = [];
  let finalResult = [];
  Recipe.find().lean().populate({
    path: "productQuantities",
    populate: {
      path: 'product'
    }
  }).then(data => {
    data.map(recipe => {
      recipe.productQuantities.map(quant => {
        if (quant.product.category === "VEGETABLES") {
          resultMeat.push(recipe);
        }
      });
    });
    for (let i = 1; i < resultMeat.length; i++) {
      const el1 = resultMeat[i];
      const el2 = resultMeat[i - 1];
      if (el1._id != el2._id) {
        finalResult.push(el1);
      }
    }
    finalResult.push(resultMeat[0]);
    return res.send(finalResult);
  });
});

router.get('/find-recipe-legumes', (req, res) => {
  let resultMeat = [];
  let finalResult = [];
  Recipe.find().lean().populate({
    path: "productQuantities",
    populate: {
      path: 'product'
    }
  }).then(data => {
    data.map(recipe => {
      recipe.productQuantities.map(quant => {
        if (quant.product.category === "LEGUMES") {
          resultMeat.push(recipe);
        }
      });
    });
    for (let i = 1; i < resultMeat.length; i++) {
      const el1 = resultMeat[i];
      const el2 = resultMeat[i - 1];
      if (el1._id != el2._id) {
        finalResult.push(el1);
      }
    }
    finalResult.push(resultMeat[0]);
    return res.send(finalResult);
  });
});


module.exports = router;