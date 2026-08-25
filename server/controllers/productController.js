const Product = require("../models/Product");
const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");


// Create product
const createProduct = async (req, res) => {
    try {
        const {
            productName,
            productCode,
            category,
            subCategory,
            brand,
            mrp,
            price
        } = req.body || {};

        if (
            !productName ||
            !productCode ||
            !category ||
            !subCategory ||
            !brand ||
            mrp === undefined ||
            price === undefined
        ) {
            return res.status(400).json({
                message: "All product fields are required"
            });
        }

        // Check category
        const categoryExists = await Category.findById(category);

        if (!categoryExists) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        // Check subcategory
        const subCategoryExists =
            await SubCategory.findById(subCategory);

        if (!subCategoryExists) {
            return res.status(404).json({
                message: "Subcategory not found"
            });
        }

        // Make sure subcategory belongs to selected category
        if (
            subCategoryExists.category.toString() !== category
        ) {
            return res.status(400).json({
                message:
                    "Subcategory does not belong to the selected category"
            });
        }

        // Check product code
        const existingProduct = await Product.findOne({
            productCode
        });

        if (existingProduct) {
            return res.status(409).json({
                message: "Product code already exists"
            });
        }

        // Validate price
        if (Number(price) > Number(mrp)) {
            return res.status(400).json({
                message: "Price cannot be greater than MRP"
            });
        }

        // Image path
        let image = "";

        if (req.file) {
            image = `/uploads/products/${req.file.filename}`;
        }

        // Create product
        const product = await Product.create({
            productName,
            productCode,
            category,
            subCategory,
            brand,
            mrp,
            price,
            image
        });

        res.status(201).json({
            message: "Product created successfully",
            data: product
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to create product",
            error: error.message
        });
    }
};

// Get all products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate("category", "categoryName")
            .populate("subCategory", "subCategoryName")
            .sort({ createdAt: -1 });

        res.status(200).json({
            data: products
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch products",
            error: error.message
        });
    }
};


// Get product by ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate("category", "categoryName")
            .populate("subCategory", "subCategoryName");

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            data: product
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch product",
            error: error.message
        });
    }
};


// Update product
const updateProduct = async (req, res) => {
    try {
        const {
            productName,
            productCode,
            category,
            subCategory,
            brand,
            mrp,
            price
        } = req.body || {};

        if (
            !productName ||
            !productCode ||
            !category ||
            !subCategory ||
            !brand ||
            mrp === undefined ||
            price === undefined
        ) {
            return res.status(400).json({
                message: "All product fields are required"
            });
        }

        // Check category
        const categoryExists = await Category.findById(category);

        if (!categoryExists) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        // Check subcategory
        const subCategoryExists = await SubCategory.findById(subCategory);

        if (!subCategoryExists) {
            return res.status(404).json({
                message: "Subcategory not found"
            });
        }

        // Check relationship
        if (subCategoryExists.category.toString() !== category) {
            return res.status(400).json({
                message: "Subcategory does not belong to the selected category"
            });
        }

        // Check duplicate product code
        const existingProduct = await Product.findOne({
            productCode,
            _id: { $ne: req.params.id }
        });

        if (existingProduct) {
            return res.status(409).json({
                message: "Product code already exists"
            });
        }

        // Validate price
        if (Number(price) > Number(mrp)) {
            return res.status(400).json({
                message: "Price cannot be greater than MRP"
            });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                productName,
                productCode,
                category,
                subCategory,
                brand,
                mrp,
                price
            },
            {
                new: true,
                runValidators: true
            }
        )
            .populate("category", "categoryName")
            .populate("subCategory", "subCategoryName");

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product updated successfully",
            data: product
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update product",
            error: error.message
        });
    }
};


// Delete product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(
            req.params.id
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete product",
            error: error.message
        });
    }
};


module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};