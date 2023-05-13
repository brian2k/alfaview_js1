"use strict"


// ========================
// Send JSON data to write
// ========================

function sendData(jsonString,dest){
    let xhr = new XMLHttpRequest();
    xhr.onload = function(){
        if(xhr.status != 200) return;
        console.log("string in sendData: " + xhr.responseText);
    }
    xhr.open("POST", "./writeJSON.php?action=" + dest);
    xhr.send(jsonString);
}


// ========================
// Write all Categories in DOM
// ========================

function listCategories(data){
    if(data.categories.length){
        for(let i = 0; i < data.categories.length; i++){
            console.log("kats in listCategories() in getJsonDAta.js: " + data.categories[i]);
            
            let newOption = document.createElement("option");
            let actCat = data.categories[i];
            newOption.setAttribute("value", i);
            newOption.innerText = data.categories[i];
            categories.appendChild(newOption);
        }
        getRecipes();

    }
}