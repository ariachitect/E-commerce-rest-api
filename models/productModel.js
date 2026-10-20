const mongoose = require('mongoose');
const expPolicy = require('../config/expirationPolicy.json');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A product must have a name!'],
      trim: true,
      maxlength: [
        40,
        'A product name must have less or equal then 40 characters'
      ],
      minlength: [2, 'A product name must have more or equal then 2 characters']
    },
    category: {
      type: String,
      trim: true,
      enum: {
        values: [
          'dairy',
          'bakery',
          'beverages',
          'snacks',
          'fruits',
          'vegetables',
          'meat',
          'seafood',
          'frozen_foods',
          'personal_care',
          'canned_goods',
          'spices_and_condiments',
          'grains_and_pasta'
        ],
        message: "product category isn't valid"
      }
    },
    numInStock: {
      type: Number,
      max: [100, 'Maximun number of products in stock is 100.'],
      min: [0],
      required: [true, 'number of products in stock is required !']
    },
    avgRating: {
      type: Number,
      default: 4.5
    },
    ratingQuantity: {
      type: Number,
      default: 0
    },
    productPrice: {
      type: Number,
      required: [true, 'A product must have a price '],
      min: [0, 'Price must be equal or above 0']
    },
    brand: {
      type: String,
      trim: true,
      maxlength: [
        30,
        'A product brand name must have less or equal then 30 charachters'
      ],
      minlength: [
        2,
        'A product brand name must have more or equal then 2 charachters'
      ]
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'A product must have a description ']
    },
    expirationDate: {
      type: Date,
      required: [true, 'A product expiration Date must be specified']
    },
    productionDate: {
      type: Date,
      required: [true, 'A product production Date must be specified']
    },
    images: [String],
    special: {
      type: Boolean,
      default: false
    },
    priceDiscount: {
      type: Number,
      default: 0,
      validate: {
        validator: function(value) {
          console.log(value, ' ', this.productPrice);

          return value <= this.productPrice * 0.8;
        },
        message:
          'The price discoun should be betwean 0% upto maximum 80% of the product price'
      }
    }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// virtual property
productSchema.virtual('expierd').get(function() {
  return this.expirationDate <= Date.now();
});

//document middleware
productSchema.post('save', function(doc, next) {
  console.log(`The document has successfully saved.`);
  console.log(`Here it is : ${doc}`);
  next();
});

//query middleware
productSchema.pre(/^find/, function(next) {
  this.find({ special: { $ne: true } });
  next();
});

// instance methode (documents will inherit this)
productSchema.methods.detectExpirSoon = function() {
  const today = new Date();
  const DaysTillExp = Math.ceil((this.expirationDate - today) / 86400000);
  return DaysTillExp >= 0 && DaysTillExp <= expPolicy[this.category];
};

//check if path() is a right coise to unselect timestamps
productSchema.path('createdAt').select(false);
productSchema.path('updatedAt').select(false);
productSchema.index({ name: 1, brand: 1, productionDate: 1 }, { unique: true });
const Product = mongoose.model('Product', productSchema);
module.exports = Product;
