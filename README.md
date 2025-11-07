# Guestara Menu Management Backend

_A Node.js + Express + MongoDB Backend for Category → Subcategory → Item Management_

---

## Overview

This project implements a **menu management system** as part of the **Guestara Internship Assignment (Node.js)**.  
It allows users to manage **Categories**, **Subcategories**, and **Items**, with proper hierarchical relationships and CRUD APIs.

Each Category can have multiple Subcategories,  
and each Subcategory can have multiple Items.

---

## Features

- Create, Read, Update APIs for:
- Categories
- Subcategories (under a specific category)
- Items (under category or subcategory)
- Search items by name (case-insensitive)
- Auto-calculated total amount (`baseAmount - discount`)
- Proper hierarchical structure:

```

Category → Subcategory → Items

```

- Clean error handling and modular structure
- Ready-to-use Postman endpoints

---

## Tech Stack

- **Node.js** (v18+)
- **Express.js** (Routing and Middleware)
- **MongoDB** (Database)
- **Mongoose** (ODM)
- **dotenv, body-parser, cors, morgan** (Helpers)

---

## Folder Structure

```

src/
├── config/
│   └── db.js
├── routes/
│   ├── index.js
│   ├── categoryRoutes.js
│   ├── subCategoryRoutes.js
│   └── itemRoutes.js
├── controllers/
│   ├── categoryController.js
│   ├── subCategoryController.js
│   └── itemController.js
├── models/
│   ├── Category.js
│   ├── Subcategory.js
│   └── Item.js
├── app.js
├── server.js

```

---

## Installation & Setup

### 1️⃣ Clone this repository

```bash
git clone https://github.com/Uttam1119/guestara-backend.git
cd guestara-backend
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Configure environment variables

Create a `.env` file in the root folder and add:

```
MONGO_URI=mongodb://localhost:27017/guestara_menu
PORT=4000
```

> You can also use MongoDB Atlas connection string instead of localhost.

### 4️⃣ Run the application

**For development (with live reload):**

```bash
npm run dev
```

**For production:**

```bash
npm start
```

You should see:

```
Connected to MongoDB
Server running on port 4000
```

---

## API Base URL

```
http://localhost:4000/api
```

---

## API Endpoints

### Categories

| Method | Endpoint                    | Description                                     |
| ------ | --------------------------- | ----------------------------------------------- |
| POST   | `/api/categories`           | Create new category                             |
| GET    | `/api/categories`           | Get all categories (with subcategories & items) |
| GET    | `/api/categories/:idOrName` | Get category by ID or name                      |
| PUT    | `/api/categories/:id`       | Update category                                 |

### Subcategories

| Method | Endpoint                                  | Description                        |
| ------ | ----------------------------------------- | ---------------------------------- |
| POST   | `/api/subcategories/category/:categoryId` | Create subcategory under category  |
| GET    | `/api/subcategories`                      | Get all subcategories (with items) |
| GET    | `/api/subcategories/category/:categoryId` | Get subcategories of a category    |
| GET    | `/api/subcategories/:idOrName`            | Get subcategory by ID or name      |
| PUT    | `/api/subcategories/:id`                  | Update subcategory                 |

### Items

| Method | Endpoint                                | Description                                       |
| ------ | --------------------------------------- | ------------------------------------------------- |
| POST   | `/api/items/category/:categoryId`       | Create item under category (optional subcategory) |
| GET    | `/api/items`                            | Get all items                                     |
| GET    | `/api/items/category/:categoryId`       | Get all items of a category                       |
| GET    | `/api/items/subcategory/:subcategoryId` | Get all items of a subcategory                    |
| GET    | `/api/items/:idOrName`                  | Get item by ID or name                            |
| PUT    | `/api/items/:id`                        | Update item                                       |
| GET    | `/api/items/search?q=<term>`            | Search items by name                              |

---

## Example API Workflow (via Postman)

1. **Create Category**

   ```http
   POST /api/categories
   {
     "name": "Beverages",
     "description": "All types of drinks",
     "taxApplicable": true,
     "tax": 5,
     "taxType": "percentage"
   }
   ```

2. **Create Subcategory**

   ```http
   POST /api/subcategories/category/<categoryId>
   {
     "name": "Soft Drinks",
     "description": "Soda, cola, etc."
   }
   ```

3. **Create Item**

   ```http
   POST /api/items/category/<categoryId>?subcategoryId=<subcategoryId>
   {
     "name": "Coca-Cola",
     "description": "Cold beverage",
     "baseAmount": 50,
     "discount": 10
   }
   ```

---

## Error Handling

- All errors are handled globally in `app.js`
- Logs full `err.stack` in the console (for developers)
- Sends only safe error message in response

---

## Assignment Questions

**Q1. Which database you have chosen and why?**

> I chose **MongoDB** because it’s schema-flexible and fits hierarchical data (Category → Subcategory → Items) naturally. It also integrates smoothly with Mongoose and Express for rapid development.

**Q2. Three things that you learned from this assignment:**

- Designing clean hierarchical data models in MongoDB
- Building modular Express apps with controllers and routes
- Handling parent-child relationships efficiently in APIs

**Q3. What was the most difficult part of the assignment?**

> Maintaining the correct data hierarchy (ensuring Category contains Subcategories, and Subcategory contains Items) while keeping API responses clean and readable.

**Q4. What would you have done differently given more time?**

> I would add proper request validation (using Zod), add pagination and authentication.

---
