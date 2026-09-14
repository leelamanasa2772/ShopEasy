const ordersContainer =
    document.getElementById("orders-container");


// ===============================
// Get Logged-in User
// ===============================

const user =
    JSON.parse(localStorage.getItem("user"));


// ===============================
// Check if User is Logged In
// ===============================

if (!user) {

    ordersContainer.innerHTML = `
        <h3>Please login to view your orders.</h3>

        <a href="login.html">
            Login
        </a>
    `;

} else {

    loadOrders();

}


// ===============================
// Load Orders
// ===============================

async function loadOrders() {

    try {

        const response =
            await fetch(
                "http://localhost:5000/orders/" + user.email
            );


        const data =
            await response.json();


        if (!response.ok) {

            ordersContainer.innerHTML =
                "<p>Unable to load orders.</p>";

            return;
        }


        // ===============================
        // No Orders
        // ===============================

        if (data.length === 0) {

            ordersContainer.innerHTML = `
                <h3>No orders yet 🛒</h3>

                <a href="product.html">
                    Start Shopping
                </a>
            `;

            return;
        }


        // ===============================
        // Display Orders
        // ===============================

        ordersContainer.innerHTML = "";


        data.forEach((order) => {

            const orderBox =
                document.createElement("div");

            orderBox.className =
                "order-box";


            let productsHTML = "";


            order.products.forEach((product) => {

                productsHTML += `
                    <div class="order-product">

                        <p>
                            <strong>
                                ${product.name}
                            </strong>
                        </p>

                        <p>
                            Price: ₹${product.price}
                        </p>

                        <p>
                            Quantity: ${product.quantity}
                        </p>

                    </div>
                `;

            });


            orderBox.innerHTML = `

                <h3>
                    Order
                </h3>

                ${productsHTML}

                <h3>
                    Total: ₹${order.totalAmount}
                </h3>

                <p>
                    Order Date:
                    ${new Date(order.orderDate).toLocaleString()}
                </p>

            `;


            ordersContainer.appendChild(orderBox);

        });


    } catch (error) {

        console.log(error);

        ordersContainer.innerHTML = `
            <p>
                Cannot connect to the server.
            </p>
        `;

    }

}


// ===============================
// Display Logged-in User
// ===============================

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
// Update Cart Count
// ===============================

function updateCartCount() {

    let cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    const cartCount =
        document.getElementById("cart-count");


    if (cartCount) {

        let totalItems = 0;


        cart.forEach((product) => {

            totalItems +=
                product.quantity || 1;

        });


        cartCount.textContent =
            totalItems;

    }

}


updateCartCount();