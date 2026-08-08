import {
    BrowserRouter,
    Routes,
    Route,
    NavLink
} from "react-router-dom";

import Category from "./pages/Category";
import SubCategory from "./pages/SubCategory";
import Product from "./pages/Product";

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

                    <NavLink
                        to="/categories"
                        className={({ isActive }) =>
                            isActive ? "active" : ""
                        }
                    >
                        Categories
                    </NavLink>

                    <NavLink
                        to="/subcategories"
                        className={({ isActive }) =>
                            isActive ? "active" : ""
                        }
                    >
                        Subcategories
                    </NavLink>

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

                <Route
                    path="/"
                    element={<Category />}
                />

                <Route
                    path="/categories"
                    element={<Category />}
                />

                <Route
                    path="/subcategories"
                    element={<SubCategory />}
                />

                <Route
                    path="/products"
                    element={<Product />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;