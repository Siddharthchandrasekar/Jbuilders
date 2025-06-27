import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
import { setUserId, getUserId } from "./global.js";
const appSettings = {
  databaseURL: "https://j-builders-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const UsersDB = ref(database, "usersDB/")
// Function to get userId from URL
function checkAndStoreUserId() {
  const params = new URLSearchParams(window.location.search);
  const idFromURL = params.get("userId");

  if (idFromURL) {
    setUserId(idFromURL); // Store it once in localStorage
    console.log("User ID stored:", idFromURL);
  }
}

// Run the function once at login
checkAndStoreUserId();

const userId = getUserId();
console.log("Stored User ID:", userId);
// Function to fetch user data from Realtime Database
function fetchUserData() {
  if (!userId) {
    console.log("No userId found in URL!");
    return;
  }

  onValue(UsersDB, (snapshot) => {
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const userData = childSnapshot.val();
        if (userData.userId === userId) {
          document.getElementById("name").value = userData.name;
          document.getElementById("email").value = userData.email;
          document.getElementById("number").value = userData.phoneNumber;
          document.getElementById("dob").value = userData.dateOfBirth;
          document.getElementById("usertype").value = userData.userType;
          document.getElementById("preview").src = userData.image || "https://tse3.mm.bing.net/th?id=OIP.Cl56H6WgxJ8npVqyhefTdQHaHa&pid=Api&P=0&h=180";
          console.log("User data fetched successfully!");
        }
      });
    } else {
      console.log("No user data found!");
    }
  }, (error) => {
    console.log("Error fetching user data:", error);
  });
}

setTimeout(fetchUserData, 500);

document.getElementById("update").addEventListener("click", function () {
  if (!userId) {
    console.log("No userId found in URL!");
    document.getElementById("msg").innerHTML = "User ID not found!";
    return;
  }

  onValue(UsersDB, (snapshot) => {
    if (snapshot.exists()) {
      let userFound = false;
      snapshot.forEach((childSnapshot) => {
        const userData = childSnapshot.val();
        const itemId = childSnapshot.key;
        const Dbref = ref(database, `usersDB/${itemId}`);
        if (userData.userId === userId) {
          userFound = true;
          const name = document.getElementById("name").value;
          const email = document.getElementById("email").value;
          const phoneNumber = document.getElementById("number").value;
          const dateOfBirth = document.getElementById("dob").value;
          const userType = document.getElementById("usertype").value;
          const image = document.getElementById("preview").src;

          set(Dbref, {
            name,
            userId,
            email,
            phoneNumber,
            dateOfBirth,
            userType,
            image
          })
            .then(() => {
              console.log("User data updated successfully!");
              document.getElementById("msg").innerHTML = "Details updated successfully!";
            })
            .catch((error) => {
              console.error("Error updating user data:", error);
              document.getElementById("msg").innerHTML = "Error updating details!";
            });
        }
      });

      if (!userFound) {
        console.log("User data not found!");
        document.getElementById("msg").innerHTML = "User data not found!";
      }
    } else {
      console.log("No user data found!");
      document.getElementById("msg").innerHTML = "No user data found!";
    }
  }, (error) => {
    console.log("Error fetching user data:", error);
    document.getElementById("msg").innerHTML = "Error fetching user data!";
  });
});
