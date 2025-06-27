import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, onValue} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// Replace with your Firebase project configuration
const appSettings = {
    databaseURL: "https://j-builders-default-rtdb.firebaseio.com/",
}

const app = initializeApp(appSettings);
const database = getDatabase(app);
const imageContainer = document.getElementById('imageContainer');
const currentDay = getCurrentDate();
// Adjusted to use the current date and task in the storage path
const projectId = "BlueTides SiteII"
const images = ref(database,`images/${projectId}/${currentDay}/`);

onValue(images, function(snapshot) {
    if (snapshot.exists()) {
        // Clear previous images
        imageContainer.innerHTML = "";

        // Iterate through each image URL
        snapshot.forEach(function(childSnapshot) {
            const imageURL = childSnapshot.val();

            // Create an image element and set its source to the image URL
            const img = document.createElement('img');
            img.src = imageURL;

            // Add the CSS class to the image element
            img.classList.add('image-container');

            // Append the image to the container
            imageContainer.appendChild(img);

            // Add click event listener to each image
            img.addEventListener('click', function() {
                document.getElementById('full-image').setAttribute('src', img.getAttribute('src'));
                document.getElementById('image-viewer').style.display = 'block';
            });
        });
    } else {
        console.log("No images found in the database.");
    }
}, function(error) {
    console.error("Error retrieving images from the database:", error);
});
document.getElementById('goBackButton').addEventListener('click', function() {
window.history.back();
 });

function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
document.getElementById('progressHeading').innerText += ` : ${getCurrentDate()}`;

document.getElementById('close').addEventListener('click', function() {
    document.getElementById('image-viewer').style.display = 'none';
});