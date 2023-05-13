"use strict"

// Initialize Elements
let addButton = document.querySelector("button");
//let saveButton = document.querySelector("button.save");
let itemInput = document.querySelector("#item");
let amount = document.querySelector("#amount");
let addRecipe = document.querySelector("#addRecipe");
let newRecipe = {};
let newIngredients = [];
let menuData;
// Get Categories and Menu Data first
getCategories();

categories.addEventListener("change", function(){
    getRecipes();
});

getRecipes();

getMenuData();


// ========================
// Adding new recipe in recipe.json
// ========================

function addNewRecipes(data){
    let xhr = new XMLHttpRequest();

    xhr.onload = function(){
        if(xhr.status != 200){
            container.textContent = "Allgemeiner Verarbeitungsfehler.";
            return;
        }
        // Write the HTML for new recipes in DOM
        content.innerHTML = xhr.responseText;
        // Get all Elements
        let btnSaveIngredients = document.querySelector("#save_ingredient");
        let inputName = document.querySelector("#recipe_name");
        let inputNotes = document.querySelector("#recipe_notes");
        let cooking = document.querySelector("#cooking");
        let saveNewRecipe = document.querySelector("#save_new_recipe");    

        // The save Ingredients button gets its listener to be ready to take new items
        btnSaveIngredients.addEventListener("click", function(){
            saveIngredients(data, this);
        });

        // ========================
        // Actual saving of the recipe
        // ========================

        saveNewRecipe.addEventListener("click", function(){
            console.log(newIngredients);
            // If all inputs are filled
            if(inputName.value && inputNotes.value && cooking.value && newIngredients.length){
                // Create new recipe object
                newRecipe = {"name": inputName.value,"ingredients": newIngredients,"cooking" : cooking.value,"notes": inputNotes.value};
                //let recipes;
                console.log("added recipe: " + JSON.stringify(newRecipe));
                //console.log("all new recipes: " + JSON.stringify(recipes));

                // Loop the categories to the selected one to push the recipe in
                for(let i=0; i< data.length; i++){
                    if(data[i].category == categories.selectedIndex){
                        data[i].recipes.push(newRecipe);
                    }
                }

                let tmpRecipes;
                let tempInt= 0;
                tmpRecipes = {"recipes": data};
                tempInt = parseInt(recipes.querySelectorAll("option").length) + parseInt(1);
                // Write new recipe in recipe.json
                window.sessionStorage.setItem("stored_recipe",categories.selectedIndex + "," + tempInt);

                sendData(JSON.stringify(tmpRecipes), "recipes");
                // Load new recipe in DOM
                loadRecipes();

            }else{
                alert("Bitte alle Felder ausfüllen");
            }
        });

    };

    xhr.open("GET", "./recipe_new.html");
    xhr.send();
    
}

// ========================
// Load new HTML file to edit Recipes
// ========================

function loadRecipeEdit(data){
    let xhr = new XMLHttpRequest();
    xhr.onload = function(){
        if(xhr.status != 200){
            container.textContent = "Allgemeiner Verarbeitungsfehler.";
            return;
        }
        // write actual recipe in new loaded HTML
        content.innerHTML = xhr.responseText;
        recipeToDom(data);
    };

    xhr.open("GET", "./recipe_edit.html");
    xhr.send();
}

// ========================
// Set all Fields in DOM the actual recipes content
// ========================

function recipeToDom(data){
    // Get all the fields and buttons
    let btnSaveIngredients = document.querySelector("#save_ingredient");
    let cooking = document.querySelector("#cooking");
    let notes = document.querySelector("#recipe_notes");
    let ingredientList = data[categories.selectedIndex].recipes[recipes.selectedIndex].ingredients;
    let recipeName = document.querySelector("#recipe_name");
    let editLinks = document.querySelectorAll(".edit_link");
    let btnDelete = document.querySelector("#btn_delete_recipe");

    // Write all ingredients in the DOM
    decodeIngredients(ingredientList);
    // Add [edit / delete] Buttons to each ingredient
    addEditButtons(data);

    // hide recently clicked edit button
    addButton.classList.toggle("hidden");
    // get all the textfields filled with selected recipes content
    notes.innerHTML = data[categories.selectedIndex].recipes[recipes.selectedIndex].notes;
    cooking.innerHTML = data[categories.selectedIndex].recipes[recipes.selectedIndex].cooking;
    recipeName.value = data[categories.selectedIndex].recipes[recipes.selectedIndex].name;
    
    // adds Eventlistener to save button
    btnSaveIngredients.addEventListener("click", function(){
        saveIngredients(data, this);
    });

    // Loops the edit links on each ingredient
    for(let i = 0; i < editLinks.length; i++){
        editLinks[i].addEventListener("click", function(){
            toggleRecipeText(editLinks[i].previousElementSibling, data);
        });
    }
    
    // Loops the deletes links on each ingredient
    btnDelete.addEventListener("click", function(){
        if(confirm("Wollen Sie das Rezept " + recipeName.value + " wirklich löschen?")){
            data[categories.selectedIndex].recipes[recipes.selectedIndex]; //
            console.log("deleted: " + JSON.stringify(data[categories.selectedIndex].recipes.splice(recipes.selectedIndex,1)));                
            let tmpRecipes;
            tmpRecipes = {"recipes": data};
            sendData(JSON.stringify(tmpRecipes), "recipes");
            loadRecipes();
            // deleting also in menu.json?
        }
    });
}

// ========================
// Saving ingredients in edit recipe menu
// ========================

function saveIngredients(data, button){
    // Init all vars
    let ingredients = document.querySelectorAll("table#ingredients tr");
    let inputIngredient = document.querySelector("#input_ingredient");
    let inputAmount = document.querySelector("#input_amount");
    // get list of all ingredients from chosen recipe
    let ingredientList = data[categories.selectedIndex].recipes[recipes.selectedIndex].ingredients;
    let saveNewRecipe = document.querySelector("#save_new_recipe");    

    // when there are values in both input fields (input_amount / input_ingredient) and there is no new recipe to save (so its edit)
    if(inputIngredient.value && inputAmount.value && !saveNewRecipe){
        // the toDel Attribute is used to know whether there is an existing ingredient or to create a new one
        if(button.getAttribute("toDel")){
            // on existing, we edit the ingredient
            ingredients[button.getAttribute('toDel')].querySelector("td:nth-of-type(1)").innerHTML = inputAmount.value;
            ingredientList[button.getAttribute('toDel')][0] = inputAmount.value;
            ingredients[button.getAttribute('toDel')].querySelector("td:nth-of-type(2)").innerHTML = inputIngredient.value;
            ingredientList[button.getAttribute('toDel')][1] = inputIngredient.value;
            inputAmount.value = "";
            inputIngredient.value = "";
            button.setAttribute("toDel", "");
        }else{
            // Adds new ingredient to existing recipe / set input forms to empty
            ingredientList.push([inputAmount.value,inputIngredient.value]);
            inputAmount.value = "";
            inputIngredient.value = "";

            // create new false flags for added ingredient in menu.json
            menuData.recipes[categories.selectedIndex].recipes[recipes.selectedIndex].ingredients.push(false);
            sendData(JSON.stringify(menuData), "menu");

            // Adding edit / delete buttons to newly created ingredient
            addEditButtons(data);
        }
    }else if(saveNewRecipe){
        // The case if there is a new recipe, push new ingredient to a new array
        newIngredients.push([inputAmount.value,inputIngredient.value]);
        decodeIngredients(newIngredients);
        inputAmount.value = "";
        inputIngredient.value = "";
        console.log(newIngredients);
        
        return;
    }else{
        alert("Es muss mindestens eine Zutat eingegeben werden.");
        return;
    }

    // Saving added data directly and writing in DOM
    decodeIngredients(ingredientList);
    loadRecipeEdit(data);
    // console.log("after: " + ingredientList);
    let tmpRecipes;
    tmpRecipes = {"recipes": data};
    sendData(JSON.stringify(tmpRecipes), "recipes");

    return;
}

// ========================
// When clicking on [edit] on textarea/input, this function toggles the readonly attribute
// ========================

function toggleRecipeText(textElement, data){
    // Setting up all needed vars
    let cooking = document.querySelector("#cooking");
    let notes = document.querySelector("#recipe_notes");
    let recipeName = document.querySelector("#recipe_name");
    // Get actual recipe
    let recipe = data[categories.selectedIndex].recipes[recipes.selectedIndex];
    let tmpRecipes;

    // Toggle readonly from clicked element and change the links text
    if(textElement.getAttribute("readonly")){
        textElement.removeAttribute("readonly");        
        textElement.parentElement.querySelector(".edit_link").innerHTML = "speichern";
    }else{
        textElement.setAttribute("readonly","true");
        textElement.parentElement.querySelector(".edit_link").innerHTML = "bearbeiten";
    }

    // Switch between the ids and check if the value in text-fields has changed
    // set new values accordingly

    // TO DO: doesnt change when from text to empty!?  
    switch(textElement.getAttribute("id")){
        case "recipe_name":
            textElement.classList.toggle("input_inactive");
            if(recipe.name != recipeName.value){
                recipe.name = recipeName.value;
                console.log("changes: " + recipe.name);                 
            }
        break;
        
        case "recipe_notes":
            textElement.classList.toggle("input_inactive");
            if(recipe.notes != notes.value){
                recipe.notes = notes.value;
                console.log("changes: " + recipe.notes);     
            }
        break;
        
        case "cooking":
            textElement.classList.toggle("input_inactive");
            if(recipe.cooking != cooking.value){
                recipe.cooking = cooking.value;
                console.log("changes: " + recipe.cooking);       
            }
        break;
        
    }       

    // write new data
    tmpRecipes = {"recipes": data};
    sendData(JSON.stringify(tmpRecipes), "recipes");
}


// ========================
// Get all data from menu.json to have it globally ready for synching with recipe.json
// ========================

function getMenuData(){
    let xhr = new XMLHttpRequest();

    xhr.onload = function() {
        if (xhr.status != 200) {
            container.textContent = "Allgemeiner Verarbeitsungsfehler";
            return;
        }
        let jsonDaten;

        // Browserweiche
        if(xhr.responseType == "json") jsonDaten = xhr.response
        else jsonDaten = JSON.parse(xhr.responseText);

        menuData = jsonDaten;        
    };

    xhr.open("GET", "../gastro/data/menu.json");
    xhr.responseType = "json"; // in XML Document parsen
    xhr.send();
}

// ========================
// Adding Edit / Delete Buttons to each ingredient
// ========================

function addEditButtons(data){
    // Initialize Table for ingredients and input fields for new/editing ingredients
    let ingredients = document.querySelectorAll("table#ingredients tr");
    let inputAmount = document.querySelector("#input_amount");
    let inputIngredient = document.querySelector("#input_ingredient");
    let btnSaveIngredients = document.querySelector("#save_ingredient");

    // loop all ingredients ...
    for(let i = 0; i < ingredients.length; i++){
        let editButton = document.createElement("td");
        editButton.innerHTML = "<p id='edit_recipe' value='" + ingredients[i] + "'>edit</p>";
        let deleteButton = document.createElement("td");
        deleteButton.innerHTML = "<p id='delete_recipe' href=''>delete</p>";

        // ... and add them the edit / delete buttons
        ingredients[i].append(editButton, deleteButton);

        // Add EventListener to Edit Button
        editButton.addEventListener("click", function(){
            // Put values from chosen ingredient into input forms
            inputAmount.value = ingredients[i].querySelector("td:nth-of-type(1)").innerHTML;
            inputIngredient.value = ingredients[i].querySelector("td:nth-of-type(2)").innerHTML;
            // Pass id from ingredient to button
            btnSaveIngredients.setAttribute("toDel",i);            
        });

        // Add EventListener to Delete Button

        // ========================
        // Actual deleting Function
        // ========================

        deleteButton.addEventListener("click", function(){
            console.log("menuData: " + data);
            let ingredientList = data[categories.selectedIndex].recipes[recipes.selectedIndex].ingredients;
            let newMenuList = menuData.recipes[categories.selectedIndex].recipes[recipes.selectedIndex].ingredients;

            if(confirm(ingredients[i].querySelector("td:nth-of-type(2)").innerHTML + " wirklich löschen?")){
                ingredients[i].remove();
                ingredientList.splice(i,1);
                newMenuList.splice(i,1);
                loadRecipeEdit(data);

                let tmpRecipes;
                tmpRecipes = {"recipes": data};
                sendData(JSON.stringify(tmpRecipes),"recipes");

                // Also removes ingredient in menu.json to prevent false setted flags
                let tmpMenu;
                sendData(JSON.stringify(menuData), "menu");

                return;
            } 
        });
    }


}


// ========================
// Implement the ingredients in an Unordered-List-Element and add to DOM
// ========================

function decodeIngredients(ingredients){
    let table = document.querySelector("table#ingredients");
    table.innerHTML = "";
    let tBody= document.createElement("tbody");

    for(let i = 0; i < ingredients.length; i++){        
        let tr = document.createElement("tr");
        let leftRow = document.createElement("td");
        let rightRow = document.createElement("td");        
        tr.appendChild(leftRow);
        tr.appendChild(rightRow);
        leftRow.innerHTML = ingredients[i][0];
        rightRow.innerHTML =  ingredients[i][1];
        tBody.append(tr);
    } 

    table.append( tBody);
}
