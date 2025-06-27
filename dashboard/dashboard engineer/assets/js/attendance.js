import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://j-builders-default-rtdb.firebaseio.com/"
}
const dateKey = new Date().toISOString().split('T')[0];
const app = initializeApp(appSettings)
const database = getDatabase(app)
const UsersDB = ref(database, "usersDB")
const projectId = "BlueTides SiteII"
const AttendanceDB = ref(database,`AttendanceDB/${projectId}/${dateKey}`)
const attendancebtn = document.getElementById('attendanceButton')

    var fixedLocation = {
        latitude: 11.024970547828671,
        longitude: 76.93936556219684,
        radius: 1000
    };

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
    var auth = firebase.auth();

    attendancebtn.addEventListener('click', function() {
  var user = auth.currentUser;

  if (user) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var userLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };

      var distance = getDistance(userLocation, fixedLocation);
      if (distance <= fixedLocation.radius) {
          document.getElementById('message').innerText = 'You are within the attendance location. Attendance marked!';
          saveAttendance()
        }
       else {
        document.getElementById('message').innerText = 'You are outside the attendance location. Attendance not marked.';
      }
    }, function (error) {
      alert('Error getting location: ' + error.message);
    });
  } else {
    alert('Please log in to mark attendance.');
  }
});

    function getDistance(location1, location2) {
        var R = 6371000; // Radius of the earth in meters
        var dLat = deg2rad(location2.latitude - location1.latitude);
        var dLon = deg2rad(location2.longitude - location1.longitude);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(location1.latitude)) * Math.cos(deg2rad(location2.latitude)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var distance = R * c; // Distance in meters
        return distance;
    }

    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
   
let loggedInUser = null;  // Declare in the global scope and initialize with a default value
const saveAttendance = () => {
const fetchLoggedInUser = () => {
    return new Promise((resolve, reject) => {
        onValue(UsersDB, function(snapshot) {
            const currentUser = auth.currentUser;
            const usersArray = Object.values(snapshot.val());

            if (currentUser) {
                loggedInUser = usersArray.find(user => user.userId === currentUser.uid);

                if (loggedInUser) {
                    const loggedInUsername = loggedInUser.username;
                    resolve(loggedInUser); // Resolve the promise with loggedInUser
                } else {
                    reject("Logged-in user not found in the database.");
                }
            } else {
                reject("No user is currently logged in.");
            }
        });
    });
};

fetchLoggedInUser()
    .then(loggedInUser => {
        console.log(loggedInUser.username);
        console.log(loggedInUser.userId);

        // Assuming AttendanceDB is a reference to your Firebase Realtime Database
        onValue(AttendanceDB, function(snapshot) {
            const currentUser = auth.currentUser;

            // Check if snapshot.val() is truthy
            if (snapshot.val()) {
                const attendanceArray = Object.values(snapshot.val());

                // Check for duplication only when there are items in the database
                const existingUser = attendanceArray.find(user => user.userId === loggedInUser.userId);

                if (existingUser) {
                    console.log("User already exists in the database. Skipping attendance push.");
                      // Assuming you want to redirect from current_page.html to target_page.html in a different folder
                      const targetPagePath = 'todo.html?userId='+loggedInUser.userId;
                      window.location.href = targetPagePath;

                } else {
                    const options = { timeZone: 'Asia/Kolkata' };
                    const indianTimestamp = new Date().toLocaleString('en-IN', options);

                    const attendanceObject = {
                        username: loggedInUser.username,
                        userId: loggedInUser.userId,
                        timestamp: indianTimestamp
                    };

                    // Assuming push is a function to add data to your Firebase Realtime Database
                    push(AttendanceDB, attendanceObject);
                    console.log("Attendance pushed successfully.");
                }
            } else {
                // If snapshot.val() is falsy, push the attendanceObject
                const options = { timeZone: 'Asia/Kolkata' };
                const indianTimestamp = new Date().toLocaleString('en-IN', options);

                const attendanceObject = {
                    username: loggedInUser.username,
                    userId: loggedInUser.userId,
                    timestamp: indianTimestamp
                };

                // Assuming push is a function to add data to your Firebase Realtime Database
                push(AttendanceDB, attendanceObject);
                console.log("Attendance pushed successfully.");
            }
        });
    })
    .catch(error => {
        console.error(error);
    });

  }
