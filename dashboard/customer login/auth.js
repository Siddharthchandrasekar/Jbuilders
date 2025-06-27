import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
    let userDetails = {};
const loginEmailInput = document.getElementById('loginEmail');
const loginPasswordInput = document.getElementById('loginPassword');
const loginForm = document.getElementById('loginForm');
const signupEmailInput = document.getElementById('signupEmail');
const signupPasswordInput = document.getElementById('signupPassword');
const signupForm = document.getElementById('signupForm');
const usernameInput = document.getElementById('username');
const userTypeInput = document.getElementById('userType');
const userInfo = document.getElementById('userInfo');

const loginBtn = document.getElementById('loginbtn')
const signupBtn = document.getElementById('signupbtn')
const appSettings = {
  databaseURL: "https://j-builders-default-rtdb.firebaseio.com/"
}
const app = initializeApp(appSettings)
const database = getDatabase(app)
const UsersDB = ref(database, "usersDB")
// Firebase authentication functions
loginBtn.addEventListener('click', function() {
  const email = loginEmailInput.value;
  const password = loginPasswordInput.value;

  firebase.auth().signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    const userId = user.uid; // Get the user's ID
    const userRef = ref(database, `usersDB/`); // Reference to the user's data in the 'usersDB' collection

    onValue(userRef, function(snapshot) {
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const itemData = childSnapshot.val(); // Get the value of the item
          if (itemData.userId === userId) {
            const userType = itemData.userType; // Get the userType of the logged-in user
            console.log('User Type:', userType); // Log userType to see its value
            // Debugging
            console.log('Redirecting to:', userType === "customer" ? 'customer.html?userId='+user.uid : userType === "engineer" ? 'engineer.html?userId='+user.uid : userType === "worker" ? 'worker.html?userId='+user.uid : 'unknown page');
            // End of debugging
            if(userType === "customer"){
              window.location.href = '../dashboard customer/profile.html?userId='+user.uid;
            }
            if(userType === "engineer"){
              window.location.href = '../dashboard engineer/profile.html?userId='+user.uid;
            }
            if(userType === "worker"){
              window.location.href = '../dashboard worker/profile.html?userId='+user.uid;
            }
          }
        });
      } else {
        console.log('User data does not exist');
      }
    }, function(error) {
      console.error('Error fetching user data:', error);
    });
    
  })
  .catch((error) => {
    const errorMessage = error.message;
    displayError(errorMessage);
  });
})


signupBtn.addEventListener('click', function() {
  const email = signupEmailInput.value;
  const password = signupPasswordInput.value;
  const username = usernameInput.value;
  const userType = userTypeInput.value;

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const userId = user.uid; // Access the user ID

      // Populate the userDetails object
      const userDetails = {
        email: email,
        username: username,
        userType: userType,
        userId: userId
      };

      console.log('User Details:', userDetails);
      push(UsersDB, userDetails);
    })
    .catch((error) => {
      const errorMessage = error.message;
      displayError(errorMessage);
    });
});

function displayUserInfo(user) {
  userInfo.innerHTML = `Logged in as: ${user.email}`;
  
  window.location.href = 'index.html?userId='+user.uid;
}

function displayError(errorMessage) {
  userInfo.innerHTML = `<span style="color: red;">Error: ${errorMessage}</span>`;
}