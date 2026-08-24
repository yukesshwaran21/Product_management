import { useEffect, useState } from "react";
import api from "../services/api";
import { useToast } from "../components/Toast";
import "./Product.css";

function EditIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="product-action-icon"
        >
            <path
                d="M12 20h9"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />

            <path
                d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function DeleteIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="product-action-icon"
        >
            <path
                d="M3 6h18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />

            <path
                d="M8 6V4h8v2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />

            <path
                d="M19 6l-1 14H6L5 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
            />

            <path
                d="M10 11v5M14 11v5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}


function Product() {

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);

    const [productName, setProductName] = useState("");
    const [productCode, setProductCode] = useState("");
    const [category, setCategory] = useState("");
    const [subCategory, setSubCategory] = useState("");
    const [brand, setBrand] = useState("");
    const [mrp, setMrp] = useState("");
    const [price, setPrice] = useState("");
    const [productFile, setProductFile] = useState(null);

    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(true);

    const { showToast } = useToast();


    // =====================================================
    // FETCH CATEGORIES
    // =====================================================

    const fetchCategories = async () => {

        try {

            const res = await api.get("/categories");

            setCategories(res.data.data);

        } catch (error) {

            console.log(error);

        }
    };


    // =====================================================
    // FETCH SUBCATEGORIES
    // =====================================================

    const fetchSubCategories = async () => {

        try {

            const res = await api.get("/subcategories");

            setSubCategories(res.data.data);

        } catch (error) {

            console.log(error);

        }
    };


    // =====================================================
    // FETCH PRODUCTS
    // =====================================================

    const fetchProducts = async () => {

        try {

            setLoading(true);

            const res = await api.get("/products");

            setProducts(res.data.data);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        fetchCategories();
        fetchSubCategories();
        fetchProducts();

    }, []);


    // =====================================================
    // CATEGORY CHANGE
    // =====================================================

    const handleCategoryChange = (e) => {

        const selectedCategory = e.target.value;

        setCategory(selectedCategory);

        // Reset subcategory when category changes
        setSubCategory("");
    };


    // =====================================================
    // CREATE / UPDATE PRODUCT
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        if (
            !productName.trim() ||
            !productCode.trim() ||
            !category ||
            !subCategory ||
            !brand.trim() ||
            mrp === "" ||
            price === ""
        ) {

            showToast(
                "Please fill in all product fields",
                "warning"
            );

            return;
        }


        if (Number(price) > Number(mrp)) {

            showToast(
                "Price cannot be greater than MRP",
                "warning"
            );

            return;
        }


        try {

            const data = {
                productName,
                productCode,
                category,
                subCategory,
                brand,
                mrp: Number(mrp),
                price: Number(price)
            };


            if (editId) {

                await api.put(
                    `/products/${editId}`,
                    data
                );

                showToast(
                    "Product updated successfully"
                );

            } else {

                await api.post(
                    "/products",
                    data
                );

                showToast(
                    "Product created successfully"
                );
            }


            clearForm();

            fetchProducts();

        } catch (error) {

            showToast(
                error.response?.data?.message ||
                "Something went wrong",
                "error"
            );
        }
    };


    // =====================================================
    // EDIT PRODUCT
    // =====================================================

    const handleEdit = (product) => {

        setEditId(product._id);

        setProductName(
            product.productName
        );

        setProductCode(
            product.productCode
        );

        setCategory(
            product.category?._id || ""
        );

        setSubCategory(
            product.subCategory?._id || ""
        );

        setBrand(
            product.brand
        );

        setMrp(
            product.mrp
        );

        setPrice(
            product.price
        );

        setProductFile(null);
    };


    // =====================================================
    // DELETE PRODUCT
    // =====================================================

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmDelete) {
            return;
        }


        try {

            await api.delete(
                `/products/${id}`
            );

            showToast(
                "Product deleted successfully"
            );

            fetchProducts();

        } catch (error) {

            showToast(
                error.response?.data?.message ||
                "Failed to delete product",
                "error"
            );
        }
    };


    // =====================================================
    // CLEAR FORM
    // =====================================================

    const clearForm = () => {

        setProductName("");
        setProductCode("");
        setCategory("");
        setSubCategory("");
        setBrand("");
        setMrp("");
        setPrice("");
        setProductFile(null);


        const fileInput =
            document.getElementById(
                "product-file"
            );

        if (fileInput) {
            fileInput.value = "";
        }


        setEditId(null);
    };


    // =====================================================
    // FILTER SUBCATEGORIES
    // =====================================================

    const filteredSubCategories =
        subCategories.filter(
            (sub) =>
                sub.category?._id === category
        );


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="product-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="product-header">

                <h1>
                    Products Master
                </h1>

                <p>
                    Manage your products, pricing and product details
                </p>

            </div>


            {/* =================================================
                PRODUCT FORM
            ================================================= */}

            <form
                onSubmit={handleSubmit}
                className="product-form-page"
            >


                {/* Product Name */}

                <div className="product-form-group">

                    <label>
                        Product Name
                    </label>

                    <input
                        type="text"
                        placeholder="Enter product name"
                        value={productName}
                        onChange={(e) =>
                            setProductName(
                                e.target.value
                            )
                        }
                    />

                </div>


                {/* Product Code */}

                <div className="product-form-group">

                    <label>
                        Product Code
                    </label>

                    <input
                        type="text"
                        placeholder="Enter product code"
                        value={productCode}
                        onChange={(e) =>
                            setProductCode(
                                e.target.value
                            )
                        }
                    />

                </div>


                {/* Category */}

                <div className="product-form-group">

                    <label>
                        Category
                    </label>

                    <select
                        value={category}
                        onChange={
                            handleCategoryChange
                        }
                    >

                        <option value="">
                            Select Category
                        </option>

                        {categories.map(
                            (cat) => (

                                <option
                                    key={cat._id}
                                    value={cat._id}
                                >
                                    {
                                        cat.categoryName
                                    }
                                </option>

                            )
                        )}

                    </select>

                </div>


                {/* Subcategory */}

                <div className="product-form-group">

                    <label>
                        Subcategory
                    </label>

                    <select
                        value={subCategory}
                        onChange={(e) =>
                            setSubCategory(
                                e.target.value
                            )
                        }
                        disabled={!category}
                    >

                        <option value="">

                            {category
                                ? "Select Subcategory"
                                : "Select Category First"}

                        </option>

                        {filteredSubCategories.map(
                            (sub) => (

                                <option
                                    key={sub._id}
                                    value={sub._id}
                                >
                                    {
                                        sub.subCategoryName
                                    }
                                </option>

                            )
                        )}

                    </select>

                </div>


                {/* Brand */}

                <div className="product-form-group">

                    <label>
                        Brand
                    </label>

                    <input
                        type="text"
                        placeholder="Enter brand"
                        value={brand}
                        onChange={(e) =>
                            setBrand(
                                e.target.value
                            )
                        }
                    />

                </div>


                {/* MRP */}

                <div className="product-form-group">

                    <label>
                        MRP
                    </label>

                    <input
                        type="number"
                        placeholder="Enter MRP"
                        value={mrp}
                        onChange={(e) =>
                            setMrp(
                                e.target.value
                            )
                        }
                        min="0"
                    />

                </div>


                {/* Price */}

                <div className="product-form-group">

                    <label>
                        Price
                    </label>

                    <input
                        type="number"
                        placeholder="Enter price"
                        value={price}
                        onChange={(e) =>
                            setPrice(
                                e.target.value
                            )
                        }
                        min="0"
                    />

                </div>


                {/* Product File */}

                <div className="product-form-group product-file-group">

                    <label htmlFor="product-file">
                        Product File
                    </label>

                    <input
                        id="product-file"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) =>
                            setProductFile(
                                e.target.files[0] ||
                                null
                            )
                        }
                    />

                    {productFile && (

                        <small className="product-file-name">
                            {productFile.name}
                        </small>

                    )}

                </div>


                {/* Form Buttons */}

                <div className="product-form-actions">

                    <button
                        type="submit"
                        className="product-submit-button"
                    >
                        {editId
                            ? "Update Product"
                            : "Add Product"}
                    </button>


                    {editId && (

                        <button
                            type="button"
                            onClick={clearForm}
                            className="product-cancel-button"
                        >
                            Cancel
                        </button>

                    )}

                </div>

            </form>


            {/* =================================================
                PRODUCT TABLE
            ================================================= */}

            <div className="product-table-wrapper">

                <table className="product-table">

                    <thead>

                        <tr>

                            <th className="product-serial">
                                S.NO
                            </th>

                            <th>
                                PRODUCT
                            </th>

                            <th>
                                CODE
                            </th>

                            <th>
                                CATEGORY
                            </th>

                            <th>
                                SUBCATEGORY
                            </th>

                            <th>
                                BRAND
                            </th>

                            <th>
                                MRP
                            </th>

                            <th>
                                PRICE
                            </th>

                            <th className="product-actions-heading">
                                ACTIONS
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {products.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="9"
                                    className="product-empty"
                                >

                                    {loading
                                        ? "Loading products..."
                                        : "No products found"}

                                </td>

                            </tr>

                        ) : (

                            products.map(
                                (product, index) => (

                                    <tr
                                        key={product._id}
                                    >


                                        {/* S.NO */}

                                        <td
                                            data-label="S.No"
                                            className="product-serial"
                                        >
                                            {index + 1}
                                        </td>


                                        {/* PRODUCT */}

                                        <td data-label="Product">
                                            {
                                                product.productName
                                            }
                                        </td>


                                        {/* CODE */}

                                        <td data-label="Code">
                                            {
                                                product.productCode
                                            }
                                        </td>


                                        {/* CATEGORY */}

                                        <td data-label="Category">
                                            {
                                                product.category
                                                    ?.categoryName
                                            }
                                        </td>


                                        {/* SUBCATEGORY */}

                                        <td data-label="Subcategory">
                                            {
                                                product.subCategory
                                                    ?.subCategoryName
                                            }
                                        </td>


                                        {/* BRAND */}

                                        <td data-label="Brand">
                                            {
                                                product.brand
                                            }
                                        </td>


                                        {/* MRP */}

                                        <td data-label="MRP">
                                            ₹{product.mrp}
                                        </td>


                                        {/* PRICE */}

                                        <td data-label="Price">
                                            ₹{product.price}
                                        </td>


                                        {/* ACTIONS */}

                                        <td
                                            data-label="Actions"
                                            className="product-actions"
                                        >

                                            <button
                                                type="button"
                                                className="product-icon-button product-edit-button"
                                                onClick={() =>
                                                    handleEdit(
                                                        product
                                                    )
                                                }
                                                title="Edit product"
                                                aria-label={`Edit ${product.productName}`}
                                            >

                                                <EditIcon />

                                            </button>


                                            <button
                                                type="button"
                                                className="product-icon-button product-delete-button"
                                                onClick={() =>
                                                    handleDelete(
                                                        product._id
                                                    )
                                                }
                                                title="Delete product"
                                                aria-label={`Delete ${product.productName}`}
                                            >

                                                <DeleteIcon />

                                            </button>

                                        </td>

                                    </tr>

                                )
                            )

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default Product;