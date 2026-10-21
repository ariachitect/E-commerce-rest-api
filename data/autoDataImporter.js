/*
future note :
i can add delete function too
is better to change this script name too seed.js 
i can use file arguman for handeling delete or import functions

*/

const fs = require('fs');
const mongoose = require('mongoose');
const Product = require('../models/productModel');
const dotenv = require('dotenv');
const { log } = require('console');

dotenv.config({ path: `${__dirname}/../config/config.env` });

const DataString = fs.readFileSync(
  `${__dirname}/./sample_products.json`,
  'utf-8'
);

const Data = JSON.parse(DataString);

const importer = async function() {
  try {
    //connecting to mongoose

    await mongoose.connect(process.env.DATABASE);
    log('--- Successfully connected to the Database!');
    log('--- Deleting duplicate keys ...');
    await Product.deleteMany();
    log('--- Trying to import the data ...');
    await Product.create(Data);
    log('--- Data has succsssfully imported!');
    process.exit(0);
  } catch (err) {
    log('--- The import process has failed)\n--- Here is the error :\n');
    console.error(err);
    process.exit(1);
  }
};

importer();
