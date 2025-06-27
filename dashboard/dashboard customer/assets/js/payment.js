import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, onValue,set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js";

const appSettings = {
    databaseURL: "https://j-builders-default-rtdb.firebaseio.com/",
    storageBucket: "gs://j-builders.appspot.com"
}

const app = initializeApp(appSettings);
const database = getDatabase(app);

const displayListEl = document.getElementById("display-list");
const transactionsListEl = document.getElementById("transactions-list");
const uploadButton = document.getElementById("uploadButton");

let currentTask = "default"; // Initial task, you can set it to the default task

function getUserIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('userId');
}

const userId = getUserIdFromURL();
const dateKey = new Date().toISOString().split('T')[0];
// Display shopping list from the database
const projectId = "BlueTides SiteII"
const shoppingListInDB = ref(database, `PaymentReq/${projectId}/${dateKey}`);



onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val());

        clearDisplayListEl();

        itemsArray.forEach((currentItem, index) => {
            appendItemToDisplayListEl(currentItem, index);
        });

        uploadButton.style.display = "block";
    } else {
        displayListEl.innerHTML = "No pending payments...!";
        uploadButton.style.display = "none";
    }
});

function clearDisplayListEl() {
    displayListEl.innerHTML = "";
}
function handleCardClick(TPurpose, TValue) {
    // Do whatever you need with the details of the clicked card
   
    // You can perform further actions like opening a dialog, updating UI, etc.
}
let globalPurpose;
let globalValue;
function appendItemToDisplayListEl(item, index) {
    let itemID = item[0];
    let itemValue = item[1];

    let TPurpose = itemValue.purpose;
    let TValue = parseInt(itemValue.value);

    let newEl = document.createElement("li");
    newEl.textContent = `Purpose: ${TPurpose}, Value: ${TValue}`;
    newEl.id = `rzp-button${index}`;
    displayListEl.append(newEl);
    if (itemValue.paymentstatus === "successful") {
        newEl.style.display = "none";
    } else {
        newEl.style.backgroundColor = "red";
    }
    newEl.addEventListener("click", function() {
        globalPurpose = TPurpose,
        globalValue = TValue
        console.log(globalPurpose,globalValue)
        var options = {
            key: "rzp_test_KFjxp5z9kWrKGP",
            amount: globalValue*100, 
            currency: "INR",
            name: "JBuilders",
            description: globalPurpose,
            handler: function (response) {
                if (response.razorpay_payment_id) {
                    // Payment successful
                    swal({
                        title: "Success!",
                        text: "Your payment was successful.",
                        icon: "success",
                        button: "Close",
                    }).then(() => {
                        // Update database with payment status
                        const paymentRef = ref(database, `PaymentReq/${projectId}/${dateKey}/${itemID}`);
                        set(paymentRef, {
                            purpose: TPurpose,
                            value: TValue,
                            paymentstatus: "successful"
                        }).then(() => {
                            console.log("Payment status updated successfully.");
                        }).catch((error) => {
                            console.error("Error updating payment status: ", error);
                        });
                    });
                } else {
                    // Payment failed or was canceled
                    swal({
                        title: "Payment Failed",
                        text: "Sorry, we couldn't process your payment. Please try again later.",
                        icon: "error",
                        button: "Close",
                    });
                }
            },
            theme: {
                color: "#3399cc",
            },
            prefill: {
                name: "", // Name of the donor if available
                email: "", // Email of the donor if available
                contact: "", // Contact number of the donor if available
            },
            notes: {
                address: "Donate for a cause", // Additional notes about the purpose of the donation
            },
        };
    
        var rzp1 = new Razorpay(options);
    
        // Function to open the payment dialog
        function openPaymentDialog(e) {
            let target = e.target;
            // Check if the clicked element has an ID starting with "rzp-button"
            if (target.id && target.id.startsWith("rzp-button")) {
                // Dynamically set the amount based on the TValue of the clicked card
                rzp1.open();
            }
        }
            
    document.addEventListener("click", openPaymentDialog);
    });

}
