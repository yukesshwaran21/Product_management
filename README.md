# Product Management System

The application provides CRUD operations for managing:

- Product Categories
- Product Subcategories
- Products

It also maintains relationships between Categories, Subcategories, and Products using MongoDB references.

---

## Live Application

https://product-management-one-sable.vercel.app/

---

## Features

### Category Master

Manage product categories with complete CRUD functionality.

- Add a new category
- View all categories
- Update an existing category
- Delete a category

### Subcategory Master

Manage subcategories associated with their respective categories.

- Add a new subcategory
- Select a category while creating a subcategory
- View all subcategories
- Update a subcategory
- Delete a subcategory
- Category is maintained using a MongoDB reference

### Product Master

Manage product details with category and subcategory relationships.

Each product contains:

- Product Name
- Product Code
- Category
- Subcategory
- Brand
- MRP
- Price

Available operations:

- Add product
- View products
- Update product
- Delete product

---

## Tech Stack

### Frontend

- React.js
- JavaScript
- HTML5
- CSS3
- Axios
- React Router

### Backend

- Node.js
- Express.js
- JavaScript
- Mongoose
- REST API

### Database

- MongoDB
- MongoDB Atlas

### Deployment

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas
