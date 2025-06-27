import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, onValue, push } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
    databaseURL: "https://j-builders-default-rtdb.firebaseio.com/",
}

const app = initializeApp(appSettings);
const database = getDatabase(app);

const displayListEl = document.getElementById("display-list");
const imageInput = document.getElementById("imageInput");
const uploadButton = document.getElementById("uploadButton");

let currentDay = getCurrentDate(); // Get the current date in YYYY-MM-DD format

// Function to get the current date in YYYY-MM-DD format
function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getUserIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('userId');
}

const userId = 'uid3';
const currentDate = new Date().toISOString().slice(0, 10);

// Display shopping list from the database
const projectId = "BlueTides SiteII"
const shoppingListInDB = ref(database,`ToDoList/${projectId}/${currentDate}/${userId}`);

onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val());

        clearDisplayListEl();

        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i];
            let currentItemID = currentItem[0];
            let currentItemValue = currentItem[1];

            appendItemToDisplayListEl(currentItem);
        }
        uploadButton.style.display = "block";
    } else {
        displayListEl.innerHTML = "No tasks to do...!";
        uploadButton.style.display = "none";
    }
});

function clearDisplayListEl() {
    displayListEl.innerHTML = "";
}

function appendItemToDisplayListEl(item) {
    let itemID = item[0];
    let itemValue = item[1];

    let newEl = document.createElement("li");
    newEl.textContent = itemValue;

    displayListEl.append(newEl);
}

// Listen for file selection and upload to Firebase Realtime Database
uploadButton.addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default behavior
    imageInput.click(); // Trigger file input click event
});

imageInput.addEventListener("change", function(event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function(event) {
            const imageData = event.target.result;

            // Update the database with the image data
            const projectId = "BlueTides SiteII"
            push(ref(database, `images/${projectId}/${currentDay}`),imageData).then(() => {
                console.log('Image data uploaded successfully');
            }).catch((error) => {
                console.error('Error uploading image data:', error);
            });
        };

        // Read the file as a data URL (Base64 encoded string)
        reader.readAsDataURL(file);
    }
});


// Function to switch to a new task
function switchTask(newTask) {
    currentTask = newTask;
    currentDay = getCurrentDate(); // Reset the current day when switching to a new task
}
