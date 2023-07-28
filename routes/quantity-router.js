const { Router } = require("express");
const Product = require('../models/Product-model');
const Quantity = require('../models/Quantity-model')
const isAuth = require('../utilis/auth');

const router = Router();


  router.post("/create-quantity", isAuth(), (req, res, next) => {
    const { quantity, quantityType, product} = req.body;
    Quantity.create({
      quantity,
      quantityType,
      product
    }).then((createdQ) => {
      res.send(createdQ)
    })
  });


  router.get("/get-quantity", (req, res) =>{
    Quantity.find().populate('product').exec((err, data) => {
      if (err) {
        console.log('ERROR',err);
      }else{
        // console.log('All data is:', data);
        res.status(200).send( data)
      }
    })
  })



  module.exports = router;