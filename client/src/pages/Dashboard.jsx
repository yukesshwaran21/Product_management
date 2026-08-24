import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./Dashboard.css";

function Dashboard() {
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                categoriesResponse,
                subCategoriesResponse,
                productsResponse
            ] = await Promise.all([
                api.get("/categories"),
                api.get("/subcategories"),
                api.get("/products")
            ]);

            setCategories(categoriesResponse.data.data || []);
            setSubCategories(subCategoriesResponse.data.data || []);
            setProducts(productsResponse.data.data || []);

        } catch (error) {
            console.error("Dashboard error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load dashboard data"
            );
        } finally {
            setLoading(false);
        }
    };

    /* =========================
       STATISTICS
    ========================= */

    const totalCategories = categories.length;

    const totalSubCategories = subCategories.length;

    const totalProducts = products.length;

    const totalBrands = new Set(
        products
            .map((product) => product.brand?.trim())
            .filter(Boolean)
    ).size;

    /* =========================
       CATEGORY PRODUCT COUNT
    ========================= */

    const categoryStats = categories.map((category) => {
        const count = products.filter(
            (product) =>
                product.category?._id === category._id
        ).length;

        return {
            id: category._id,
            name: category.categoryName,
            count
        };
    });

    const sortedCategoryStats = [...categoryStats]
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    const maxCategoryCount =
        Math.max(
            ...sortedCategoryStats.map(
                (category) => category.count
            ),
            1
        );

    /* =========================
       RECENT PRODUCTS
    ========================= */

    const recentProducts = [...products]
        .sort(
            (a, b) =>
                new Date(b.createdAt || 0) -
                new Date(a.createdAt || 0)
        )
        .slice(0, 5);

    /* =========================
       LOADING
    ========================= */

    if (loading) {
        return (
            <div className="dashboard-page">
                <div className="dashboard-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    /* =========================
       ERROR
    ========================= */

    if (error) {
        return (
            <div className="dashboard-page">
                <div className="dashboard-header">
                    <div>
                        <h1>Dashboard</h1>
                        <p>
                            Overview of your product management system
                        </p>
                    </div>
                </div>

                <div className="dashboard-error">
                    <div className="error-icon">!</div>

                    <div>
                        <h3>Unable to load dashboard</h3>
                        <p>{error}</p>
                    </div>

                    <button
                        onClick={fetchDashboardData}
                        className="retry-button"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="dashboard-header">

                <div>
                    <h1>Dashboard</h1>

                    <p>
                        Overview of your product management system
                    </p>
                </div>

                <button
                    className="refresh-button"
                    onClick={fetchDashboardData}
                >
                    ↻ Refresh
                </button>

            </div>


            {/* =========================
                STAT CARDS
            ========================= */}

            <div className="dashboard-stats">

                <div className="stat-card">

                    <div className="stat-icon category-icon">
                        C
                    </div>

                    <div className="stat-content">
                        <span>Total Categories</span>

                        <strong>
                            {totalCategories}
                        </strong>

                        <small>
                            Product categories
                        </small>
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-icon subcategory-icon">
                        S
                    </div>

                    <div className="stat-content">
                        <span>Total Subcategories</span>

                        <strong>
                            {totalSubCategories}
                        </strong>

                        <small>
                            Organized under categories
                        </small>
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-icon product-icon">
                        P
                    </div>

                    <div className="stat-content">
                        <span>Total Products</span>

                        <strong>
                            {totalProducts}
                        </strong>

                        <small>
                            Products in catalog
                        </small>
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-icon brand-icon">
                        B
                    </div>

                    <div className="stat-content">
                        <span>Total Brands</span>

                        <strong>
                            {totalBrands}
                        </strong>

                        <small>
                            Unique product brands
                        </small>
                    </div>

                </div>

            </div>


            {/* =========================
                MIDDLE SECTION
            ========================= */}

            <div className="dashboard-grid">

                {/* CATEGORY OVERVIEW */}

                <div className="dashboard-card category-overview">

                    <div className="card-header">

                        <div>
                            <h2>Category Overview</h2>

                            <p>
                                Products by category
                            </p>
                        </div>

                        <Link to="/categories">
                            View All
                        </Link>

                    </div>


                    <div className="category-list">

                        {sortedCategoryStats.length === 0 ? (

                            <div className="dashboard-empty">
                                No category data available
                            </div>

                        ) : (

                            sortedCategoryStats.map(
                                (category) => (

                                    <div
                                        className="category-stat"
                                        key={category.id}
                                    >

                                        <div className="category-stat-info">

                                            <span>
                                                {category.name}
                                            </span>

                                            <strong>
                                                {category.count}
                                            </strong>

                                        </div>

                                        <div className="progress-bar">

                                            <div
                                                className="progress-fill"
                                                style={{
                                                    width: `${
                                                        (category.count /
                                                            maxCategoryCount) *
                                                        100
                                                    }%`
                                                }}
                                            ></div>

                                        </div>

                                    </div>

                                )
                            )

                        )}

                    </div>

                </div>


                {/* QUICK ACTIONS */}

                <div className="dashboard-card quick-actions">

                    <div className="card-header">

                        <div>
                            <h2>Quick Actions</h2>

                            <p>
                                Manage your catalog
                            </p>
                        </div>

                    </div>


                    <div className="quick-action-list">

                        <Link
                            to="/categories"
                            className="quick-action"
                        >
                            <span className="quick-action-icon">
                                +
                            </span>

                            <span>
                                <strong>
                                    Add Category
                                </strong>

                                <small>
                                    Create a new category
                                </small>
                            </span>

                            <span className="arrow">
                                →
                            </span>
                        </Link>


                        <Link
                            to="/subcategories"
                            className="quick-action"
                        >
                            <span className="quick-action-icon">
                                +
                            </span>

                            <span>
                                <strong>
                                    Add Subcategory
                                </strong>

                                <small>
                                    Add under a category
                                </small>
                            </span>

                            <span className="arrow">
                                →
                            </span>
                        </Link>


                        <Link
                            to="/products"
                            className="quick-action"
                        >
                            <span className="quick-action-icon">
                                +
                            </span>

                            <span>
                                <strong>
                                    Add Product
                                </strong>

                                <small>
                                    Add a new product
                                </small>
                            </span>

                            <span className="arrow">
                                →
                            </span>
                        </Link>

                    </div>

                </div>

            </div>


            {/* =========================
                RECENT PRODUCTS
            ========================= */}

            <div className="dashboard-card recent-products">

                <div className="card-header">

                    <div>
                        <h2>Recent Products</h2>

                        <p>
                            Recently added products
                        </p>
                    </div>

                    <Link to="/products">
                        View All
                    </Link>

                </div>


                {recentProducts.length === 0 ? (

                    <div className="dashboard-empty">
                        No products available
                    </div>

                ) : (

                    <div className="recent-table-container">

                        <table className="recent-table">

                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Code</th>
                                    <th>Category</th>
                                    <th>Brand</th>
                                    <th>Price</th>
                                </tr>
                            </thead>

                            <tbody>

                                {recentProducts.map(
                                    (product) => (

                                        <tr key={product._id}>

                                            <td>
                                                <strong>
                                                    {product.productName}
                                                </strong>
                                            </td>

                                            <td>
                                                {product.productCode}
                                            </td>

                                            <td>
                                                {product.category
                                                    ?.categoryName ||
                                                    "-"}
                                            </td>

                                            <td>
                                                {product.brand || "-"}
                                            </td>

                                            <td>
                                                ₹{product.price}
                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            {/* =========================
                SYSTEM STATUS
            ========================= */}

            <div className="dashboard-status">

                <div className="status-indicator"></div>

                <div>
                    <strong>
                        System Connected
                    </strong>

                    <span>
                        Dashboard is connected to the Product Management API
                    </span>
                </div>

            </div>

        </div>
    );
}

export default Dashboard;