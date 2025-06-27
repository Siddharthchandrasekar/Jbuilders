import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
    import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

    const firebaseConfig = {
    apiKey: "AIzaSyA_4Lgt18COnZ_dKwtw2bUJET2gXdDgLtU",
    authDomain: "j-builders.firebaseapp.com",
    databaseURL: "https://j-builders-default-rtdb.firebaseio.com",
    projectId: "j-builders",
    storageBucket: "j-builders.appspot.com",
    messagingSenderId: "864477014685",
    appId: "1:864477014685:web:89b310ee371b484fef0274"
  };

    function getUserIdFromURL() {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('userId');
    }
    function getDateFromURL() {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('date');
    }
    
    function retrieveData(userId, date) {
      const firebaseApp = initializeApp(firebaseConfig);
      const database = getDatabase(firebaseApp);
    
      const userRef = ref(database, `Cost Estimation/${userId}`);
    
      onValue(userRef, function(snapshot) {
        if (snapshot.exists()) {
          let itemsArray = Object.entries(snapshot.val());
    
          for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i][1]; // Accessing the object value, not the key
            const isoDate = currentItem.Date; // Extracting date from the current item
            const formattedDate = new Date(isoDate).toLocaleDateString(); // Convert ISO string to a Date object and format it
    
            // Check if the formatted date matches the provided date
            if (formattedDate === date) {
              // Display the date above the table
              const dateHeader = document.createElement('h3');
              dateHeader.textContent = `Date: ${formattedDate}`;
              document.getElementById('contentGoesHere').appendChild(dateHeader);
    
              ['Floor', 'GroundFloor', 'Miscellaneous'].forEach(category => {
                const table = document.createElement('table');
                const thead = document.createElement('thead');
                const tbody = document.createElement('tbody');
                const trCategory = document.createElement('tr');
                const thCategory = document.createElement('th');
                thCategory.colSpan = 4;
                thCategory.textContent = category;
                trCategory.appendChild(thCategory);
                thead.appendChild(trCategory);
    
                const trHeader = document.createElement('tr');
                ['Name', 'Quantity', 'Cost'].forEach(headerText => {
                  const th = document.createElement('th');
                  th.textContent = headerText;
                  trHeader.appendChild(th);
                });
                thead.appendChild(trHeader);
    
                if (currentItem[category]) {
                  currentItem[category].forEach((obj, index) => {
                    const tr = document.createElement('tr');
                    ['name', 'quantity', 'cost'].forEach(prop => {
                      const td = document.createElement('td');
                      td.textContent = obj[prop];
                      tr.appendChild(td);
                    });
                    tbody.appendChild(tr);
                  });
                } else {
                  console.log(`No data found for ${category}`);
                }
    
                table.appendChild(thead);
                table.appendChild(tbody);
                document.getElementById('contentGoesHere').appendChild(table); // Appending table to the div with id "contentGoesHere"
              });
            }
          }
        } else {
          console.log('No data found for the user.');
        }
      }, (error) => {
        console.error('Error retrieving data:', error);
      });
    }
    
    const userId = getUserIdFromURL();
    const dateFromURL = getDateFromURL();
    retrieveData(userId, dateFromURL);
    