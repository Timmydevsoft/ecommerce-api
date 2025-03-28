# eCommerce API  

## Overview  
This is a RESTful API for an eCommerce platform built using Node.js, Express, and MongoDB. The API provides endpoints for managing products, users, and orders, enabling a complete online shopping experience.  

## Features  
- User authentication and authorization  
- Product management (CRUD operations)  
- Shopping cart functionality  
- Order processing and management  
- Payment integration (if applicable)  
- Responsive and scalable architecture  

## Technologies Used  
- **Node.js**: JavaScript runtime for building the server  
- **Express**: Web framework for Node.js  
- **MongoDB**: NoSQL database for storing data  
- **Mongoose**: ODM for MongoDB and Node.js  
- **JWT**: For user authentication  
- **Nodemon**: For development to automatically restart the server  

## Installation  
```bash
git clone https://github.com/Timmdevsoft/ecommerce-api.git  
cd ecommerce-api  
npm install  
```

## Set up environment variable 
```PORT=YOUR_PREFERRED_PORT  
MONGODB_URI=mongodb://your_mongo_db_uri  
SECRET_KEY=your_jwt_secret  
REFRESH_KEY=YOUR_REFRESH_TOKEN_KEY
```

## Project Structure

```
/ecommerce-api  
│  
├── index.js  
├── package.json  
│  
├── config  
│   └── db.config.js  
│  
├── controller  
│   ├── auth.controller.js  
│   ├── product.controller.js  
│   ├── cart.controller.js  
│   ├── user.controller.js  
│   ├── order.controller.js  
│   └── categories.controller.js  
│  
├── model  
│   ├── order.model.js  
│   ├── product.model.js  
│   ├── category.model.js  
│   ├── cart.model.js  
│   └── user.model.js  
│  
├── middleware  
│   ├── auth.middleware.js  
│   └── err.middleware.js  
│  
└── route  
    ├── user.route.js  
    ├── product.route.js  
    ├── auth.route.js  
    ├── category.route.js  
    ├── order.route.js  
    └── cart.route.js  
```

# API Documentation

## Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/admin/register` | Register a new admin |
| `PUT` | `/api/promote/:id` | Upgrade user account (admin only) |

## Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/signin` | Sign in a user |
| `GET` | `/api/refresh` | Refresh token (requires valid cookie) |

## Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/cart` | Add item to cart (requires access) |
| `GET` | `/api/cart` | Get cart items (requires access) |
| `PUT` | `/api/cart/:action` | Update item quantity in cart (requires access) |
| `DELETE` | `/api/cart/clear` | Clear the cart (requires access) |
| `DELETE` | `/api/cart/:productId` | Remove item from cart (requires access) |
| `GET` | `/api/cart/:id` | Get cart by ID (admin only) |

## Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/category` | Add a new category (admin only) |
| `GET` | `/api/category` | Get all categories |
| `PUT` | `/api/category` | Update category (admin only) |
| `DELETE` | `/api/category` | Delete category (admin only) |

## Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/order/:cartId` | Place an order (requires access) |
| `GET` | `/api/order/:customerId` | Get all orders for a user (requires access) |
| `GET` | `/api/order/single/:id` | Get order by ID (requires access) |
| `GET` | `/api/order` | View all orders (admin only) |
| `PUT` | `/api/order/:id/:status` | Update order status (requires access) |

## Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/product` | Get all products |
| `GET` | `/api/product/category/:value` | Get products by category |
| `GET` | `/api/product/:id` | Get product by ID |
| `POST` | `/api/product` | Add a new product (admin only) |
| `PUT` | `/api/product/:id` | Update product (admin only) |
| `DELETE` | `/api/product/:id` | Delete product (admin only) |

## Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/user` | Create a new user account |
| `PUT` | `/api/user/:id` | Update user account (requires access) |
| `DELETE` | `/api/user/:id` | Delete user account (requires access) |
  

# Set up Guide
 npm start  
 http://localhost:3000 (or your specified port)  

## Setup Guide  
1. Install dependencies  
   ```bash
   npm install
   ```
2.  set the environment variable
```
PORT=YOUR_PREFERRED_PORT  
MONGODB_URI=mongodb://your_mongo_db_uri  
SECRET_KEY=your_jwt_secret  
REFRESH_KEY=YOUR_REFRESH_TOKEN_KEY  
```
3. npm start  
4. http://localhost:(your specified port)

   


