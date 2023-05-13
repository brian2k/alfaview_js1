"use strict"

let menuContainer = document.querySelector("#menu_container");
let recipesData;
let menuData;
let categories;

getCategories();

function getRecipes(){
    let xhr = new XMLHttpRequest;
    xhr.onload = function(){
        if(xhr.status != 200) alert("error");
        if(xhr.responseType == "json") recipesData = xhr.response
        else recipesData = JSON.parse(xhr.responseText);
        getMenuSettings();

    };

    xhr.open("GET", "../gastro/data/recipes.json");
    xhr.responseType = "json"; // in XML Document parsen

    xhr.send();
}

function getCategories(){
    let xhr = new XMLHttpRequest;
    xhr.onload = function(){
        if(xhr.status != 200) alert("error");
        if(xhr.responseType == "json") categories = xhr.response
        else categories = JSON.parse(xhr.responseText);
        getRecipes();

    };

    xhr.open("GET", "../gastro/data/categories.json");
    xhr.responseType = "json"; // in XML Document parsen

    xhr.send();
}


function getMenuSettings(){
    let xhr = new XMLHttpRequest;
    xhr.onload = function(){
        if(xhr.status != 200) alert("error");
        if(xhr.responseType == "json") menuData = xhr.response
        else menuData = JSON.parse(xhr.responseText);
        drawMenu();

    };

    xhr.open("GET", "../gastro/data/menu.json");
    xhr.responseType = "json"; // in XML Document parsen

    xhr.send();
}

function drawMenu(){
    let table = document.createElement("table");

    for(let i = 0; i < menuData.recipes.length; i++){

        if(menuData.recipes[i].flag){
            let rowCategory = document.createElement("td");
            let colCategory = document.createElement("tr");
            rowCategory.innerHTML =  " -== " + categories.categories[i] + "==-"; 
            rowCategory.classList.add("category_name")
            colCategory.append(rowCategory);
            table.append(colCategory); 

            //menuContainer.innerHTML += ";" + recipesData.recipes[i].category;
            //menuContainer.innerHTML += categories.categories[i];    
            
            for(let j = 0; j < menuData.recipes[i].recipes.length; j++){

                if(menuData.recipes[i].recipes[j].flag){
                    let rowIngredients = document.createElement("td");

                    let rowName = document.createElement("td");
                    rowName.classList.add("recipe_name")
                    let colName = document.createElement("tr");
                    rowName.innerHTML = "-" + recipesData.recipes[i].recipes[j].name + "-";
                    colName.append(rowName);
                    table.append(colName);

                    //menuContainer.innerHTML += "<br>" + recipesData.recipes[i].recipes[j].name;

                    for(let k = 0; k < menuData.recipes[i].recipes[j].ingredients.length;k++){                                            
                        if(menuData.recipes[i].recipes[j].ingredients[k]){
                            let colIngredients = document.createElement("tr");
                            let comma = ", "
                            if(k == 0) comma = "";
                            rowIngredients.innerHTML += comma + recipesData.recipes[i].recipes[j].ingredients[k][1];
                            colIngredients.append(rowIngredients);
                            table.append(colIngredients);

                           // menuContainer.innerHTML += recipesData.recipes[i].recipes[j].ingredients[k][1];
                        }
                        
                    }
                }


                if(menuData.recipes[i].recipes[j].notes){
                    let paragraph = document.createElement("p")
                    paragraph.innerHTML = menuData.recipes[i].recipes[j].notes;
                    table.append(paragraph);
                }
                if(menuData.recipes[i].recipes[j].infotext){
                    let paragraph = document.createElement("p")
                    paragraph.innerHTML = menuData.recipes[i].recipes[j].infotext;
                    table.append(paragraph);
                }
            }

        }
    }


    menuContainer.append(table);

}