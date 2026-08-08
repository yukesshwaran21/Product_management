import { useEffect, useState } from "react";
import api from "../services/api";
import { useToast } from "../components/Toast";

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

    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const res = await api.get("/categories");
            setCategories(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    // Fetch subcategories
    const fetchSubCategories = async () => {
        try {
            const res = await api.get("/subcategories");
            setSubCategories(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    // Fetch products
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

    useEffect(() => {
        fetchCategories();
        fetchSubCategories();
        fetchProducts();
    }, []);

    // Category change
    const handleCategoryChange = (e) => {
        const selectedCategory = e.target.value;

        setCategory(selectedCategory);

        // Reset subcategory when category changes
        setSubCategory("");
    };

    // Create / Update product
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
                await api.put(`/products/${editId}`, data);

                showToast("Product updated successfully");
            } else {
                await api.post("/products", data);

                showToast("Product created successfully");
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

    // Edit product
    const handleEdit = (product) => {
        setEditId(product._id);

        setProductName(product.productName);
        setProductCode(product.productCode);

        setCategory(product.category._id);
        setSubCategory(product.subCategory._id);

        setBrand(product.brand);
        setMrp(product.mrp);
        setPrice(product.price);
    };

    // Delete product
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await api.delete(`/products/${id}`);

            showToast("Product deleted successfully");

            fetchProducts();

        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to delete product"
            );
        }
    };

    // Clear form
    const clearForm = () => {
        setProductName("");
        setProductCode("");
        setCategory("");
        setSubCategory("");
        setBrand("");
        setMrp("");
        setPrice("");
        setEditId(null);
    };

    // Filter subcategories by category
    const filteredSubCategories = subCategories.filter(
        (sub) =>
            sub.category?._id === category
    );

    return (
        <div className="page">

            <h1>Products Master</h1>

            <form
                onSubmit={handleSubmit}
                className="product-form"
            >

                {/* Product Name */}
                <div className="form-group">
                    <label>Product Name</label>

                    <input
                        type="text"
                        placeholder="Enter product name"
                        value={productName}
                        onChange={(e) =>
                            setProductName(e.target.value)
                        }
                    />
                </div>


                {/* Product Code */}
                <div className="form-group">
                    <label>Product Code</label>

                    <input
                        type="text"
                        placeholder="Enter product code"
                        value={productCode}
                        onChange={(e) =>
                            setProductCode(e.target.value)
                        }
                    />
                </div>


                {/* Category */}
                <div className="form-group">
                    <label>Category</label>

                    <select
                        value={category}
                        onChange={handleCategoryChange}
                    >
                        <option value="">
                            Select Category
                        </option>

                        {categories.map((cat) => (
                            <option
                                key={cat._id}
                                value={cat._id}
                            >
                                {cat.categoryName}
                            </option>
                        ))}
                    </select>
                </div>


                {/* Subcategory */}
                <div className="form-group">
                    <label>Subcategory</label>

                    <select
                        value={subCategory}
                        onChange={(e) =>
                            setSubCategory(e.target.value)
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
                                    {sub.subCategoryName}
                                </option>
                            )
                        )}
                    </select>
                </div>


                {/* Brand */}
                <div className="form-group">
                    <label>Brand</label>

                    <input
                        type="text"
                        placeholder="Enter brand"
                        value={brand}
                        onChange={(e) =>
                            setBrand(e.target.value)
                        }
                    />
                </div>


                {/* MRP */}
                <div className="form-group">
                    <label>MRP</label>

                    <input
                        type="number"
                        placeholder="Enter MRP"
                        value={mrp}
                        onChange={(e) =>
                            setMrp(e.target.value)
                        }
                        min="0"
                    />
                </div>


                {/* Price */}
                <div className="form-group">
                    <label>Price</label>

                    <input
                        type="number"
                        placeholder="Enter price"
                        value={price}
                        onChange={(e) =>
                            setPrice(e.target.value)
                        }
                        min="0"
                    />
                </div>


                <div className="form-buttons">

                    <button type="submit">
                        {editId
                            ? "Update Product"
                            : "Add Product"}
                    </button>

                    {editId && (
                        <button
                            type="button"
                            onClick={clearForm}
                        >
                            Cancel
                        </button>
                    )}

                </div>

            </form>


            {/* Product Table */}

            <div className="table-container">

                <table>

                    <thead>

                        <tr>
                            <th>S.No</th>
                            <th>Product</th>
                            <th>Code</th>
                            <th>Category</th>
                            <th>Subcategory</th>
                            <th>Brand</th>
                            <th>MRP</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>

                    </thead>


                    <tbody>

                        {products.length === 0 ? (

                            <tr>
                                <td colSpan="9">
                                    No products found
                                </td>
                            </tr>

                        ) : (

                            products.map(
                                (product, index) => (

                                    <tr key={product._id}>

                                        <td>
                                            {index + 1}
                                        </td>

                                        <td>
                                            {product.productName}
                                        </td>

                                        <td>
                                            {product.productCode}
                                        </td>

                                        <td>
                                            {
                                                product.category
                                                    ?.categoryName
                                            }
                                        </td>

                                        <td>
                                            {
                                                product.subCategory
                                                    ?.subCategoryName
                                            }
                                        </td>

                                        <td>
                                            {product.brand}
                                        </td>

                                        <td>
                                            ₹{product.mrp}
                                        </td>

                                        <td>
                                            ₹{product.price}
                                        </td>

                                        <td>

                                            <button
                                                onClick={() =>
                                                    handleEdit(
                                                        product
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        product._id
                                                    )
                                                }
                                            >
                                                Delete
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