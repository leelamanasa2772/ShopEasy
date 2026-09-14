let products = [];

const productContainer =
    document.getElementById("product-container");

const searchInput =
    document.getElementById("search-input");

const categoryFilter =
    document.getElementById("category-filter");

const productForm =
    document.getElementById("product-form");


// Get products from MongoDB
async function getProducts() {

    try {

        const response =
            await fetch("http://localhost:5000/products");

        products =
            await response.json();

        displayProducts(products);

    } catch (error) {

        console.log(error);

        productContainer.innerHTML =
            "<h3>Unable to load products.</h3>";
    }
}


// Display products
function displayProducts(productList) {

    productContainer.innerHTML = "";

    if (productList.length === 0) {

        productContainer.innerHTML =
            "<h3>No products found 😔</h3>";

        return;
    }

    productList.forEach(product => {

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

        productContainer.appendChild(productCard);
    });
}


// Search and category filter
function filterProducts() {

    const searchText =
        searchInput.value.toLowerCase();

    const selectedCategory =
        categoryFilter.value;

    const filteredProducts =
        products.filter(product => {

            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(searchText);

            const matchesCategory =
                selectedCategory === "all" ||
                product.category === selectedCategory;

            return matchesSearch &&
                   matchesCategory;
        });

    displayProducts(filteredProducts);
}


searchInput.addEventListener(
    "input",
    filterProducts
);

categoryFilter.addEventListener(
    "change",
    filterProducts
);


// Add Product
productForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();

        const name =
            document.getElementById(
                "product-name"
            ).value;

        const price =
            document.getElementById(
                "product-price"
            ).value;

        const category =
            document.getElementById(
                "product-category"
            ).value;

        const image =
            document.getElementById(
                "product-image"
            ).value;

        const description =
            document.getElementById(
                "product-description"
            ).value;


        try {

            const response =
                await fetch(
                    "http://localhost:5000/products",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            name: name,

                            price: Number(price),

                            category: category,

                            image: image,

                            description: description
                        })
                    }
                );


            const data =
                await response.json();


            if (response.ok) {

                alert(
                    "Product added successfully! 🎉"
                );

                productForm.reset();

                getProducts();

            } else {

                alert(data.message);
            }

        } catch (error) {

            console.log(error);

            alert(
                "Cannot connect to the server."
            );
        }
    }
);


// Add to Cart
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


// Cart count
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
// Load products
getProducts();

updateCartCount();