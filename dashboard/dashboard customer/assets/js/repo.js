import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { getUserId } from './global.js';

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
  return urlParams.get('date'); // Expected format: YYYY-MM-DD
}

const siteName = "BlueTides SiteII";

function retrieveData(userId, date) {
  const firebaseApp = initializeApp(firebaseConfig);
  const database = getDatabase(firebaseApp);
  const userRef = ref(database, `Cost Estimation/${siteName}/${userId}/${date}`);

  onValue(userRef, function(snapshot) {
    if (snapshot.exists()) {
      const records = snapshot.val();
      const contentContainer = document.getElementById('contentGoesHere');
      contentContainer.innerHTML = ''; // Clear previous content

      const dateHeader = document.createElement('h3');
      dateHeader.textContent = `Date: ${date}`;
      contentContainer.appendChild(dateHeader);

      Object.entries(records).forEach(([recordId, recordData]) => {
        const recordHeader = document.createElement('h4');
        recordHeader.textContent = `Record ID: ${recordId}`;
        contentContainer.appendChild(recordHeader);

        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        // Create table header
        const trHeader = document.createElement('tr');
        ['Category', 'Name', 'Quantity', 'Cost'].forEach(headerText => {
          const th = document.createElement('th');
          th.textContent = headerText;
          trHeader.appendChild(th);
        });
        thead.appendChild(trHeader);

        // Populate table rows
        for (const category of ['Floor', 'GroundFloor', 'Miscellaneous']) {
          if (recordData[category]) {
            recordData[category].forEach(obj => {
              const tr = document.createElement('tr');

              const categoryCell = document.createElement('td');
              categoryCell.textContent = category;
              tr.appendChild(categoryCell);

              ['name', 'quantity', 'cost'].forEach(prop => {
                const td = document.createElement('td');
                td.textContent = obj[prop] || '-'; // Fallback to '-' if missing
                tr.appendChild(td);
              });

              tbody.appendChild(tr);
            });
          }
        }

        table.appendChild(thead);
        table.appendChild(tbody);
        contentContainer.appendChild(table);
      });
    } else {
      document.getElementById('contentGoesHere').innerHTML = "<p>No records found for this date.</p>";
    }
  }, (error) => {
    console.error('Error retrieving data:', error);
  });
}


const userId = getUserId();
const dateFromURL = getDateFromURL();
retrieveData(userId, dateFromURL);
