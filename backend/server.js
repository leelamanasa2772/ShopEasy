const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const User = require("./models/user");
const Order = require("./models/order");
const Product = require("./models/products.js");

const app = express();


// ===============================
// Middleware
// ===============================

app.use(cors());
app.use(express.json());


// ===============================
// MongoDB Connection
// ===============================

mongoose.connect(process.env.MONGO_URI)

    .then(async () => {

        console.log("MongoDB connected successfully!");


        // ===============================
        // Default Products
        // ===============================

        const defaultProducts = [

            {
                name: "Wireless Headphones",
                price: 1499,
                category: "electronics",
                image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
                description: "High quality wireless headphones."
            },

            {
                name: "Smart Watch",
                price: 2499,
                category: "electronics",
                image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
                description: "Modern smart watch with useful features."
            },

            {
                name: "Running Shoes",
                price: 1999,
                category: "fashion",
                image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
                description: "Comfortable running shoes for everyday use."
            },

            {
                name: "Backpack",
                price: 999,
                category: "accessories",
                image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
                description: "Durable backpack for everyday use."
            }

        ];


        // Add default products only if they don't already exist

        for (const product of defaultProducts) {

            const existingProduct =
                await Product.findOne({
                    name: product.name
                });


            if (!existingProduct) {

                await Product.create(product);

                console.log(
                    product.name +
                    " added to database"
                );

            }

        }

    })

    .catch((error) => {

        console.log(
            "MongoDB connection failed:",
            error
        );

    });


// ===============================
// Home / Test Route
// ===============================

app.get("/", (req, res) => {

    res.send(
        "ShopEasy Backend is Running!"
    );

});


// ===============================
// Register API
// ===============================

app.post("/register", async (req, res) => {

    try {

        const {
            name,
            email,
            password
        } = req.body;


        // Check if user already exists

        const existingUser =
            await User.findOne({
                email: email
            });


        if (existingUser) {

            return res.status(400).json({

                message:
                    "User already exists"

            });

        }


        // Create new user

        const newUser =
            new User({

                name: name,

                email: email,

                password: password

            });


        // Save user

        await newUser.save();


        res.status(201).json({

            message:
                "Registration successful"

        });

    }

    catch (error) {

        res.status(500).json({

            message:
                "Registration failed",

            error:
                error.message

        });

    }

});


// ===============================
// Login API
// ===============================

app.post("/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        // Find user

        const user =
            await User.findOne({
                email: email
            });


        // User not found

        if (!user) {

            return res.status(400).json({

                message:
                    "User not found"

            });

        }


        // Check password

        if (user.password !== password) {

            return res.status(400).json({

                message:
                    "Incorrect password"

            });

        }


        // Login successful

        res.status(200).json({

            message:
                "Login successful",

            user: {

                name:
                    user.name,

                email:
                    user.email

            }

        });

    }

    catch (error) {

        res.status(500).json({

            message:
                "Login failed",

            error:
                error.message

        });

    }

});


// ===============================
// Place Order API
// ===============================

app.post("/order", async (req, res) => {

    try {

        const {
            userEmail,
            products,
            totalAmount
        } = req.body;


        const newOrder =
            new Order({

                userEmail:
                    userEmail,

                products:
                    products,

                totalAmount:
                    totalAmount

            });


        await newOrder.save();


        res.status(201).json({

            message:
                "Order placed successfully!",

            order:
                newOrder

        });

    }

    catch (error) {

        res.status(500).json({

            message:
                "Order failed",

            error:
                error.message

        });

    }

});


// ===============================
// Get User Orders API
// ===============================

app.get("/orders/:email", async (req, res) => {

    try {

        const email =
            req.params.email;


        const orders =
            await Order.find({

                userEmail:
                    email

            }).sort({

                orderDate:
                    -1

            });


        res.status(200).json(
            orders
        );

    }

    catch (error) {

        res.status(500).json({

            message:
                "Failed to get orders",

            error:
                error.message

        });

    }

});


// ===============================
// Add Product API
// ===============================

app.post("/products", async (req, res) => {

    try {

        const {
            name,
            price,
            category,
            image,
            description
        } = req.body;


        const newProduct =
            new Product({

                name:
                    name,

                price:
                    price,

                category:
                    category,

                image:
                    image,

                description:
                    description

            });


        await newProduct.save();


        res.status(201).json({

            message:
                "Product added successfully!",

            product:
                newProduct

        });

    }

    catch (error) {

        res.status(500).json({

            message:
                "Failed to add product",

            error:
                error.message

        });

    }

});


// ===============================
// Get All Products API
// ===============================

app.get("/products", async (req, res) => {

    try {

        const products =
            await Product.find();


        res.status(200).json(
            products
        );

    }

    catch (error) {

        res.status(500).json({

            message:
                "Failed to get products",

            error:
                error.message

        });

    }

});


// ===============================
// Start Server
// ===============================

const PORT = 5000;


app.listen(PORT, () => {

    console.log(
        `Server running on http://localhost:${PORT}`
    );

});