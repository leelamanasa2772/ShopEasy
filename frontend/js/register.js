const registerForm =
    document.getElementById("register-form");


registerForm.addEventListener("submit", async function(event) {

    event.preventDefault();


    const name =
        document.getElementById("name").value;

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;

    const confirmPassword =
        document.getElementById("confirm-password").value;


    // Check passwords

    if (password !== confirmPassword) {

        alert("Passwords do not match!");

        return;
    }


    try {

        const response =
            await fetch("http://localhost:5000/register", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                })

            });


        const data =
            await response.json();


        if (response.ok) {

            alert("Registration successful! 🎉");

            window.location.href =
                "login.html";

        } else {

            alert(data.message);

        }


    } catch (error) {

        console.log(error);

        alert(
            "Cannot connect to the server."
        );

    }

});