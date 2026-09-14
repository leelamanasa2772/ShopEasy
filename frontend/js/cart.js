let cart =
    JSON.parse(localStorage.getItem("cart")) || [];


// ===============================
// Cart Elements
// ===============================

const cartContainer =
    document.getElementById("cart-container");

const cartTotal =
    document.getElementById("cart-total");

const cartCount =
    document.getElementById("cart-count");


// ===============================
// Display Cart
// ===============================

function displayCart() {

    cartContainer.innerHTML = "";

    let total = 0;
    let totalItems = 0;


    if (cart.length === 0) {

        cartContainer.innerHTML = `
            <div class="empty-cart">

                <h3>Your cart is empty 🛒</h3>

                <a href="index.html">
                    Continue Shopping
                </a>

            </div>
        `;

        cartTotal.textContent = 0;
        cartCount.textContent = 0;

        return;
    }


    cart.forEach((product, index) => {

        // Give old products quantity 1
        if (!product.quantity) {
            product.quantity = 1;
        }


        total += product.price * product.quantity;

        totalItems += product.quantity;


        const cartItem =
            document.createElement("div");

        cartItem.className = "cart-item";


        cartItem.innerHTML = `

            <img src="${product.image}"
                 alt="${product.name}">


            <div class="cart-item-info">

                <h3>
                    ${product.name}
                </h3>

                <p>
                    ₹${product.price}
                </p>


                <div class="quantity-control">

                    <button
                        onclick="decreaseQuantity(${index})">
                        −
                    </button>


                    <span>
                        ${product.quantity}
                    </span>


                    <button
                        onclick="increaseQuantity(${index})">
                        +
                    </button>

                </div>

            </div>


            <button
                onclick="removeFromCart(${index})">

                Remove

            </button>

        `;


        cartContainer.appendChild(cartItem);

    });


    // Save updated cart
    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    cartTotal.textContent = total;

    cartCount.textContent = totalItems;
}


// ===============================
// Increase Quantity
// ===============================

function increaseQuantity(index) {

    cart[index].quantity++;

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    displayCart();
}


// ===============================
// Decrease Quantity
// ===============================

function decreaseQuantity(index) {

    if (cart[index].quantity > 1) {

        cart[index].quantity--;

    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    displayCart();
}


// ===============================
// Remove From Cart
// ===============================

function removeFromCart(index) {

    cart.splice(index, 1);

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    displayCart();
}


// ===============================
// Place Order
// ===============================

async function placeOrder() {

    if (cart.length === 0) {

        alert("Your cart is empty!");

        return;
    }


    // Get logged-in user
    const user =
        JSON.parse(localStorage.getItem("user"));


    if (!user) {

        alert("Please login before placing an order.");

        window.location.href = "login.html";

        return;
    }


    // Calculate total
    let total = 0;

    cart.forEach((product) => {

        total +=
            product.price * product.quantity;

    });


    try {

        const response =
            await fetch("http://localhost:5000/order", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    userEmail: user.email,

                    products: cart.map((product) => ({

                        name: product.name,

                        price: product.price,

                        quantity: product.quantity

                    })),

                    totalAmount: total

                })

            });


        const data =
            await response.json();


        if (response.ok) {

            alert(
                "Order placed successfully! 🎉"
            );


            localStorage.removeItem("cart");

            cart = [];

            displayCart();

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
// Display Cart
// ===============================

displayCart();