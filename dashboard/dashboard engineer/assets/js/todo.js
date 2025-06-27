import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://j-builders-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const checkStatusButton = document.getElementById("check-status-button");

function getUserIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('userId');
}

const userId = getUserIdFromURL();
const currentDate = new Date().toISOString().slice(0, 10); // Get current date in "YYYY-MM-DD" format

// Append the database name, date, and userId to the reference path
const projectId = "BlueTides SiteII"
const shoppingListInDB = ref(database, `ToDoList/${projectId}/${currentDate}/${userId}`)

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    
    push(shoppingListInDB, inputValue)
    
    clearInputFieldEl()
})

onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
    
        clearShoppingListEl()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            
            appendItemToShoppingListEl(currentItem)
        }    
    } else {
        shoppingListEl.innerHTML = "No tasks pending!"
    }
})

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function appendItemToShoppingListEl(item) {
    let itemID = item[0];
    let itemValue = item[1];
    
    // Check if the item value contains "wage"
    if (itemValue.toLowerCase().includes("wage")) {
        document.getElementById('wagecontent').textContent = `The awarded ${itemValue} INR`
    } else {
        let newEl = document.createElement("li");
        newEl.textContent = itemValue;

        // Create a delete icon element
        let deleteIcon = document.createElement("span");
        deleteIcon.textContent = "❌"; // You can use any suitable icon or text for deletion
        deleteIcon.style.cursor = "pointer";
        deleteIcon.style.marginLeft = "10px";

        // Add click event listener to the delete icon
        deleteIcon.addEventListener("click", function(event) {
            event.stopPropagation(); // Prevent the click from reaching the li element
            let exactLocationOfItemInDB = ref(database, `ToDoList/${projectId}/${currentDate}/${userId}/${itemID}`);
            remove(exactLocationOfItemInDB);
        });

        // Add the delete icon to the li element
        newEl.appendChild(deleteIcon);

        // Add click event listener to the li element
        newEl.addEventListener("dblclick", function() {
            let exactLocationOfItemInDB = ref(database, `ToDoList/${projectId}/${currentDate}/${userId}/${itemID}`);
            remove(exactLocationOfItemInDB);

            // Push a new item with the value "itemValue-completed"
            push(shoppingListInDB, `${itemValue}-completed`);
        });

        shoppingListEl.appendChild(newEl);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const placeholderValues = [
        "Enter task here",
        "Type your to-do",
        "What's on your mind?",
        "Create a new task",
        "List your action items",
        "Set a goal for today",
        "Draft your task list",
        "Detail your agenda"

    ];
    const inputField = document.getElementById("input-field");
    const addButton = document.getElementById("add-button");

    // Function to set a random placeholder
    function setRandomPlaceholder() {
        const randomIndex = Math.floor(Math.random() * placeholderValues.length);
        inputField.placeholder = placeholderValues[randomIndex];
    }
    setRandomPlaceholder();
    addButton.addEventListener("click", setRandomPlaceholder);
    setInterval(setRandomPlaceholder, 5000);
});

checkStatusButton.addEventListener("click", function() {
    // Redirect to the specified URL
    window.location.href = "checkstatus.html";
});

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("category1Button");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Handle submission of new wage
document.getElementById("submitWage").onclick = function() {
  var newWage = document.getElementById("newWage").value;
  if (newWage !== null && newWage !== "") {
    var category1Button = document.getElementById("category1Button");
    category1Button.dataset.wage = newWage;
    updateDatabase(newWage);
    modal.style.display = "none"; // Close the modal after submission
  }
}

function updateDatabase(newWage) {
   push(shoppingListInDB,`wage-${newWage}`)
}
