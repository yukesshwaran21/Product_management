import { useEffect, useState } from "react";
import api from "../services/api";
import { useToast } from "../components/Toast";

function SubCategory() {
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);

    const [category, setCategory] = useState("");
    const [subCategoryName, setSubCategoryName] = useState("");

    const [editId, setEditId] = useState(null);
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

    useEffect(() => {
        fetchCategories();
        fetchSubCategories();
    }, []);

    // Create / Update
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!category || !subCategoryName.trim()) {
            showToast(
                "Category and subcategory name are required",
                "warning"
            );
            return;
        }

        try {
            if (editId) {
                await api.put(`/subcategories/${editId}`, {
                    category,
                    subCategoryName
                });

                showToast("Subcategory updated successfully");
            } else {
                await api.post("/subcategories", {
                    category,
                    subCategoryName
                });

                showToast("Subcategory created successfully");
            }

            setCategory("");
            setSubCategoryName("");
            setEditId(null);

            fetchSubCategories();

        } catch (error) {
            showToast(
                error.response?.data?.message ||
                "Something went wrong",
                "error"
            );
        }
    };

    // Edit
    const handleEdit = (subCategory) => {
        setEditId(subCategory._id);

        // category is populated by backend
        setCategory(subCategory.category._id);

        setSubCategoryName(
            subCategory.subCategoryName
        );
    };

    // Delete
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this subcategory?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await api.delete(`/subcategories/${id}`);

            showToast("Subcategory deleted successfully");

            fetchSubCategories();

        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to delete subcategory"
            );
        }
    };

    // Cancel edit
    const handleCancel = () => {
        setCategory("");
        setSubCategoryName("");
        setEditId(null);
    };

    return (
        <div className="page">

            <h1>Product Subcategory</h1>

            <form
                onSubmit={handleSubmit}
                className="form"
            >

                {/* Category */}
                <select
                    value={category}
                    onChange={(e) =>
                        setCategory(e.target.value)
                    }
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


                {/* Subcategory */}
                <input
                    type="text"
                    placeholder="Enter subcategory name"
                    value={subCategoryName}
                    onChange={(e) =>
                        setSubCategoryName(e.target.value)
                    }
                />


                <button type="submit">
                    {editId
                        ? "Update Subcategory"
                        : "Add Subcategory"}
                </button>


                {editId && (
                    <button
                        type="button"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                )}

            </form>


            {/* Table */}

            <div className="table-container">
                <table>

                <thead>

                    <tr>
                        <th>S.No</th>
                        <th>Category</th>
                        <th>Subcategory</th>
                        <th>Actions</th>
                    </tr>

                </thead>


                <tbody>

                    {subCategories.length === 0 ? (

                        <tr>
                            <td colSpan="4" className="empty-row">
                                No subcategories found
                            </td>
                        </tr>

                    ) : (

                        subCategories.map(
                            (subCategory, index) => (

                                <tr key={subCategory._id}>

                                    <td data-label="S.No">
                                        {index + 1}
                                    </td>

                                    <td data-label="Category">
                                        {
                                            subCategory
                                                .category
                                                ?.categoryName
                                        }
                                    </td>

                                    <td data-label="Subcategory">
                                        {
                                            subCategory
                                                .subCategoryName
                                        }
                                    </td>

                                    <td data-label="Actions">

                                        <button
                                            onClick={() =>
                                                handleEdit(
                                                    subCategory
                                                )
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleDelete(
                                                    subCategory._id
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

export default SubCategory;