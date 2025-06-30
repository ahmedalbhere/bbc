const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');

// إنشاء منتج جديد
exports.createProduct = asyncHandler(async (req, res) => {
  const { barcode, name, price, category, stock } = req.body;

  const product = new Product({
    barcode,
    name,
    price,
    category,
    stock
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// الحصول على منتج بواسطة الباركود
exports.getProductByBarcode = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ barcode: req.params.barcode });

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'المنتج غير موجود' });
  }
});

// تحديث المنتج
exports.updateProduct = asyncHandler(async (req, res) => {
  const { name, price, category, stock } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.category = category || product.category;
    product.stock = stock || product.stock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404).json({ message: 'المنتج غير موجود' });
  }
});

// الحصول على جميع المنتجات
exports.getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const products = await Product.find()
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const count = await Product.countDocuments();

  res.json({
    products,
    page,
    pages: Math.ceil(count / limit),
    total: count
  });
});
