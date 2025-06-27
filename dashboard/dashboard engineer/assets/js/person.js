const firebaseConfig = {
    apiKey: "AIzaSyA_4Lgt18COnZ_dKwtw2bUJET2gXdDgLtU",
    authDomain: "j-builders.firebaseapp.com",
    databaseURL: "https://j-builders-default-rtdb.firebaseio.com",
    projectId: "j-builders",
    storageBucket: "j-builders.appspot.com",
    messagingSenderId: "864477014685",
    appId: "1:864477014685:web:89b310ee371b484fef0274"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Reference to the UsersDB in the Realtime Database
const dateKey = new Date().toISOString().split('T')[0];
const projectId = "BlueTides SiteII"
const UsersDB = firebase.database().ref(`AttendanceDB/${projectId}/${dateKey}`);

// Function to fetch users and display them as cards
// Function to fetch users with attendance state as "Present" and display them as cards
function displayPresentUsers() {
    const userContainer = document.getElementById("userContainer");

    // Listen for changes in the UsersDB
    UsersDB.on("value", (snapshot) => {
        userContainer.innerHTML = ""; // Clear previous content

        // Filter users with attendance state as "Present"
        const presentUsers = Object.values(snapshot.val()).filter(user => user.attendanceState === "Present");

        // Iterate through each present user
        presentUsers.forEach((user) => {
            // Create a card for each user
            const userCard = document.createElement("div");
            userCard.className = "user-card";

            // Create a link to another HTML file (replace 'todo.html' with your actual file)
            const userLink = document.createElement("a");
            userLink.href = "todo.html?userId=" + user.userId; // You can pass parameters in the URL
            userLink.className = "user-link";
            userLink.textContent = user.username;

            // Append the link to the card
            userCard.appendChild(userLink);

            // Append the card to the container
            userContainer.appendChild(userCard);
        });
    });
}

// Call the function to display user cards with attendance state as "Present"
displayPresentUsers();

