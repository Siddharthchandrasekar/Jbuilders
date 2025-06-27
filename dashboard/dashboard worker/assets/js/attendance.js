import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue,set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
import "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js" 
import { setUserId, getUserId,clearUserId } from "./global.js";

const appSettings = {
    databaseURL: "https://j-builders-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const UsersDB = ref(database, "usersDB")
const dateKey = new Date().toISOString().split('T')[0];
const projectId = "BlueTides SiteII"
const AttendanceDB = ref(database,`AttendanceDB/${projectId}/${dateKey}`)
const attendancebtn = document.getElementById('attendanceButton')


const firebaseConfig = {
    apiKey: "AIzaSyA_4Lgt18COnZ_dKwtw2bUJET2gXdDgLtU",
    authDomain: "j-builders.firebaseapp.com",
    databaseURL: "https://j-builders-default-rtdb.firebaseio.com",
    projectId: "j-builders",
    storageBucket: "j-builders.appspot.com",
    messagingSenderId: "864477014685",
    appId: "1:864477014685:web:89b310ee371b484fef0274"
  };

var map = L.map('map').setView([11.0228, 77.0028], 15); // Example coordinates for Coimbatore, India

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Initialize marker for fixed location (construction site)
var constructionSiteMarker = L.marker([11.0228, 77.0028]).addTo(map);

// Initialize marker for live location
var liveLocationMarker;

// Initialize polyline
var polyline;

// Function to update live location
function updateLiveLocation(latitude, longitude) {
    // Remove previous marker (if any)
    if (typeof liveLocationMarker !== 'undefined') {
        map.removeLayer(liveLocationMarker);
    }

    // Remove previous polyline (if any)
    if (typeof polyline !== 'undefined') {
        map.removeLayer(polyline);
    }

    // Create new marker for live location
    liveLocationMarker = L.marker([latitude, longitude]).addTo(map);

    // Update polyline with custom styles
    polyline = L.polyline([[latitude, longitude], [11.0228, 77.0028]], {
        color: 'green',  // Line color
        weight: 3,      // Line width
        opacity: 1,   // Line opacity
    }).addTo(map);
}

// Function to check if device is within the fixed location radius
function checkAttendance(latitude, longitude) {
    // Fixed location coordinates (construction site)
    var constructionSiteCoords = L.latLng(11.0228, 77.0028);

    // Calculate distance between current location and construction site
    var distance = constructionSiteCoords.distanceTo([latitude, longitude]);
    var attendanceState = ""
    // Check if distance is within 200 meters
    if (distance <= 1000000000000000000000000) {
        console.log("Attendance marked: Present")
        attendanceState = "Present"
        saveAttendance(latitude,longitude,attendanceState)
        setTimeout(() => {
            // Redirect to another page here
           window.location.href = "./tasktodo.html";
        }, 3000);
    } else {
        console.log("Attendance marked: Absent");
        attendanceState = "Absent"
        saveAttendance(latitude,longitude,attendanceState)
    }
    
}

// Function to fetch device's live location using Geolocation API
function fetchLiveLocation() {
    navigator.geolocation.getCurrentPosition(function(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
      
        // Update live location marker
        updateLiveLocation(latitude, longitude);
        
        // Check attendance based on current location
        checkAttendance(latitude, longitude);
    }, function(error) {
        console.error('Error fetching location:', error);
    });

}

setInterval(fetchLiveLocation, 5000); // Update every 5 seconds

// Function to get query parameters from URL
function getQueryParams(url) {
    const queryParams = {};
    const urlParams = new URLSearchParams(url.search);
    for (const [key, value] of urlParams.entries()) {
        queryParams[key] = value;
    }
    return queryParams;
}

// Get current URL
const currentUrl = new URL(window.location.href);

// Get user ID from query parameters
const userId = getUserId();

// Now you can use the userId variable in your code
console.log("User ID:", userId);

function saveAttendance(latitude, longitude, attendanceState) {
    const userId = getUserId(); // Replace with actual user ID
    const username = "rahul"; // Replace with actual username
    const dateKey = new Date().toISOString().split('T')[0];

    const options = { timeZone: 'Asia/Kolkata' };
    const indianTimestamp = new Date().toLocaleString('en-IN', options);

    // Listen for the value only once
    onValue(AttendanceDB, snapshot => {
        if (snapshot.exists()) {
            const attendanceArray = snapshot.val() ? Object.values(snapshot.val()) : [];
            const existingUser = attendanceArray.find(item => item.userId === userId);
            let userFound = false;

            snapshot.forEach(childSnapshot => {
                const itemId = childSnapshot.key;
                const itemData = childSnapshot.val();

                if (itemData.userId === userId) {
                    userFound = true;

                    if (itemData.attendanceState !== attendanceState||itemData.latitude !== latitude||itemData.longitude !== longitude) {
                        const updatedAttendanceObject = {
                            ...itemData,
                            latitude: latitude,
                            longitude: longitude,
                            timestamp: indianTimestamp,
                            attendanceState: attendanceState
                        };

                        const Dbref = ref(database, `AttendanceDB/${projectId}/${dateKey}/${itemId}`);
                        set(Dbref, updatedAttendanceObject)
                            .then(() => {
                                console.log("Attendance state updated successfully.");
                                console.log("User data updated");
                            })
                            .catch(error => {
                                console.error("Error updating attendance state:", error);
                            });
                    } else {
                        console.log("Attendance state unchanged.");
                        console.log("User data not updated");
                    }
                }
            });

            if (!userFound) {
                const attendanceObject = {
                    username: username,
                    userId: userId,
                    latitude: latitude,
                    longitude: longitude,
                    timestamp: indianTimestamp,
                    attendanceState: attendanceState
                };

                push(AttendanceDB, attendanceObject)
                    .then(() => {
                        console.log("Attendance marked successfully.");
                        console.log("New user data added");
                    })
                    .catch(error => {
                        console.error("Error marking attendance:", error);
                    });
            }
        } else {
            // If there's no data, add a new entry for the current user
            const attendanceObject = {
                username: username,
                userId: userId,
                latitude: latitude,
                longitude: longitude,
                timestamp: indianTimestamp,
                attendanceState: attendanceState
            };
            const dateRef = ref(database, `AttendanceDB/${projectId}/${dateKey}`);
            push(dateRef, attendanceObject)
                .then(() => {
                    console.log("Attendance marked successfully.");
                    console.log("New user data added");
                })
                .catch(error => {
                    console.error("Error marking attendance:", error);
                });
        }
    });
}


