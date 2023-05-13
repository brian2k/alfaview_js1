let categories = document.querySelector("#category");
let recipes = document.querySelector("#recipes");
let content = document.querySelector(".content");
let recipesData;


// ========================
// Get all Categories from JSON and ...
// ========================

function getCategories(){
    let xhr = new XMLHttpRequest();

    xhr.onload = function() {
        if (xhr.status != 200) {
            container.textContent = "Allgemeiner Verarbeitsungsfehler";
            return;
        }

        let jsonDaten;
        if(xhr.responseType == "json") jsonDaten = xhr.response
        else jsonDaten = JSON.parse(xhr.responseText);
        listCategories(jsonDaten);
    };

    xhr.open("GET", "../gastro/data/categories.json");
    xhr.responseType = "json";
    xhr.send();
}



// ========================
// ... then put all Categories in Dropdown Element
// ========================

function listCategories(data){
    if(data.categories.length){
        for(let i = 0; i < data.categories.length; i++){            
            let newOption = document.createElement("option");
            newOption.setAttribute("value", i);
            newOption.innerText = data.categories[i];
            categories.appendChild(newOption);
        }

        // Get Recipes from JSON to Dropdown
    }
}

// ========================
// Get all Recipes from JSON ...
// ========================

function getRecipes(){
    let xhr = new XMLHttpRequest();
    let jsonDaten;

    xhr.onload = function() {
        if (xhr.status != 200) {
            container.textContent = "Allgemeiner Verarbeitsungsfehler";
            return;
        }

        if(xhr.responseType == "json") jsonDaten = xhr.response;
        else jsonDaten = JSON.parse(xhr.responseText);

        recipesData = jsonDaten;

        // After getting the data set all option fields
        recipesInit();
    };

    xhr.open("GET", "../gastro/data/recipes.json");
    xhr.responseType = "json";
    xhr.send();
}

// ========================
// ... and append all recipe in Dropdown Element
// ========================

function recipesInit(){
    
        // Check if recipe.json is not empty nor larger then the selected options index
        if(recipesData && recipesData.recipes.length > categories.selectedIndex){
            // Clear Dropdown and add all recipes as options
            recipes.innerHTML = "";            
            console.log("recipesData in getRecipes in getJsonData.js: " + JSON.stringify(recipesData.recipes));

            // looping through all recipes in file
            for(let i = 0; i < recipesData.recipes.length; i++){

                // if the selected category is found in recipe.json
                if(recipesData.recipes[i].category == categories.selectedIndex){

                    // go through all recipes in selected category and list them in options field
                    for(let j = 0; j <  recipesData.recipes[categories.selectedIndex].recipes.length; j++){
                        let newOption = document.createElement("option");                    

                        newOption.setAttribute("value", j);
                        newOption.innerText = recipesData.recipes[categories.selectedIndex].recipes[j].name;
                        recipes.appendChild(newOption);

                        // if not already exists
                        if(!recipes.getAttribute("event")){
                            // Add eventlistener to the dropdown to change recipes on the fly
                            recipes.addEventListener("change", function(){
                                loadRecipes();
                                return;
                            });
                        }
                        // set boolean to prevent adding multiple eventlisteners
                        recipes.setAttribute("event",true);
                    }
                }
            }

            loadRecipes();
        }else{
            console.log("!recipesData in getRecipe() in getJsonData.js" + !recipesData);
            content.innerHTML = "";

            document.querySelector("#recipe_title").classList.toggle("hidden");
            document.querySelector("#recipes").classList.toggle("hidden");

        }
        // TOGGLE HERE FOR MENU MANAGER OR EDIT RECIPE
        // TO DO: Check if we in Edit Recipe or in Menu Manager
        
        let addRecipe = document.querySelector("#addRecipe");
        if(addRecipe){
            addRecipe.addEventListener("click", function(){
                addNewRecipes(recipesData.recipes);
            });
        }
        
 

}

// ========================
// Prepare DOM for recipes
// Load recipe_content.HTML in DOM per AJAX
// ========================

function loadRecipes(){

    let xhr = new XMLHttpRequest();
    xhr.onload = function(){
        if(xhr.status != 200){
            container.textContent = "Allgemeiner Verarbeitungsfehler.";
            return;
        }

        // Load new HTML file in DOM
        content.innerHTML = xhr.responseText;
        // and show elements

        document.querySelector("#recipe_title").classList.remove("hidden");
        document.querySelector("#recipes").classList.remove("hidden");

        // Eventlistener for Edit button to load new HTML file
        let btnEdit = document.querySelector("#edit");

        btnEdit.addEventListener("click", function(){
            content.innerHTML = "";
            loadRecipeEdit(recipesData.recipes);            
        });
        
        // write actual recipe in new loaded HTML
        writeRecipeInDom();

        // TO DO: Not smart, needs a check if we even in menu manager !

        if(document.querySelector(".checkbox_label")) setCheckboxes();

    };

    xhr.open("GET", "./recipe_content.html");
    xhr.send();
    
}


// ========================
// Write actual content of recipes in AJAX loaded recipe_content.HTML
// ========================

function writeRecipeInDom(){
    let cooking = document.querySelector("#cooking");
    //let recipe_title = document.querySelector("#recipe_name");
    let recipe_notes = document.querySelector("#recipe_notes");
    let categories = document.querySelector("#category");
    let recipes = document.querySelector("#recipes");

    // ========================
    // Get ingredients to unordered List
    // ========================
    
    if(navigator.cookieEnabled && window.sessionStorage.getItem("stored_recipe")){
        let stored_recipe = window.sessionStorage.getItem("stored_recipe");  
        stored_recipe.split(",");      
        console.log("STORED: " + stored_recipe[0] + " / " + stored_recipe[1]);
        // Reset Storage to category and recipe id = 0
        window.sessionStorage.removeItem("stored_recipe");
    }else if (!navigator.cookieEnabled){
        console.log("Cookies deaktiviert");
    }else{
        let stored_recipe = null;
        decodeIngredients(recipesData.recipes[categories.selectedIndex].recipes[recipes.selectedIndex].ingredients);
    }
    console.log("before");
   // decodeIngredients(recipesData.recipes[categories.selectedIndex].recipes[recipes.selectedIndex].ingredients);
    console.log("after");
    
    cooking.innerHTML = recipesData.recipes[categories.selectedIndex].recipes[recipes.selectedIndex].cooking;
    if(recipesData.recipes[categories.selectedIndex].recipes[recipes.selectedIndex].notes){
       recipe_notes.innerHTML = recipesData.recipes[categories.selectedIndex].recipes[recipes.selectedIndex].notes;
    }else{
        recipe_notes.remove();
    }
}

// ========================
// Implement the ingredients in an Unordered-List-Element
// ========================

function decodeIngredients(ingredients){
    let table = document.querySelector("table#ingredients");
    table.innerHTML = "";
    let tBody= document.createElement("tbody");   

    for(let i = 0; i < ingredients.length; i++){        
        let tr = document.createElement("tr");
        let leftRow = document.createElement("td");
        leftRow.classList.add("left_align")
        let rightRow = document.createElement("td");
        tr.appendChild(leftRow);
        tr.appendChild(rightRow);
        leftRow.innerHTML = '<label class="checkbox_label" dataid="' + i + '">' +  ingredients[i][1] + '<input type="checkbox"><span class="checkbox"></span></label>';        
        rightRow.innerHTML = ""
        leftRow.querySelector("label").addEventListener("change", function(){
            saveMenuData(menuData);
        });
        tBody.append(tr);
    } 

    table.append( tBody);
}