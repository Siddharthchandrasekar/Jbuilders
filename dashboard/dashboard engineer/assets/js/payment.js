import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://j-builders-default-rtdb.firebaseio.com/"
}
const projectId = "BlueTides SiteII"
const app = initializeApp(appSettings)
const database = getDatabase(app)
const checkStatusButton = document.getElementById("check-status-button");
function getUserIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('userId');
}

const userId = getUserIdFromURL();
const dateKey = new Date().toISOString().split('T')[0];
const shoppingListInDB = ref(database, `PaymentReq/${projectId}/${dateKey}`)

const inputFieldEl = document.getElementById("input-field")
const purposeFeild = document.getElementById("purpose")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value;
    let purposeValue = purposeFeild.value; // Get the value of the purpose field
    
    if (inputValue.trim() === "") {
        alert("Please enter a value.");
        return;
    }

    // Push both input and purpose values to the database
    push(shoppingListInDB, {
        value: inputValue,
        purpose: purposeValue
    });

    clearInputFieldEl();
    purposeFeild.value = ""; // Clear the purpose field after pushing to the database
});

const transactionListEl = document.getElementById("transaction-list");

onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val());
    
        clearShoppingListEl();
        clearTransactionListEl();
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i];
            let currentItemID = currentItem[0];
            let currentItemValue = currentItem[1];
            
            if (currentItemValue.paymentstatus === "successful") {
                appendItemToTransactionListEl(currentItem);
            } else {
                appendItemToShoppingListEl(currentItem);
            }
        }    
    } else {
        shoppingListEl.innerHTML = "No Requests!";
    }
});

function clearTransactionListEl() {
    transactionListEl.innerHTML = "";
}

function appendItemToTransactionListEl(item) {
    let itemID = item[0];
    let itemValue = item[1].value;
    let purposeValue = item[1].purpose;
    
    let newEl = document.createElement("li");
    newEl.textContent = `${itemValue} INR - ${purposeValue}`;
    newEl.style.backgroundColor = "lightgreen";

    let deleteIcon = document.createElement("span");
    deleteIcon.textContent = "❌";
    deleteIcon.style.cursor = "pointer";
    deleteIcon.style.marginLeft = "10px";
    deleteIcon.addEventListener("click", function(event) {
        event.stopPropagation();
        let exactLocationOfItemInDB = ref(database, `PaymentReq/${projectId}/${dateKey}/${itemID}`);
        remove(exactLocationOfItemInDB);
    });

    newEl.appendChild(deleteIcon);
    transactionListEl.appendChild(newEl);
}


function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}
function appendItemToShoppingListEl(item) {
    let itemID = item[0];
    let itemValue = item[1].value; // Access the value property of the object
    let purposeValue = item[1].purpose; // Access the purpose property of the object
    let paymentStatus = item[1].paymentstatus;
    console.log(paymentStatus)
    let newEl = document.createElement("li");
    newEl.textContent = `${itemValue} INR - ${purposeValue}`; 
    if (paymentStatus === "successful") {
        newEl.style.backgroundColor = "lightgreen"
    }
    else{
        newEl.style.backgroundColor = "orange"
    }
    // Create a delete icon element
    let deleteIcon = document.createElement("span");
    deleteIcon.textContent = "❌"; // You can use any suitable icon or text for deletion
    deleteIcon.style.cursor = "pointer";
    deleteIcon.style.marginLeft = "10px";

    // Add click event listener to the delete icon
    deleteIcon.addEventListener("click", function(event) {
        event.stopPropagation(); // Prevent the click from reaching the li element
        let exactLocationOfItemInDB = ref(database, `PaymentReq/${projectId}/${dateKey}/${itemID}`);
        remove(exactLocationOfItemInDB);
    });

    // Add the delete icon to the li element
    newEl.appendChild(deleteIcon);

    shoppingListEl.appendChild(newEl);
}