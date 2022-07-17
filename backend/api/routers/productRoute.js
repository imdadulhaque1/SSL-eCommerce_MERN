const router = require('express').Router();
const {createProduct, getAllProduct, getProductById, updateProductById} = require('../controllers/productController');
const admin = require('../../middlewares/admin');
const authorize = require('../../middlewares/authorize');

router.route('/')
    .post([authorize, admin], createProduct)
    .get(getAllProduct);

router.route('/:id')
    .get(getProductById)
    .put(updateProductById);

module.exports = router;