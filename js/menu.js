"use strict"
let menuData;

initialize();


initializeCheckboxes();
getIngredientCheckboxes();
// ========================
// Initialize menu JSON datas: Check for Data in menu.json
// ========================


 function initialize(){    

    let xhr = new XMLHttpRequest();
    let jsonDaten;

    xhr.onload = function() {
        if (xhr.status != 200) {
            container.textContent = "Allgemeiner Verarbeitsungsfehler";
            return;
        }

        if(xhr.responseType == "json") jsonDaten = xhr.response
        else jsonDaten = JSON.parse(xhr.responseText);

        // Write entire new menu.json with the length from recipeData
        if(!jsonDaten){
            console.log("rezepte in initialize(): " + JSON.stringify(recipesData));          
            // Prepare temp for menu.json 
            let temp = {"recipes":[]};

            // Set everything to false
            for(let i = 0; i < recipesData.recipes.length; i++){
                temp.recipes.push({"category":recipesData.recipes[i].category,"flag":false,"recipes":[]});

                for(let j = 0; j < recipesData.recipes[i].recipes.length; j++){                    
                    temp.recipes[i].recipes.push({"flag":false,"ingredients":[],"infotext":false,"notes":false});

                    for(let k = 0; k < recipesData.recipes[i].recipes[j].ingredients.length;k++){
                        temp.recipes[i].recipes[j].ingredients.push(false);
                    }
                }
            }

            console.log("temp in initialize() sending to sendData(): " + JSON.stringify(temp));
            // Save data to actual JSON file
            sendData(JSON.stringify(temp), "menu");            
        }else{
            console.log("else in initialize()" + jsonDaten);
        }

        getCategories();
        let categories = document.querySelector("#category");


        categories.addEventListener("change", function(){
            getRecipes();
        });
        getRecipes();

        menuData = jsonDaten;
    };

    xhr.open("GET", "../gastro/data/menu.json");
    xhr.responseType = "json";
    xhr.send();
};

// ========================
// Set Checkboxes according to menu.json when loading Recipe
// ========================

function setCheckboxes(){
    let labelCategories = document.querySelector("[dataid=categories]");
    let labelRecipes = document.querySelector("[dataid=recipe]");

    console.log("setCheckboxes Categories on " + recipesData.recipes[categories.selectedIndex].category + ": " + menuData.recipes[categories.selectedIndex].flag);
    console.log("setCheckboxes Recipes on " + recipesData.recipes[categories.selectedIndex].recipes[recipes.selectedIndex].name + " : " + menuData.recipes[categories.selectedIndex].recipes[recipes.selectedIndex].flag);

    if(menuData && menuData.recipes[categories.selectedIndex].flag){
        labelCategories.querySelector("input").checked = true;
    }
    if(menuData && menuData.recipes[categories.selectedIndex].recipes[recipes.selectedIndex].flag){
        labelRecipes.querySelector("input").checked = true;
    }

    
}


getMenuTexts();
// ========================
// Send JSON data to write
// ========================

function getMenuTexts(data){
    let cooking = document.querySelector("#cooking");
    let recipe_notes = document.querySelector("#recipe_notes");
    let categories = document.querySelector("#category");
    let recipes = document.querySelector("#recipes");
    
    cooking.removeAttribute("readonly");
    recipe_notes.removeAttribute("readonly");

    if(recipesData && recipesData.recipes[categories.selectedIndex].recipes[recipes.selectedIndex].notes){
       recipe_notes.innerHTML = recipesData.recipes[categories.selectedIndex].recipes[recipes.selectedIndex].notes;
    }
    
    if(recipesData && recipesData.recipes[categories.selectedIndex].recipes[recipes.selectedIndex].infotext){
        cooking.innerHTML = data.recipes[categories.selectedIndex].recipes[recipes.selectedIndex].infotext;
    }

    cooking.addEventListener("focusout", function(){
        if(cooking.value) saveMenuData(recipesData);
    })

    recipe_notes.addEventListener("focusout", function(){
        if(recipe_notes.value) saveMenuData(recipesData);
    })
}

function getIngredientCheckboxes(){
    let ingredients = document.querySelector("table#ingredients").querySelectorAll("[type=checkbox]");

    for(let i = 0; i < ingredients.length; i++){
        ingredients[i].checked = menuData.recipes[categories.selectedIndex].recipes[recipes.selectedIndex].ingredients[i];
    }
}

// ==============================
// Write all flag Status after check/uncheck boxes
// ==============================

// Writing all the ingredients in menu.json new after each checkmark
function saveMenuData(menuData){
    console.log("menuData in saveMenuData()" + JSON.stringify(menuData));
    let labelCategories = document.querySelector("[dataid=categories]");
    let labelRecipes = document.querySelector("[dataid=recipe]");
    let labelIngredients = document.querySelector("table#ingredients").querySelectorAll("[type=checkbox]");
    let cooking = document.querySelector("#cooking");
    let recipe_notes = document.querySelector("#recipe_notes");
    
    // Check if JSON is not empty
    if(menuData){
        // Prepare temp to write new data in menu.json
        let temp = {"recipes":[]};

        // Category Loop
        for(let i = 0; i < menuData.recipes.length; i++){

            // Check whether the selected category needs the status of users checkmark or the keep the data from menuData
            // (This checks out for non selected categories/recipes)
            if(i == categories.selectedIndex){
                temp.recipes.push({"category":menuData.recipes[i].category,"flag":labelCategories.querySelector("input").checked,"recipes":[]});
            }else{
                temp.recipes.push({"category":menuData.recipes[i].category,"flag":menuData.recipes[i].flag,"recipes":[]});
            }
            
            // Recipe Loop
            for(let j = 0; j < menuData.recipes[i].recipes.length; j++){

                // Check whether the recipe status is the one the user selected or old data
                if(i == categories.selectedIndex && j == recipes.selectedIndex){
                    temp.recipes[i].recipes.push({"flag":labelRecipes.querySelector("input").checked,"ingredients":[],"infotext":cooking.value,"notes":recipe_notes.value});
                }
                else{
                    temp.recipes[i].recipes.push({"flag":menuData.recipes[i].recipes[j].flag,"ingredients":[],"infotext":menuData.recipes[i].recipes[j].infotext,"notes":menuData.recipes[i].recipes[j].notes});
                }
                // Ingredients Loop
                for(let k = 0; k < menuData.recipes[i].recipes[j].ingredients.length;k++){

                    //console.log("checkboxes in k: " + JSON.stringify(labelIngredients));

                    // When the loop is in the right category and recipe, the checked ingredients apply. Otherwise save old data in temp
                    if(i == categories.selectedIndex && j == recipes.selectedIndex && labelIngredients[k].checked){
                        temp.recipes[i].recipes[j].ingredients.push(true);
                    }else if(i == categories.selectedIndex && j == recipes.selectedIndex && !labelIngredients[k].checked){
                        temp.recipes[i].recipes[j].ingredients.push(false);
                    }else{
                        temp.recipes[i].recipes[j].ingredients.push(menuData.recipes[i].recipes[j].ingredients[k]);
                    }
                    
                }
            }
        }
        

        console.log("temp in end of saveMenuData() going to sendData(): " + JSON.stringify(temp));
        // Write actual data in JSON File per PHP
        sendData(JSON.stringify(temp), "menu");
    }    
}


// ==============================
// Generate Checkboxes for Category and Recipes / Add Eventlistener to the Dropdowns
// ==============================

function initializeCheckboxes(){
    let categories = document.querySelector("#category");
    let recipes = document.querySelector("#recipes");

    // Init all Vars
    let labelCategories = document.createElement("label");
    let labelRecipes = document.createElement("label");
    labelCategories.classList.add("checkbox_label");
    labelRecipes.classList.add("checkbox_label");
    labelCategories.setAttribute("dataid", "categories");
    labelRecipes.setAttribute("dataid", "recipe");
    labelCategories.innerHTML = 'Kategorie in Menükarte anzeigen<input type="checkbox"><span class="checkbox"></span>';
    labelRecipes.innerHTML = 'Rezept in Menükarte anzeigen<input type="checkbox"><span class="checkbox"></span>';

    // Give them all Eventlisteners
    categories.addEventListener("change", function(){
        resetCheckboxes();
    });
    
    recipes.addEventListener("change", function(){
        resetCheckboxes();
    });

    labelCategories.addEventListener("change", function(){
        saveMenuData(menuData);
    });

    labelRecipes.addEventListener("change", function(){
        saveMenuData(menuData);
    });

    categories.parentElement.insertBefore(labelCategories, categories.nextElementSibling);
    recipes.parentElement.insertBefore(labelRecipes, recipes.nextElementSibling);
}

// Reset all Checkboxes when changing Recipe or Category

function resetCheckboxes(){
    let allCheckboxes  = document.querySelectorAll(".checkbox_label");

    for(let i = 0; i<allCheckboxes.length; i++){
        console.log("all in resetCheckboxes(): " + allCheckboxes[i]);
        allCheckboxes[i].querySelector("input").checked = false;
    }
}