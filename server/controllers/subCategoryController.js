const SubCategory = require("../models/SubCategory");
const Category = require("../models/Category");
const Product = require("../models/Product");

// Create subcategory
const createSubCategory = async (req, res) => {
    try {
        const { category, subCategoryName } = req.body;

        if (!category || !subCategoryName) {
            return res.status(400).json({
                message: "Category and subcategory name are required"
            });
        }

        // Check whether category exists
        const categoryExists = await Category.findById(category);

        if (!categoryExists) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        // Check duplicate subcategory under same category
        const existingSubCategory = await SubCategory.findOne({
            category,
            subCategoryName
        });

        if (existingSubCategory) {
            return res.status(409).json({
                message: "Subcategory already exists in this category"
            });
        }

        const subCategory = await SubCategory.create({
            category,
            subCategoryName
        });

        res.status(201).json({
            message: "Subcategory created successfully",
            data: subCategory
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create subcategory",
            error: error.message
        });
    }
};


// Get all subcategories
const getSubCategories = async (req, res) => {
    try {
        const subCategories = await SubCategory.find()
            .populate("category", "categoryName")
            .sort({ createdAt: -1 });

        res.status(200).json({
            data: subCategories
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch subcategories",
            error: error.message
        });
    }
};


// Get subcategory by ID
const getSubCategoryById = async (req, res) => {
    try {
        const subCategory = await SubCategory.findById(req.params.id)
            .populate("category", "categoryName");

        if (!subCategory) {
            return res.status(404).json({
                message: "Subcategory not found"
            });
        }

        res.status(200).json({
            data: subCategory
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch subcategory",
            error: error.message
        });
    }
};


// Update subcategory
const updateSubCategory = async (req, res) => {
    try {
        const { category, subCategoryName } = req.body;

        if (!category || !subCategoryName) {
            return res.status(400).json({
                message: "Category and subcategory name are required"
            });
        }

        const categoryExists = await Category.findById(category);

        if (!categoryExists) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        const subCategory = await SubCategory.findByIdAndUpdate(
            req.params.id,
            {
                category,
                subCategoryName
            },
            {
                new: true,
                runValidators: true
            }
        ).populate("category", "categoryName");

        if (!subCategory) {
            return res.status(404).json({
                message: "Subcategory not found"
            });
        }

        res.status(200).json({
            message: "Subcategory updated successfully",
            data: subCategory
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update subcategory",
            error: error.message
        });
    }
};


// Delete subcategory
const deleteSubCategory = async (req, res) => {
    try {
        const productExists = await Product.findOne({
            subCategory: req.params.id
        });

        if (productExists) {
            return res.status(400).json({
                message:
                    "Cannot delete subcategory because it has products"
            });
        }

        const subCategory = await SubCategory.findByIdAndDelete(
            req.params.id
        );

        if (!subCategory) {
            return res.status(404).json({
                message: "Subcategory not found"
            });
        }

        res.status(200).json({
            message: "Subcategory deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete subcategory",
            error: error.message
        });
    }
};

module.exports = {
    createSubCategory,
    getSubCategories,
    getSubCategoryById,
    updateSubCategory,
    deleteSubCategory
};