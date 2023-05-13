
// Initialize Elements
let uList = document.querySelector("ul");
let addButton = document.querySelector("button");
let saveButton = document.querySelector("button.save");
let itemInput = document.querySelector("#item");
let amount = document.querySelector("#amount");
// Empty Temp Array for JSON data
let dataArray= [];
let catSelection = 0;

// ========================
// TO DO:
// Get Categories from categories.json
// ========================

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

    // Save initial JSON data globaly
    dataArray = jsonDaten;
    // List the Categories as dropdown options and..
    listCategories(jsonDaten);
    console.log("data: " + jsonDaten);
    // ..put their content on screen
    writeOnScreen(jsonDaten, 0);
    // Add added dropdown options an event listener to change categories live
    categories.addEventListener("change", function(){
        setCategory(jsonDaten);
    });
};

xhr.open("GET", "../gastro/data/shoppinglist.json");
xhr.responseType = "json";
xhr.send();

addButton.addEventListener("click", addItemToList);
saveButton.addEventListener("mousedown", function(){removeFromList()});

function setCategory(jsonDaten){
    catSelection = categories.selectedIndex;
    console.log("cat: " + categories.options[catSelection].text);

    writeOnScreen(jsonDaten,catSelection);
    console.log("class: " + saveButton.classList);
}

// ========================
// Get Categories in Dropdown Element
// ========================

function listCategories(data){
    if(data.shoppinglist.length){
        for(let i = 0; i < data.shoppinglist.length; i++){
            let newOption = document.createElement("option");
            newOption.setAttribute("value", i);
            newOption.innerText = data.shoppinglist[i].role;
            // add the available categories as options in dropdown element
            categories.appendChild(newOption);
        }
    }
}

// ========================
// List all Shoppinglist items in DOM
// ========================

function writeOnScreen(jsonDaten, cat){
  //  let newListElement = document.createElement("li");
    let checkbox; 

    if(jsonDaten){
        // Empty unordered List-Element
        uList.innerHTML = "";

        // Loop through all shoppinglist items
        for(let i = 0; i < jsonDaten.shoppinglist[cat].groceries.length; i++){
            let newListElement = document.createElement("li");

            newListElement.innerHTML = '<label class="checkbox_label">' + jsonDaten.shoppinglist[cat].groceries[i].amount + "× " + jsonDaten.shoppinglist[cat].groceries[i].item + '<input type="checkbox"><span class="checkbox"></span></label>';
            uList.appendChild(newListElement);
            checkbox = newListElement.querySelector(".checkbox_label");
            // Add Eventlistener to each shoppinglist item to mark them as checked/unchecked
            checkbox.addEventListener("mousedown", function(){
                // Sort checked items to top (incl. fontstyle: crossed)
                sortList(newListElement);
                // and hide "save" button
                saveButton.classList.remove("hidden");
            });                 
        }
    }
}

// ========================
// TO DO:
// Fusion of writeOnScreen() and addItemToList()
// ========================

// ========================
// Add new item to shoppinglist
// ========================

function addItemToList(){
    let newListElement = document.createElement("li");
    let checkbox; 

    if(itemInput.value){
        newListElement.innerHTML = '<label class="checkbox_label">' + amount.value + "× " + itemInput.value + '<input type="checkbox"><span class="checkbox"></span></label>';
        uList.appendChild(newListElement);
        checkbox = newListElement.querySelector(".checkbox_label");
            // Add Eventlistener to each shoppinglist item to mark them as checked/unchecked
            checkbox.addEventListener("mousedown", function(){
            //newListElement.querySelector("label").classList.toggle("crossed");        
            // Sort checked items to top (incl. fontstyle: crossed)
            sortList(newListElement);
            // and hide "save" button
            saveButton.classList.remove("hidden");
         });

         writeToJson(itemInput.value,amount.value);
    }    
}

// ========================
// Remove item from shoppinglist
// ========================

function removeFromList(){
    let tempArray = dataArray.shoppinglist[catSelection].groceries;
    let allLists = document.querySelectorAll("li");
    //console.log("removing: " + tempArray[1].item);

    dataArray.shoppinglist[catSelection].groceries = [];
    for(let i = 0; i < tempArray.length; i++){
       //console.log(allLists[i].querySelector("input").checked);
        if(!allLists[i].querySelector("input").checked){
            console.log("array: " + tempArray[i].item);
            // write new JSON file after removing item
            writeToJson(tempArray[i].item, tempArray[i].amount);
        }
    }
    // List new array of shoppinglist in DOM
    writeOnScreen(dataArray,catSelection);

    //writeToJson(jsonDaten.shoppinglist[cat].groceries[i].amount,jsonDaten.shoppinglist[cat].groceries[i].item);
}

// ========================
// Write JSON Data array
// ========================

function writeToJson(item, amount){
    let newItem = {
        item: item,
        amount: amount
    };
    dataArray.shoppinglist[catSelection].groceries.push(newItem);
    sendData(JSON.stringify(dataArray), "shoppinglist");
}

// ========================
// Send JSON data to write
// ========================

function sendData(jsonString, dest){
    let xhr = new XMLHttpRequest();
    xhr.onload = function(){
        if(xhr.status != 200) return;
        console.log("string: " + xhr.responseText);
    }
    xhr.open("POST", "./writeJSON.php?action=" + dest);
    xhr.send(jsonString);
}

// ========================
// Sort List by checked/unchecked
// ========================

function sortList(li){
    li.querySelector("label").classList.toggle("crossed");        
/*     let allLists = document.querySelectorAll("li");

    for(let i = 0; i < allLists.length;i++){
        for(let j = 0; j < allLists.length; j++){

        }
        if(allLists[i].querySelector("input").getAttribute("checked")){
            uList.prepend(li);
        }
    } */
}