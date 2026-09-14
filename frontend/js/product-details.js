// ===============================
// Get Selected Product ID
// ===============================

const id =
    localStorage.getItem("selectedProduct");

const container =
    document.getElementById(
        "product-details-container"
    );


// ===============================
// Get Product From MongoDB
// ===============================

async function getProduct() {

    try {

        const response =
            await fetch(
                "http://localhost:5000/products"
            );

        const products =
            await response.json();


        const product =
            products.find(
                item => item._id === id
            );


        // ===============================
        // Display Product Details
        // ===============================

        if (product) {

            container.innerHTML = `

                <div class="product-detail-card">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >

                    <div class="product-info">

                        <h2>
                            ${product.name}
                        </h2>

                        <h3>
                            ₹${product.price}
                        </h3>

                        <p>
                            ${product.description}
                        </p>

                        <button
                            onclick="addToCart('${product._id}')">

                            Add to Cart 🛒

                        </button>

                        <br><br>

                        <a href="product.html">
                            ← Back to Products
                        </a>

                    </div>

                </div>

            `;

        } else {

            container.innerHTML =
                "<h3>Product not found.</h3>";

        }

    } catch (error) {

        console.log(error);

        container.innerHTML =
            "<h3>Unable to load product.</h3>";

    }
}


// ===============================
// Add To Cart
// ===============================

async function addToCart(id) {

    try {

        const response =
            await fetch(
                "http://localhost:5000/products"
            );

        const products =
            await response.json();


        const product =
            products.find(
                item => item._id === id
            );


        if (!product) {
            return;
        }


        let cart =
            JSON.parse(
                localStorage.getItem("cart")
            ) || [];


        // Check if product already exists

        const existingProduct =
            cart.find(
                item => item._id === id
            );


        if (existingProduct) {

            existingProduct.quantity++;

        } else {

            cart.push({

                ...product,

                quantity: 1

            });

        }


        // Save cart

        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );


        updateCartCount();


        alert(
            product.name +
            " added to cart!"
        );


    } catch (error) {

        console.log(error);

        alert(
            "Unable to add product to cart."
        );

    }
}


// ===============================
// Update Cart Count
// ===============================

function updateCartCount() {

    let cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    const count =
        document.getElementById(
            "cart-count"
        );


    if (count) {

        let totalItems = 0;


        cart.forEach(product => {

            totalItems +=
                product.quantity || 1;

        });


        count.textContent =
            totalItems;

    }
}
// ===============================
// Display Logged-in User
// ===============================

const user =
    JSON.parse(localStorage.getItem("user"));

const userName =
    document.getElementById("user-name");

if (user && userName) {
    userName.textContent =
        "Hi, " + user.name + " 👋";
}

// ===============================
// Logout
// ===============================

const logoutBtn =
    document.getElementById("logout-btn");

if (logoutBtn) {
    logoutBtn.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            localStorage.removeItem("user");

            alert(
                "Logged out successfully!"
            );

            window.location.href =
                "welcome.html";
        }
    );
}

// ===============================
// Page Load
// ===============================

getProduct();

updateCartCount();