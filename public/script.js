document.addEventListener("DOMContentLoaded", function () {
    const loginContainer = document.getElementById("login-container");
    const registerContainer = document.getElementById("register-container");
    const showRegister = document.getElementById("show-register");
    const showLogin = document.getElementById("show-login");
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");

    showRegister.addEventListener("click", function () {
        loginContainer.classList.add("hidden");
        registerContainer.classList.remove("hidden");
    });

    showLogin.addEventListener("click", function () {
        registerContainer.classList.add("hidden");
        loginContainer.classList.remove("hidden");
    });

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;
        
        try {
            const response = await fetch("/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.error || `HTTP error! Status: ${response.status}`);
            }
    
            console.log("Login Success:", data);
            alert(data.message || "Logged in successfully!");
    
            // Store token, userId, and isAdmin status in localStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", data.userId);  // ✅ Store user ID
            localStorage.setItem("isAdmin", JSON.stringify(data.isAdmin));
    
            // Redirect based on user type
            window.location.href = data.isAdmin ? "admin.html" : "home.html";
    
        } catch (error) {
            console.error("Error logging in:", error);
            alert(error.message || "Login failed. Check your credentials and try again.");
        }
    });
    
    

    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const firstname = document.getElementById("register-name-first").value;
        const lastname = document.getElementById("register-name-last").value;
        const email = document.getElementById("register-email").value;
        const phonenumber = document.getElementById("register-phone-number").value;
        const password = document.getElementById("register-password").value;
        const confirmpassword = document.getElementById("register-confirm-password").value;
        if (password!=confirmpassword){
            alert("Password and confirm password must be same!");
        }else{
            try {
                const response = await fetch("/auth/register", {  // Corrected endpoint
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        firstname, 
                        lastname,
                        email,
                        phonenumber,
                        password
                    })  // Corrected JSON format
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                console.log("Registration Success:", data);
                alert(data.message || "Registered successfully!");
            } catch (error) {
                console.error("Error registering:", error);
                alert("Registration failed. Try again.");
            }
        }
    });
});
