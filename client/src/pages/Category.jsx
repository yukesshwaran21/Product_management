import { useEffect, useState } from "react";
import api from "../services/api";
import { useToast } from "../components/Toast";

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

                showToast("Category updated successfully");
            } else {
                await api.post("/categories", {
                    categoryName
                });

                showToast("Category created successfully");
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

            showToast("Category deleted successfully");

            fetchCategories();

        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to delete category"
            );
        }
    };

    const handleCancel = () => {
        setCategoryName("");
        setEditId(null);
    };

    return (
        <div className="page">

            <h1>Category Master</h1>

            <form onSubmit={handleSubmit} className="form">

                <input
                    type="text"
                    placeholder="Enter category name"
                    value={categoryName}
                    onChange={(e) =>
                        setCategoryName(e.target.value)
                    }
                />

                <button type="submit">
                    {editId ? "Update Category" : "Add Category"}
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

            <table>

                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Category Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>

                    {categories.length === 0 ? (
                        <tr>
                            <td colSpan="3">
                                No categories found
                            </td>
                        </tr>
                    ) : (
                        categories.map((category, index) => (
                            <tr key={category._id}>

                                <td>{index + 1}</td>

                                <td>
                                    {category.categoryName}
                                </td>

                                <td>

                                    <button
                                        onClick={() =>
                                            handleEdit(category)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(category._id)
                                        }
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>
                        ))
                    )}

                </tbody>

            </table>

        </div>
    );
}

export default Category;