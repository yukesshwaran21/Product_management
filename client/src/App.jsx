import {
    BrowserRouter,
    Routes,
    Route,
    NavLink,
    Navigate
} from "react-router-dom";

import Category from "./pages/Category";
import SubCategory from "./pages/SubCategory";
import Product from "./pages/Product";
import Dashboard from "./pages/Dashboard";

function App() {
    return (
        <BrowserRouter>

            <nav>
                <div className="brand">
                    <div className="brand-logo">
                        PM
                    </div>

                    <div>
                        <h2>Product Manager</h2>
                    </div>
                </div>

                <div className="nav-links">

                    {/* Dashboard */}
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            isActive ? "active" : ""
                        }
                    >
                        Dashboard
                    </NavLink>

                    {/* Categories */}
                    <NavLink
                        to="/categories"
                        className={({ isActive }) =>
                            isActive ? "active" : ""
                        }
                    >
                        Categories
                    </NavLink>

                    {/* Subcategories */}
                    <NavLink
                        to="/subcategories"
                        className={({ isActive }) =>
                            isActive ? "active" : ""
                        }
                    >
                        Subcategories
                    </NavLink>

                    {/* Products */}
                    <NavLink
                        to="/products"
                        className={({ isActive }) =>
                            isActive ? "active" : ""
                        }
                    >
                        Products
                    </NavLink>

                </div>
            </nav>

            <Routes>

                {/* Redirect root to Dashboard */}
                <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                />

                {/* Dashboard */}
                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                {/* Category */}
                <Route
                    path="/categories"
                    element={<Category />}
                />

                {/* Subcategory */}
                <Route
                    path="/subcategories"
                    element={<SubCategory />}
                />

                {/* Product */}
                <Route
                    path="/products"
                    element={<Product />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;