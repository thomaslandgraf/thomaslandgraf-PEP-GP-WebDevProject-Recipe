/**
 * This script defines the CRUD operations for Recipe objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

let recipes = [];

// Wait for DOM to fully load before accessing elements
window.addEventListener("DOMContentLoaded", () => {

    /* 
     * TODO: Get references to various DOM elements
     * - Recipe name and instructions fields (add, update, delete)
     * - Recipe list container
     * - Admin link and logout button
     * - Search input
     */
    let searchRecipeName = document.getElementById("search-input");
    let searchButton = document.getElementById("search-button");
    let recipeList = document.getElementById("recipe-list");
    let addRecipeName = document.getElementById("add-recipe-name-input");
    let recipeInstructions = document.getElementById("add-recipe-instructions-input");
    let addRecipeButton = document.getElementById("add-recipe-submit-input");
    let updateRecipeName = document.getElementById("update-recipe-name-input");
    let updateRecipeInstructions = document.getElementById("update-recipe-instructions-input");
    let updateRecipeButton = document.getElementById("update-recipe-submit-input");
    let deleteRecipeName = document.getElementById("delete-recipe-name-input");
    let deleteButton = document.getElementById("delete-recipe-submit-input");
    let adminLink = document.getElementById("admin-link");
    let logoutButton = document.getElementById("logout-button");

    /*
     * TODO: Show logout button if auth-token exists in sessionStorage
     */
    if (sessionStorage.getItem("auth-token") !== null) {
        logoutButton.removeAttribute("hidden");
    }

    /*
     * TODO: Show admin link if is-admin flag in sessionStorage is "true"
     */
    if (sessionStorage.getItem("is-admin") === "true") {
        adminLink.removeAttribute("hidden");
    }

    /*
     * TODO: Attach event handlers
     * - Add recipe button → addRecipe()
     * - Update recipe button → updateRecipe()
     * - Delete recipe button → deleteRecipe()
     * - Search button → searchRecipes()
     * - Logout button → processLogout()
     */
    addRecipeButton.addEventListener("click", addRecipe);
    updateRecipeButton.addEventListener("click", updateRecipe);
    deleteButton.addEventListener("click", deleteRecipe);
    searchButton.addEventListener("click", searchRecipes);
    logoutButton.addEventListener("click", processLogout);

    /*
     * TODO: On page load, call getRecipes() to populate the list
     */
    getRecipes();


    /**
     * TODO: Search Recipes Function
     * - Read search term from input field
     * - Send GET request with name query param
     * - Update the recipe list using refreshRecipeList()
     * - Handle fetch errors and alert user
     */
    async function searchRecipes() {
        // Implement search logic here
        let searchTerm = searchRecipeName.value;

        const requestOptions = {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            }
        };

        try {
            const response = await fetch(`${BASE_URL}/recipes?name=${searchTerm}`, requestOptions);

            if (response.status === 200) {
                recipes = await response.json();
                refreshRecipeList();
            } else {
                alert("Error with search recipes.")
            }

        } catch (error) {
            console.error("Error: " + error);
            alert("Error with search recipes.")
        }
    }

    /**
     * TODO: Add Recipe Function
     * - Get values from add form inputs
     * - Validate both name and instructions
     * - Send POST request to /recipes
     * - Use Bearer token from sessionStorage
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function addRecipe() {
        // Implement add logic here
        let recipeName = addRecipeName.value;
        let instructions = recipeInstructions.value;

        if (hasEmptyFields(recipeName, instructions)) {
            alert("Empty fields.");
            return;
        }

        const requestBody = {
            "name": recipeName,
            "instructions": instructions
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
            const response = await fetch(`${BASE_URL}/recipes`, requestOptions);

            if (response.status === 201) {
                addRecipeName.value = "";
                recipeInstructions.value = "";
                getRecipes();
            } else {
                alert("Error add new recipe.");
            }

        } catch (error) {
            console.error("Error: " + error);
            alert("Error add new recipe.");
        }

    }

    /**
     * TODO: Update Recipe Function
     * - Get values from update form inputs
     * - Validate both name and updated instructions
     * - Fetch current recipes to locate the recipe by name
     * - Send PUT request to update it by ID
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function updateRecipe() {
        // Implement update logic here
        let updateName = updateRecipeName.value;
        let updateInstructions = updateRecipeInstructions.value;

        if (hasEmptyFields(updateName, updateInstructions)) {
            alert("Empty fields.");
            return;
        }

        let recipeToUpdate = recipes.find(recipe => recipe.name === updateName);

        if(!recipeToUpdate){
            alert("Recipe not found.");
            return;
        }

         const requestBody = {
            "name": updateName,
            "instructions": updateInstructions
        };

        const requestOptions = {
            method: "PUT",
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
            const response = await fetch(`${BASE_URL}/recipes/${recipeToUpdate.id}`, requestOptions);

            if (response.status === 200) {
                updateRecipeName.value = "";
                updateRecipeInstructions.value = "";
                getRecipes();
            } else {
                alert("Error to update recipe.");
            }

        } catch (error) {
            console.error("Error: " + error);
            alert("Error to update recipe.");
        }
    }

    /**
     * TODO: Delete Recipe Function
     * - Get recipe name from delete input
     * - Find matching recipe in list to get its ID
     * - Send DELETE request using recipe ID
     * - On success: refresh the list
     */
    async function deleteRecipe() {
        // Implement delete logic here
        let  recipeNameToDelete = deleteRecipeName.value;

        if(recipeNameToDelete === null || recipeNameToDelete.length === 0){
            alert("Empty Field.");
            return;
        }

        let recipeToDelete = recipes.find(recipe => recipe.name === recipeNameToDelete);

        if (!recipeToDelete) {
            alert("Recipe not found.");
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
            const response = await fetch(`${BASE_URL}/recipes/${recipeToDelete.id}`, requestOptions);

            if (response.status === 200) {
                deleteRecipeName.value = "";
                getRecipes();
            } else {
                alert("Error to delete recipe.");
            }

        } catch (error) {
            console.error("Error: " + error);
            alert("Error to delete recipe.");
        }
    }

    /**
     * TODO: Get Recipes Function
     * - Fetch all recipes from backend
     * - Store in recipes array
     * - Call refreshRecipeList() to display
     */
    async function getRecipes() {
        // Implement get logic here
        const requestOptions = {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            }
        };
        try {
            const response = await fetch(`${BASE_URL}/recipes`, requestOptions);

            if (response.status === 200) {
                recipes = await response.json();
                refreshRecipeList();
            } else {
                alert("Error to load recipes.")
            }
        } catch (error) {
            console.error("Error: " + error);
            alert("Error to load recipes.")
        }

    }

    /**
     * TODO: Refresh Recipe List Function
     * - Clear current list in DOM
     * - Create <li> elements for each recipe with name + instructions
     * - Append to list container
     */
    function refreshRecipeList() {
        // Implement refresh logic here
        recipeList.innerHTML = "";
        for (let recipe of recipes) {
            let listItem = document.createElement("li");
            listItem.textContent = recipe.name + ": " + recipe.instructions;
            recipeList.appendChild(listItem);
        }
    }

    /**
     * TODO: Logout Function
     * - Send POST request to /logout
     * - Use Bearer token from sessionStorage
     * - On success: clear sessionStorage and redirect to login
     * - On failure: alert the user
     */
    async function processLogout() {
        // Implement logout logic here
        const requestOptions = {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            }
        };
        try {
            const response = await fetch(`${BASE_URL}/logout`, requestOptions);

            if (response.status === 200) {
                sessionStorage.clear();
                window.location.href = "../login/login-page.html";
            } else {
                alert("Error to logout")
            }
        } catch (error) {
            console.error("Error: " + error);
            alert("Error to logout.")
        }
    }

    function hasEmptyFields(name, instructions) {
        if (name == null ||
            name.length === 0 ||
            instructions == null ||
            instructions.length === 0) {
            return true;
        }
        return false;
    }

});