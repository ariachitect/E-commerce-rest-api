const Product = require('../models/productModel');
const APIFeatures = require('../utils/APIFeatures');

exports.WarehouseValue = async (req, res) => {
  try {
    const { groupBy = 'category' } = req.query;
    //validator
    if (!['category', 'brand'].includes(groupBy.toLowerCase())) {
      throw new Error('Group id should be brand or category !');
    }
    const data = await Product.aggregate([
      {
        $group: {
          _id: `$${groupBy}`,
          totalNumInStock: { $sum: '$numInStock' },
          totalValue: {
            $sum: { $multiply: ['$numInStock', '$productPrice'] }
          }
        }
      }
    ]);
    let totalWarehouseValue = 0;
    data.forEach(el => {
      totalWarehouseValue += el.totalValue;
    });
    res
      .status(200)
      .json({ status: 'success', TotalValue: totalWarehouseValue, data });
  } catch (err) {
    res.status(400).json({ status: 'failed', message: err.message });
  }
};
exports.expierSoonProducts = async (req, res) => {
  try {
    const productFeatures = new APIFeatures(Product.find(), req.query);
    productFeatures
      .filter()
      .limiting()
      .pageination()
      .sort();
    //execute the query
    const filteredResult = await productFeatures.query;
    const result = filteredResult.filter(element => element.detectExpirSoon());
    res.status(200).json({
      status: 'success',
      result: result.length,
      data: result
    });
  } catch (err) {
    res.status(400).json({ status: 'faild', message: err });
  }
};

exports.ProductsClassification = async (req, res) => {
  try {
    const result = await Product.aggregate([
      {
        $addFields: {
          reviewScore: {
            $multiply: ['$avgRating', { $ln: { $add: [1, '$ratingQuantity'] } }]
          }
        }
      },
      {
        $addFields: {
          class: {
            $switch: {
              branches: [
                {
                  case: { $lte: ['$reviewScore', 12] },
                  then: 'C'
                },
                {
                  case: { $gte: ['$reviewScore', 17] },
                  then: 'A'
                },
                {
                  case: {
                    $and: [
                      { $lt: ['$reviewScore', 17] },
                      { $gt: ['$reviewScore', 12] }
                    ]
                  },
                  then: 'B'
                }
              ],
              default: 'B'
            }
          }
        }
      },
      {
        $group: {
          _id: '$class',
          num: { $sum: 1 },
          avgScore: { $avg: '$reviewScore' },
          totalNumInStock: { $sum: '$numInStock' },
          brands: { $addToSet: '$brand' },
          categorys: { $addToSet: '$category' }
        }
      },
      {
        $project: {
          _id: 0,
          class: '$_id',
          num: 1,
          avgScore: 1,
          totalNumInStock: 1,
          brands: 1,
          categorys: 1
        }
      },
      {
        $sort: { class: 1 }
      }
    ]);
    res.status(200).json({
      status: 'sucess',
      data: result
    });
  } catch (err) {
    res.status(404).json({ status: 'faild', message: err });
  }
};
exports.topBrandsBycategory = async (req, res) => {
  try {
    const categoryName = req.params.category;
    const stats = await Product.aggregate([
      { $match: { category: categoryName } },
      {
        $group: {
          _id: '$brand',
          numProducts: { $sum: 1 },
          avgProductsRating: { $avg: '$avgRating' },
          allRatingsQuantity: { $sum: '$ratingQuantity' },
          totalNumInStock: { $sum: '$numInStock' },
          avgProductsPrice: { $avg: '$productPrice' },
          mostExpensiveProduct: { $max: '$productPrice' },
          CheapestProduct: { $min: '$productPrice' }
        }
      },
      {
        $addFields: {
          brandScore: {
            $trunc: [
              {
                $add: [
                  { $multiply: [0.5, '$avgProductsRating'] },
                  { $multiply: [0.2, { $ln: '$allRatingsQuantity' }] },
                  { $multiply: [0.2, { $sqrt: '$totalNumInStock' }] },
                  {
                    $multiply: [
                      -0.1,
                      { $divide: ['$avgProductsPrice', 100000] }
                    ]
                  }
                ]
              },
              2
            ]
          }
        }
      },
      {
        $sort: {
          brandScore: -1,
          avgProductsRating: -1,
          totalNumInStock: -1
        }
      }
    ]);
    res.status(200).json({
      status: 'success',
      data: stats
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      err
    });
  }
};

exports.top5ProductsAlias = (req, res, next) => {
  req.query.ratingQuantity = { gte: 40 };
  req.query.sort = '-avgRating,-ratingQuantity';
  req.query.limit = 5;
  req.query.page = 1;
  next();
};
exports.expierdProducts = (req, res, next) => {
  const todaysDate = new Date();
  req.query.expirationDate = { lt: todaysDate };
  req.query.sort = 'expirationDate';
  req.query.fields = 'name,brand,numInStock,productionDate,expirationDate';
  next();
};

exports.getProducts = async (req, res) => {
  try {
    //api feuters
    const productFeatures = new APIFeatures(Product.find(), req.query);
    productFeatures
      .filter()
      .limiting()
      .pageination()
      .sort();
    //execute the query
    const result = await productFeatures.query;
    res.status(200).json({
      status: 'success',
      result: result.length,
      data: result
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err
    });
  }
};

exports.postProduct = async (req, res) => {
  try {
    const product = req.body;
    const result = await Product.create(product);
    res.status(201).json({
      status: 'sucess',
      data: result
    });
  } catch (err) {
    res.status(400).json({
      status: 'faild',
      message: err
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    res.status(200).json({
      status: 'success',
      data: product
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const response = await Product.findByIdAndDelete(productId);
    res.status(204).json({
      status: 'success',
      data: response
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err
    });
  }
};

exports.patchProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const newData = req.body;

    //Old methode‌ (It couldn't handel this in validator)
    /*   const response = await Product.findByIdAndUpdate(productId, newData, {
      runValidators: true,
      new: true
    });
    */
    //New methode
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        status: 'failed',

        message: 'Product not found'
      });
    }
    Object.assign(product, newData);
    await product.save();

    res.status(200).json({
      status: 'success',
      data: product
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      essage: err
    });
  }
};
