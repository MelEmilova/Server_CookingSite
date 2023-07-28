const env = process.env.NODE_ENV || "development";
const config = require('../config/config')[env];
const { development } = require('../config/config');
const Recipe = require("../models/Recipe-model");
const User = require("../models/User-model");
const { createToken, verifyToken } = require("../utilis/jwt-token");
const isAuth = require('../utilis/auth');
const { Router } = require("express");
const tokenBlacklistModel = require('../models/TokenBlacklist-model');
const router = Router();

router.post("/register", (req, res, next) => {
  const { username, email, password } = req.body;

  User.create({ username, email, password })
    .then((createdUser) => {
      const token = createToken({ id: createdUser._id });
      res.header('Authorization', token).send(createdUser);
      console.log("OK Created", createdUser);
    })
    .catch((err) => {
      send('Error register', err)
      console.log('ERROR', err);
    });
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => Promise.all([user.passwordsMatch(password), user]))
    .then(([match, user]) => {
      if (!match) {
        res.status(401).send('Invalid password must be et least 8 characters');
        return;
      }
      const token = createToken({ id: user._id });
      console.log("OK Login", token, user);
      res.header('Authorization', token).send(user);
    })
    .catch(next);
});

router.post("/verify", (req, res, next) => {
  const token = req.body.token || '';

  Promise.all([
    verifyToken(token),
    tokenBlacklistModel.findOne({ token })
  ])
    .then(([data, blacklistToken]) => {
      if (blacklistToken) { return Promise.reject(new Error('blacklisted token')); }

      User.findById(data.id)
        .then((user) => {
          return res.send({
            status: true,
            user
          });
        });
    })
    .catch(err => {
      if (!auth.redirectAuthenticated) { next(); return; }

      if (['token expired', 'blacklisted token', 'jwt must be provided'].includes(err.message)) {
        res.status(401).send('UNAUTHORIZED!');
        return;
      }

      res.send({
        status: false
      });
    });
});

router.post("/logout", isAuth(), (req, res, next) => {
  const token = req.cookies[development.authCookieName];
  console.log('-'.repeat(100));
  console.log('-'.repeat(100));
  tokenBlacklistModel.create({ token })
    .then(() => {
      res.clearCookie(development.authCookieName).send("Logout successfully!");
    })
    .catch(next);
});





router.get("/user-details", isAuth(), (req, res) => {
  const user = req.user;
  const idUser = req.user.id;
  console.log(user, userId);
  let resultUserRecipes = [];
  const resultData = [];
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
      resultData.push(user);
      resultData.push(resultUserRecipes)
      return res.send(resultData);
    });
});

router.delete("/delete-user", isAuth(), (req, res, next) => {
  const id = req.params.id;
  User.deleteOne({ _id: id })
    .then((removedUser) => res.send(removedUser))
    .catch(next);
});

module.exports = router;

