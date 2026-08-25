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
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            if (loading) setLoading(true);
            else setIsRefreshing(true);
            
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
            setIsRefreshing(false);
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
            <div className="dashboard-page dashboard-animated">
                <div className="dashboard-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading dashboard metrics...</p>
                </div>
            </div>
        );
    }

    /* =========================
       ERROR
    ========================= */

    if (error) {
        return (
            <div className="dashboard-page dashboard-animated">
                <div className="dashboard-header animate-fade-down">
                    <div>
                        <h1>Dashboard</h1>
                        <p>Overview of your product management system</p>
                    </div>
                </div>

                <div className="dashboard-error animate-fade-up">
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
        <div className="dashboard-page dashboard-animated">

            {/* =========================
                HEADER
            ========================= */}

            <div className="dashboard-header animate-fade-down">
                <div>
                    <h1>Dashboard</h1>
                    <p>Overview of your product management system</p>
                </div>

                <button
                    className={`refresh-button ${isRefreshing ? "refreshing" : ""}`}
                    onClick={fetchDashboardData}
                    disabled={isRefreshing}
                >
                    <span className="refresh-icon">↻</span> Refresh
                </button>
            </div>


            {/* =========================
                STAT CARDS
            ========================= */}

            <div className="dashboard-stats">

                <div className="stat-card animate-fade-up delay-1">
                    <div className="stat-icon category-icon">
                        C
                    </div>
                    <div className="stat-content">
                        <span>Total Categories</span>
                        <strong>{totalCategories}</strong>
                        <small>Product categories</small>
                    </div>
                </div>

                <div className="stat-card animate-fade-up delay-2">
                    <div className="stat-icon subcategory-icon">
                        S
                    </div>
                    <div className="stat-content">
                        <span>Total Subcategories</span>
                        <strong>{totalSubCategories}</strong>
                        <small>Organized under categories</small>
                    </div>
                </div>

                <div className="stat-card animate-fade-up delay-3">
                    <div className="stat-icon product-icon">
                        P
                    </div>
                    <div className="stat-content">
                        <span>Total Products</span>
                        <strong>{totalProducts}</strong>
                        <small>Products in catalog</small>
                    </div>
                </div>

                <div className="stat-card animate-fade-up delay-4">
                    <div className="stat-icon brand-icon">
                        B
                    </div>
                    <div className="stat-content">
                        <span>Total Brands</span>
                        <strong>{totalBrands}</strong>
                        <small>Unique product brands</small>
                    </div>
                </div>

            </div>


            {/* =========================
                MIDDLE SECTION
            ========================= */}

            <div className="dashboard-grid">

                {/* CATEGORY OVERVIEW */}
                <div className="dashboard-card category-overview animate-fade-up delay-5">
                    <div className="card-header">
                        <div>
                            <h2>Category Overview</h2>
                            <p>Products by category</p>
                        </div>
                        <Link to="/categories" className="card-link-action">
                            View All →
                        </Link>
                    </div>

                    <div className="category-list">
                        {sortedCategoryStats.length === 0 ? (
                            <div className="dashboard-empty">
                                No category data available
                            </div>
                        ) : (
                            sortedCategoryStats.map((category) => (
                                <div
                                    className="category-stat"
                                    key={category.id}
                                >
                                    <div className="category-stat-info">
                                        <span>{category.name}</span>
                                        <strong>{category.count}</strong>
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
                            ))
                        )}
                    </div>
                </div>


                {/* QUICK ACTIONS */}
                <div className="dashboard-card quick-actions animate-fade-up delay-6">
                    <div className="card-header">
                        <div>
                            <h2>Quick Actions</h2>
                            <p>Manage your catalog</p>
                        </div>
                    </div>

                    <div className="quick-action-list">
                        <Link
                            to="/categories"
                            className="quick-action"
                        >
                            <span className="quick-action-icon">+</span>
                            <span>
                                <strong>Add Category</strong>
                                <small>Create a new category</small>
                            </span>
                            <span className="arrow">→</span>
                        </Link>

                        <Link
                            to="/subcategories"
                            className="quick-action"
                        >
                            <span className="quick-action-icon">+</span>
                            <span>
                                <strong>Add Subcategory</strong>
                                <small>Add under a category</small>
                            </span>
                            <span className="arrow">→</span>
                        </Link>

                        <Link
                            to="/products"
                            className="quick-action"
                        >
                            <span className="quick-action-icon">+</span>
                            <span>
                                <strong>Add Product</strong>
                                <small>Add a new product</small>
                            </span>
                            <span className="arrow">→</span>
                        </Link>
                    </div>
                </div>

            </div>


            {/* =========================
                RECENT PRODUCTS
            ========================= */}

            <div className="dashboard-card recent-products animate-fade-up delay-7">
                <div className="card-header">
                    <div>
                        <h2>Recent Products</h2>
                        <p>Recently added products</p>
                    </div>
                    <Link to="/products" className="card-link-action">
                        View All →
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
                                {recentProducts.map((product) => (
                                    <tr key={product._id} className="table-row-item">
                                        <td>
                                            <strong>
                                                {product.productName}
                                            </strong>
                                        </td>
                                        <td>
                                            <span className="product-code-pill">
                                                {product.productCode}
                                            </span>
                                        </td>
                                        <td>
                                            {product.category
                                                ?.categoryName || "-"}
                                        </td>
                                        <td>
                                            {product.brand || "-"}
                                        </td>
                                        <td className="product-price">
                                            ₹{product.price}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

        </div>
    );
}

export default Dashboard;