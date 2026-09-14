const loginForm =
    document.getElementById("login-form");

loginForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;


    // Check empty fields
    if (email === "" || password === "") {

        alert("Please fill all fields.");

        return;
    }


    try {

        // Send login details to backend
        const response =
            await fetch("http://localhost:5000/login", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })

            });


        const data =
            await response.json();


        // If login is successful
        if (response.ok) {

            alert("Login successful! 🎉");


            // Save user information
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );


            // Go to home page
            window.location.href = "index.html";

        }

        // If login fails
        else {

            alert(data.message);

        }


    } catch (error) {

        console.log(error);

        alert("Cannot connect to the server.");

    }

});