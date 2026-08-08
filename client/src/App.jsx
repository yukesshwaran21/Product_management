import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Category from "./pages/Category";
import SubCategory from "./pages/SubCategory";
import Product from "./pages/Product";

function App() {
    return (
        <BrowserRouter>

            <nav>
                <h2>Product Management</h2>

                <div>
                    <Link to="/categories">Categories</Link>
                    <Link to="/subcategories">Subcategories</Link>
                    <Link to="/products">Products</Link>
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