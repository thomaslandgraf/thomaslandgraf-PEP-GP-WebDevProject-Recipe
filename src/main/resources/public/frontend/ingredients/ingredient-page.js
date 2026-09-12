/**
 * This script defines the add, view, and delete operations for Ingredient objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to various DOM elements
 * - addIngredientNameInput
 * - deleteIngredientNameInput
 * - ingredientListContainer
 * - searchInput (optional for future use)
 * - adminLink (if visible conditionally)
 */

let addIngredientNameInput = document.getElementById("add-ingredient-name-input");
let deleteIngredientNameInput = document.getElementById("delete-ingredient-name-input");
let ingredientListContainer = document.getElementById("ingredient-list");
let backLink = document.getElementById("back-link");
let addSubmitButton = document.getElementById("add-ingredient-submit-button");
let deleteSubmitButton = document.getElementById("delete-ingredient-submit-button");

/* 
 * TODO: Attach 'onclick' events to:
 * - "add-ingredient-submit-button" → addIngredient()
 * - "delete-ingredient-submit-button" → deleteIngredient()
 */
addSubmitButton.addEventListener("click", addIngredient);
deleteSubmitButton.addEventListener("click", deleteIngredient);

let ingredients = [];

if(sessionStorage.getItem("auth-token") === null){
    window.location.href = "../login/login-page.html";
} else {
    getIngredients();
}

/*
 * TODO: Create an array to keep track of ingredients
 */



/* 
 * TODO: On page load, call getIngredients()
 */


/**
 * TODO: Add Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from addIngredientNameInput
 * - Validate input is not empty
 * - Send POST request to /ingredients
 * - Include Authorization token from sessionStorage
 * - On success: clear input, call getIngredients() and refreshIngredientList()
 * - On failure: alert the user
 */
async function addIngredient() {
    // Implement add ingredient logic here
    let addIngredientName = addIngredientNameInput.value.trim();

    if(addIngredientName === null || addIngredientName.length === 0){
        alert("Empty Field.");
        return;
    }

    const requestBody = {
        "name": addIngredientName
    };

    const requestOptions = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(requestBody)
    };

    try {
        const response = await fetch(`${BASE_URL}/ingredients`, requestOptions);

        if (response.status === 201) {
            addIngredientNameInput.value = "";
            getIngredients();
        } else {
            alert("Error add a new ingredient.");
        }

    } catch (error) {
        console.error("Error: " + error);
        alert("Error add a new ingredient.");
    }
}


/**
 * TODO: Get Ingredients Function
 * 
 * Requirements:
 * - Fetch all ingredients from backend
 * - Store result in `ingredients` array
 * - Call refreshIngredientList() to display them
 * - On error: alert the user
 */
async function getIngredients() {
    // Implement get ingredients logic here
    const requestOptions = {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
        }
    };
    try {
        const response = await fetch(`${BASE_URL}/ingredients`, requestOptions);

        if (response.status === 200) {
            ingredients = await response.json();
            refreshIngredientList();
        } else {
            alert("Error to load ingredients.")
        }
    } catch (error) {
        console.error("Error: " + error);
        alert("Error to load ingredients.")
    }
}


/**
 * TODO: Delete Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from deleteIngredientNameInput
 * - Search ingredientListContainer's <li> elements for matching name
 * - Determine ID based on index (or other backend logic)
 * - Send DELETE request to /ingredients/{id}
 * - On success: call getIngredients() and refreshIngredientList(), clear input
 * - On failure or not found: alert the user
 */
async function deleteIngredient() {
    // Implement delete ingredient logic here
    let  deleteIngredientName = deleteIngredientNameInput.value.trim();

        if(deleteIngredientName === null || deleteIngredientName.length === 0){
            alert("Empty Field.");
            return;
        }

        let ingredientToDelete = ingredients.find(ingredient => ingredient.name === deleteIngredientName);

        if (!ingredientToDelete) {
            alert("Ingredient not found.");
            return;
        }

        const requestOptions = {
            method: "DELETE",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            },
        };

        try {
            const response = await fetch(`${BASE_URL}/ingredients/${ingredientToDelete.id}`, requestOptions);

            if (response.status === 204) {
                deleteIngredientNameInput.value = "";
                getIngredients();
            } else {
                alert("Error to delete ingredient.");
            }

        } catch (error) {
            console.error("Error: " + error);
            alert("Error to delete ingredient.");
        }
}


/**
 * TODO: Refresh Ingredient List Function
 * 
 * Requirements:
 * - Clear ingredientListContainer
 * - Loop through `ingredients` array
 * - For each ingredient:
 *   - Create <li> and inner <p> with ingredient name
 *   - Append to container
 */
function refreshIngredientList() {
    // Implement ingredient list rendering logic here
    ingredientListContainer.innerHTML = "";
    for (let ingredient of ingredients) {
        let listItem = document.createElement("li");
        let paragraph = document.createElement("p");
        paragraph.textContent = ingredient.name;
        listItem.appendChild(paragraph);
        ingredientListContainer.appendChild(listItem);
    }
}
