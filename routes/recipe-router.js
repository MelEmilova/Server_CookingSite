const { Router } = require("express");
const Recipe = require("../models/Recipe-model");
const User = require("../models/User-model");
const Quantity = require('../models/Quantity-model');
const isAuth = require('../utilis/auth');
const router = Router();


router.get('/recipe-details/:id', (req, res) => {
  let id = req.params;
  Recipe.find().lean().populate({
    path: "productQuantities",
    populate: {
      path: 'product'
    }
  }).then(data => {
    data.map(recipe => {
      if (recipe._id == id.id) {
        return res.send(recipe);
      }
    });
  });
});

router.get('/user-recipes/:idUser',  (req, res) => {
  let resultUserRecipes = [];
  let { idUser } = req.params;

  Recipe.find().lean().populate({
    path: "productQuantities",
    populate: {
      path: 'product'
    }
  })
    .then(data => {
      data.map(recipe => {
        if (idUser === (recipe.author).toString()) {
          resultUserRecipes.push(recipe);
        }
      });
      return res.send(resultUserRecipes);
    });
});


router.post('/find-recipes', (req, res, next) => {

  let result = [];
 
  Recipe.find().lean().populate({
    path: "productQuantities",
    populate: {
      path: 'product'
    }
  }).then(data => {
    let { allProducts } = req.body;
    

    data.map(recipe => {
      if (recipe.productQuantities.length === allProducts.length) {
        console.log(allProducts);
        let count = 0;
        recipe.productQuantities.map(productQuontity => {

          allProducts.map(userProduct => {
            if ((productQuontity.product.title.toString().toLowerCase().trim()) === (userProduct.toString().toLowerCase().trim())) {
              count++;
            }

          });
          if (count === allProducts.length && count > 0) {
            count = 0;
            result.push(recipe);
          }
        });
      }
    });
    return res.send(result);
  });
});

router.post("/create-recipe", isAuth(), async (req, res, next) => {
  let { title, description, imageUrl, productQuantities, authorId, authorName, likedNumber } = req.body;

  const createdRecipe = await Recipe.create({
    title,
    description,
    imageUrl,
    productQuantities,
    authorId,
    authorName,
    likedNumber,
  });

  let user = req.user;
  User.findById(user._id)
    .then(data => {

      let recipes = req.user.recipes;
      recipes.push(createdRecipe._id);

      User.updateOne(
        { "_id": user._id },
        { $set: { recipes: recipes } }, function (err, result) {
          if (err) {
            console.log(err);
          } else {
            console.log('User updated!');
          }
        });
    })
    .then(result => {
      res.send('Recipe created and User updated');
    });
});


router.put('/edit-recipe/:id', isAuth(), (req, res, next) => {
  let { title, description, imageUrl, productQuantities, authorId, likedNumber, dislikedNumber } = req.body;
  Recipe.updateOne({
    title,
    description,
    imageUrl,
    productQuantities,
    authorId,
    likedNumber,
    dislikedNumber
  })
    .then((updated) => {
      res.status(200).send(updated);
      return;
    })
    .catch(err => console.log(err));


});


router.get("/all-recipes", (req, res, next) => {
  let test;
  test = req.body;
  console.log('Mel new', test)
  Recipe.find().lean().populate({
    path: "productQuantities",
    populate: {
      path: 'product'
    }
  })
    .exec((err, data) => {
      if (err) {
        console.log('ERROR', err);
      } else {
        res.status(200).send(data);
      }
    });
});



router.delete("/delete-recipe/:idRecipe/user/:idUser", (req, res, next) => {
  const idRecipe = req.params.idRecipe;
  let user = req.params.idUser;
  console.log(idRecipe, user);

  Recipe.findByIdAndDelete(idRecipe, function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("Successful deletion");
  });

  User.updateOne(
    { "_id": user },
    { $pull: { recipes: { $in: [idRecipe] } } }, function (err, result) {
      if (err) {
        return console.log(err);
      } else {
        console.log('User updated!');
      }
    })
    .then(result => {});
 


  User.find({ liked: idRecipe }, function (err, result) {
    if (err) {
      return console.log(err);
    } else {
      User.updateMany(
        {},
        { $pull: { liked: { $in: [idRecipe] }, } })
        .then(result => {});
      res.send('Removed done!');
      next();
    }
  });

  // User.find({ disliked: (idRecipe) }, function (err, result) {
  //   if (err) {
  //     return console.log(err);
  //   } else {
  //     User.updateMany(
  //       {},
  //       { $pull: { disliked: { $in: [idRecipe] }, } })
  //       .then(result => {
  //         res.send('Removed done!');
  //       });
  //   }
  // });
});





router.put('/liked-recipe/:idRecipe/user/:idUser', (req, res, next) => {
  // let { title, description, imageUrl, productQuantities, author, likedNumber, dislikedNumber } = req.body;
  const idRecipe = req.params.idRecipe;
  Recipe.updateOne(
    { "_id": idRecipe },
    { $inc: { likedNumber: 1 } }, function (err, result) {
      if (err) {
      return  console.log(err);
      } else {
        console.log('Recipe liked + 1!');
      }
    });

  let user = req.params.idUser;
  console.log(user);
  User.updateOne(
    { '_id': user},
    { $addToSet: { liked: [idRecipe] } }, function (err, result) {

    

      if (err) {
      return  console.log(err);
      } else {
        console.log('User liked + 1!');
        next();
      }
    });

});

router.put('/disliked-recipe/:idRecipe', isAuth(), (req, res, next) => {
  // let { title, description, imageUrl, productQuantities, author, likedNumber, dislikedNumber } = req.body;
  const idRecipe = req.params.idRecipe;

  Recipe.updateOne(
    { "_id": idRecipe },
    { $inc: { dislikedNumber: 1 } }, function (err, result) {
      if (err) {
       return console.log(err);
      } else {
        console.log('Recipe disliked + 1!');
      }
    });

  let user = req.user;
  User.updateOne(
    { "_id": user._id },
    { $addToSet: { disliked: idRecipe } }, function (err, result) {
      if (err) {
      return  console.log(err);
      } else {
        console.log('User disliked + 1!');
        res.send('User disliked + 1!');
      }
    });

});





module.exports = router;
