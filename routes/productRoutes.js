const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

//aliasing
router.get('/warehouseValue', productController.WarehouseValue);
router.get(
  '/top-5-Products',
  productController.top5ProductsAlias,
  productController.getProducts
);
router.get(
  '/topBrandsBycategory/:category',
  productController.topBrandsBycategory
);
router.get(
  '/expierdProducts',
  productController.expierdProducts,
  productController.getProducts
);
router.get('/ProdClass', productController.ProductsClassification);
router.get('/expierdSoon', productController.expierSoonProducts);

//general routing
router
  .route('/')
  .get(productController.getProducts)
  .post(productController.postProduct);

router
  .route('/:id')
  .get(productController.getProduct)
  .delete(productController.deleteProduct)
  .patch(productController.patchProduct);

module.exports = router;
