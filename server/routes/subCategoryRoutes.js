const express = require("express");

const {
    createSubCategory,
    getSubCategories,
    getSubCategoryById,
    updateSubCategory,
    deleteSubCategory
} = require("../controllers/subCategoryController");

const router = express.Router();

router.post("/", createSubCategory);

router.get("/", getSubCategories);

router.get("/:id", getSubCategoryById);

router.put("/:id", updateSubCategory);

router.delete("/:id", deleteSubCategory);

module.exports = router;