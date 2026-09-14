let products = [];

const productContainer =
    document.getElementById("product-container");


// ===============================
// Get Products from MongoDB
// ===============================

async function getProducts() {

    try {

        const response =
            await fetch("http://localhost:5000/products");

        products =
            await response.json();

        displayProducts();

    } catch (error) {

        console.log(error);

        productContainer.innerHTML =
            "<h3>Unable to load products.</h3>";
    }
}


// ===============================
// Display Products
// ===============================

function displayProducts() {

    productContainer.innerHTML = "";

    products.forEach(product => {

        const productCard =
            document.createElement("div");

        productCard.className =
            "product-card";

        productCard.innerHTML = `

            <img
                src="${product.image}"
                alt="${product.name}"
            >

            <h3>
                ${product.name}
            </h3>

            <p>
                ₹${product.price}
            </p>

            <button
                onclick="viewProduct('${product._id}')">
                View Details
            </button>

            <button
                onclick="addToCart('${product._id}')">
                Add to Cart 🛒
            </button>

        `;

        productContainer.appendChild(
            productCard
        );
    });
}


// ===============================
// View Product Details
// ===============================

function viewProduct(id) {

    localStorage.setItem(
        "selectedProduct",
        id
    );

    window.location.href =
        "product-details.html";
}


// ===============================
// Add to Cart
// ===============================

function addToCart(id) {

    let cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    const product =
        products.find(
            product => product._id === id
        );


    if (!product) {
        return;
    }


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


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    updateCartCount();


    alert(
        product.name +
        " added to cart!"
    );
}


// ===============================
// Update Cart Count
// ===============================

function updateCartCount() {

    let cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    const cartCount =
        document.getElementById(
            "cart-count"
        );


    if (cartCount) {

        let totalItems = 0;


        cart.forEach(product => {

            totalItems +=
                product.quantity || 1;

        });


        cartCount.textContent =
            totalItems;
    }
}


// ===============================
// Shop Now Button
// ===============================

function scrollToProducts() {

    document
        .querySelector(
            ".products-section"
        )
        .scrollIntoView({

            behavior: "smooth"

        });
}


// ===============================
// Load Products
// ===============================
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
getProducts();

updateCartCount();