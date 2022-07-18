const router = require('express').Router();
const {createProduct, getProducts, getProductById, updateProductById, getProductPhoto, filterProducts} = require('../controllers/productController');
const admin = require('../../middlewares/admin');
const authorize = require('../../middlewares/authorize');

router.route('/')
    .post([authorize, admin], createProduct)
    .get(getProducts);

router.route('/:id')
    .get(getProductById)
    .put([authorize, admin] ,updateProductById);

router.route('/photo/:id')
    .get(getProductPhoto);


router.route('/filter')
    .post(filterProducts);

module.exports = router;