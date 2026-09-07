/**
 * This script defines the registration functionality for the Registration page in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to various DOM elements
 * - usernameInput, emailInput, passwordInput, repeatPasswordInput, registerButton
 */

let usernameInput = document.getElementById("username-input");
let emailInput = document.getElementById("email-input");
let passwordInput = document.getElementById("password-input");
let repeatPasswordInput = document.getElementById("repeat-password-input");
let registerButton = document.getElementById("register-button");


/* 
 * TODO: Ensure the register button calls processRegistration when clicked
 */
registerButton.onclick = processRegistration;

/**
 * TODO: Process Registration Function
 * 
 * Requirements:
 * - Retrieve username, email, password, and repeat password from input fields
 * - Validate all fields are filled
 * - Check that password and repeat password match
 * - Create a request body with username, email, and password
 * - Define requestOptions using method POST and proper headers
 * 
 * Fetch Logic:
 * - Send POST request to `${BASE_URL}/register`
 * - If status is 201:
 *      - Redirect user to login page
 * - If status is 409:
 *      - Alert that user/email already exists
 * - Otherwise:
 *      - Alert generic registration error
 * 
 * Error Handling:
 * - Wrap in try/catch
 * - Log error and alert user
 */
async function processRegistration() {
    
    let username = usernameInput.value;
    let email = emailInput.value;
    let password = passwordInput.value;
    let repeatPassword = repeatPasswordInput.value;

    if(hasEmptyFields(username, email, password, repeatPassword)){
        alert("Empty Field.");
        return;
    }

    if(password !== repeatPassword){
        alert("Passwords doesn't match.");
        return;
    }

    const registerBody = {username: username,
        email: email,
        password: password
    };

    const requestOptions = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(registerBody)
    };

    try {
        const response = await fetch(`${BASE_URL}/register`, requestOptions);
        if(response.status === 201){
            window.location.href = "../login/login-page.html";
        } else if (response.status === 409){
            alert("user/email already exists.");
        } else {
            alert("An error occurred with this registration.");
        }
    }
    catch (error) {
        console.error("Registration error:", error);
        alert("An error occurred with this registration.");
    }
}

function hasEmptyFields(username, email, password, repeatPassword){
    let emptyOrNull = false;
    if(username == null || username.length == 0 ||
        email == null || email.length == 0 || 
        password == null || password.length == 0 ||
        repeatPassword == null || repeatPassword.length == 0){
            emptyOrNull = true;
    }
    return emptyOrNull;    
}
