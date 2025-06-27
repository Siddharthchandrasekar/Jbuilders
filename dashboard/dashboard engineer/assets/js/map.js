import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
        import { getDatabase, ref, push, onValue,set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

        const appSettings = {
            databaseURL: "https://j-builders-default-rtdb.firebaseio.com/"
        }
        const dateKey = new Date().toISOString().split('T')[0];
        const app = initializeApp(appSettings)
        const database = getDatabase(app)
        const projectId = "BlueTides SiteII"
        const AttendanceDB = ref(database,`AttendanceDB/${projectId}/${dateKey}`)

        var map = L.map('map').setView([11.0228, 77.0028], 15);
        L.marker([11.0228, 77.0028]).addTo(map).bindPopup("construction Site");
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        let markersLayer = L.layerGroup().addTo(map);

        function addMarkersToMap(data) {
            markersLayer.clearLayers(); // Clear existing markers

            data.forEach(item => {
                const { latitude, longitude, username } = item;
                L.marker([latitude, longitude]).addTo(markersLayer).bindPopup(username);
            });
        }

        // Function to fetch attendance data and add markers to map
        function fetchAttendanceData() {
            onValue(AttendanceDB,snapshot => {
                if (snapshot.exists()) {
                    const attendanceArray = Object.values(snapshot.val());
                    addMarkersToMap(attendanceArray);
                } else {
                    console.log("No attendance data available.");
                }
            }, function(error) {
                console.error("Error fetching attendance data:", error);
            });
        }

        setInterval(fetchAttendanceData, 5000); // Update every 5 seconds