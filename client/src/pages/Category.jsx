import { useEffect, useState } from "react";
import api from "../services/api";
import { useToast } from "../components/Toast";
import "./Category.css";

function EditIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="action-icon"
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
            className="action-icon"
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

function Category() {
    const [categoryName, setCategoryName] = useState("");
    const [categories, setCategories] = useState([]);
    const [editId, setEditId] = useState(null);

    const { showToast } = useToast();

    const fetchCategories = async () => {
        try {
            const res = await api.get("/categories");

            setCategories(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!categoryName.trim()) {
            showToast(
                "Category name is required",
                "warning"
            );

            return;
        }

        try {
            if (editId) {
                await api.put(`/categories/${editId}`, {
                    categoryName
                });

                showToast(
                    "Category updated successfully"
                );
            } else {
                await api.post("/categories", {
                    categoryName
                });

                showToast(
                    "Category created successfully"
                );
            }

            setCategoryName("");
            setEditId(null);

            fetchCategories();

        } catch (error) {
            showToast(
                error.response?.data?.message ||
                "Something went wrong",
                "error"
            );
        }
    };

    const handleEdit = (category) => {
        setCategoryName(category.categoryName);
        setEditId(category._id);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this category?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await api.delete(`/categories/${id}`);

            showToast(
                "Category deleted successfully"
            );

            fetchCategories();

        } catch (error) {
            showToast(
                error.response?.data?.message ||
                "Failed to delete category",
                "error"
            );
        }
    };

    const handleCancel = () => {
        setCategoryName("");
        setEditId(null);
    };

    return (
        <div className="category-page">

            {/* Page Header */}
            <div className="category-header">
                <h1>Category Master</h1>
            </div>


            {/* Category Form */}
            <form
                onSubmit={handleSubmit}
                className="category-form"
            >

                <input
                    type="text"
                    placeholder="Enter category name"
                    value={categoryName}
                    onChange={(e) =>
                        setCategoryName(e.target.value)
                    }
                />

                <button
                    type="submit"
                    className="category-submit"
                >
                    {editId
                        ? "Update Category"
                        : "Add Category"}
                </button>

                {editId && (
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="category-cancel"
                    >
                        Cancel
                    </button>
                )}

            </form>


            {/* Category Table */}
            <div className="category-table-wrapper">

                <table className="category-table">

                    <thead>
                        <tr>
                            <th className="serial-column">
                                S.NO
                            </th>

                            <th>
                                CATEGORY NAME
                            </th>

                            <th className="actions-column">
                                ACTIONS
                            </th>
                        </tr>
                    </thead>

                    <tbody>

                        {categories.length === 0 ? (

                            <tr>
                                <td
                                    colSpan="3"
                                    className="category-empty"
                                >
                                    No categories found
                                </td>
                            </tr>

                        ) : (

                            categories.map(
                                (category, index) => (

                                    <tr
                                        key={category._id}
                                    >

                                        <td
                                            data-label="S.No"
                                            className="serial-column"
                                        >
                                            {index + 1}
                                        </td>


                                        <td
                                            data-label="Category"
                                            className="category-name-cell"
                                        >
                                            {category.categoryName}
                                        </td>


                                        <td
                                            data-label="Actions"
                                            className="category-actions"
                                        >

                                            {/* Edit */}
                                            <button
                                                type="button"
                                                className="icon-button edit-button"
                                                onClick={() =>
                                                    handleEdit(category)
                                                }
                                                title="Edit category"
                                                aria-label={`Edit ${category.categoryName}`}
                                            >
                                                <EditIcon />
                                            </button>


                                            {/* Delete */}
                                            <button
                                                type="button"
                                                className="icon-button delete-button"
                                                onClick={() =>
                                                    handleDelete(
                                                        category._id
                                                    )
                                                }
                                                title="Delete category"
                                                aria-label={`Delete ${category.categoryName}`}
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

export default Category;