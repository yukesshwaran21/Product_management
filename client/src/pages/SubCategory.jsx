import { useEffect, useState } from "react";
import api from "../services/api";
import { useToast } from "../components/Toast";
import "./SubCategory.css";

function EditIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="subcategory-action-icon"
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
            className="subcategory-action-icon"
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

function SubCategory() {

    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);

    const [category, setCategory] = useState("");
    const [subCategoryName, setSubCategoryName] = useState("");

    const [editId, setEditId] = useState(null);

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


    useEffect(() => {

        fetchCategories();
        fetchSubCategories();

    }, []);


    // =====================================================
    // CREATE / UPDATE
    // =====================================================

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

                await api.put(
                    `/subcategories/${editId}`,
                    {
                        category,
                        subCategoryName
                    }
                );

                showToast(
                    "Subcategory updated successfully"
                );

            } else {

                await api.post(
                    "/subcategories",
                    {
                        category,
                        subCategoryName
                    }
                );

                showToast(
                    "Subcategory created successfully"
                );
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


    // =====================================================
    // EDIT
    // =====================================================

    const handleEdit = (subCategory) => {

        setEditId(subCategory._id);

        setCategory(
            subCategory.category._id
        );

        setSubCategoryName(
            subCategory.subCategoryName
        );
    };


    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this subcategory?"
        );

        if (!confirmDelete) {
            return;
        }


        try {

            await api.delete(
                `/subcategories/${id}`
            );

            showToast(
                "Subcategory deleted successfully"
            );

            fetchSubCategories();

        } catch (error) {

            showToast(
                error.response?.data?.message ||
                "Failed to delete subcategory",
                "error"
            );
        }
    };


    // =====================================================
    // CANCEL EDIT
    // =====================================================

    const handleCancel = () => {

        setCategory("");
        setSubCategoryName("");
        setEditId(null);
    };


    return (
        <div className="subcategory-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="subcategory-header">

                <h1>
                    Product Subcategory
                </h1>

            </div>


            {/* =================================================
                FORM
            ================================================= */}

            <form
                onSubmit={handleSubmit}
                className="subcategory-form"
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


                {/* Submit */}

                <button
                    type="submit"
                    className="subcategory-submit"
                >
                    {editId
                        ? "Update Subcategory"
                        : "Add Subcategory"}
                </button>


                {/* Cancel */}

                {editId && (

                    <button
                        type="button"
                        onClick={handleCancel}
                        className="subcategory-cancel"
                    >
                        Cancel
                    </button>

                )}

            </form>


            {/* =================================================
                TABLE
            ================================================= */}

            <div className="subcategory-table-wrapper">

                <table className="subcategory-table">

                    <thead>

                        <tr>

                            <th className="subcategory-serial">
                                S.NO
                            </th>

                            <th>
                                CATEGORY
                            </th>

                            <th>
                                SUBCATEGORY
                            </th>

                            <th className="subcategory-actions-heading">
                                ACTIONS
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {subCategories.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="4"
                                    className="subcategory-empty"
                                >
                                    No subcategories found
                                </td>

                            </tr>

                        ) : (

                            subCategories.map(
                                (subCategory, index) => (

                                    <tr
                                        key={subCategory._id}
                                    >

                                        {/* S.NO */}

                                        <td
                                            data-label="S.No"
                                            className="subcategory-serial"
                                        >
                                            {index + 1}
                                        </td>


                                        {/* CATEGORY */}

                                        <td
                                            data-label="Category"
                                            className="subcategory-category-name"
                                        >
                                            {
                                                subCategory
                                                    .category
                                                    ?.categoryName
                                            }
                                        </td>


                                        {/* SUBCATEGORY */}

                                        <td
                                            data-label="Subcategory"
                                            className="subcategory-name"
                                        >
                                            {
                                                subCategory
                                                    .subCategoryName
                                            }
                                        </td>


                                        {/* ACTIONS */}

                                        <td
                                            data-label="Actions"
                                            className="subcategory-actions"
                                        >

                                            {/* EDIT */}

                                            <button
                                                type="button"
                                                className="subcategory-icon-button subcategory-edit-button"
                                                onClick={() =>
                                                    handleEdit(
                                                        subCategory
                                                    )
                                                }
                                                title="Edit subcategory"
                                                aria-label={`Edit ${subCategory.subCategoryName}`}
                                            >

                                                <EditIcon />

                                            </button>


                                            {/* DELETE */}

                                            <button
                                                type="button"
                                                className="subcategory-icon-button subcategory-delete-button"
                                                onClick={() =>
                                                    handleDelete(
                                                        subCategory._id
                                                    )
                                                }
                                                title="Delete subcategory"
                                                aria-label={`Delete ${subCategory.subCategoryName}`}
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

export default SubCategory;