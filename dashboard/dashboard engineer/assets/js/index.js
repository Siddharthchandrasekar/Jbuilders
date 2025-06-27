import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getDatabase, ref, push, onValue } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';

const appSettings = {
  databaseURL: 'https://j-builders-default-rtdb.firebaseio.com/',
};
function getUserIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('userId');
}

const userId = getUserIdFromURL();
const app = initializeApp(appSettings);
const database = getDatabase(app);
const userDB = ref(database, `Cost Estimation/${userId}`); // Use 'Users' as a parent node

  const calculateCostbtn = document.getElementById('calculateCostbtn');
  const saveToFirebasebtn = document.getElementById('saveToFirebasebtn');

const projectSqftInput = document.getElementById('projectSqft');
const bhkSelect = document.getElementById('bhk');
const numFloorsInput = document.getElementById('numFloors');

  const gmaterials = [
    { name: 'Excavation', quantityPerSqft:1.095, pricePerSqft: 22 },
    { name: 'PCC : 1:5:10', quantityPerSqft:0.1825, pricePerSqft: 175 },
    { name: 'Column Footing', quantityPerSqft:0.28125, pricePerSqft: 500 },
    { name: 'Column Concrete', quantityPerSqft:0.1815, pricePerSqft: 750 },
    { name: 'Plinth Beam', quantityPerSqft:0.1644, pricePerSqft: 740 },
    { name: 'Lintel Beam', quantityPerSqft:0.07889, pricePerSqft: 740 },
    { name: 'Sunshade and Loft', quantityPerSqft: 0.1463, pricePerSqft: 220 },
    { name: 'Roof Beam', quantityPerSqft: 0.1644, pricePerSqft: 750 },
    { name: 'Roof slab', quantityPerSqft: 0.3060, pricePerSqft: 690 },
    { name: 'Fitting,gravel and consolidation', quantityPerSqft: 2.053, pricePerSqft: 35 },
    { name: 'Brick Work: 1:6', quantityPerSqft: 1.338, pricePerSqft: 270 },
    { name: 'Inner Wall Plastering', quantityPerSqft: 1.323, pricePerSqft: 40 },
    { name: 'Outer Wall Plastering', quantityPerSqft: 1.205, pricePerSqft: 45 },
    { name: 'Ceiling plastering: 1:3', quantityPerSqft: 0.8517, pricePerSqft: 45 },
    { name: 'Front Door', quantityPerSqft: 0.0332, pricePerSqft: 2500 },
    { name: 'Bedroom door Frame', quantityPerSqft: 0.0399, pricePerSqft: 850 },
    { name: 'UPVC Frames', quantityPerSqft: 0.1035, pricePerSqft: 890 },
    { name: 'Floor Tiles', quantityPerSqft: 0.7072, pricePerSqft: 120 },
    { name: 'Kitchen tiles', quantityPerSqft: 0.0341, pricePerSqft: 120 },
    { name: 'Bathroom tiles', quantityPerSqft: 0.1252, pricePerSqft: 120 }
  ];

  const fmaterials = [
    { name: 'RCC column', quantityPerSqft: 0.1385, pricePerSqft: 760 },
        { name: 'Lintel Beam', quantityPerSqft: 0.0702, pricePerSqft: 750 },
        { name: 'Sunshade and Loft', quantityPerSqft: 0.1053, pricePerSqft: 230 },
        { name: 'Roof Beam', quantityPerSqft: 0.1644, pricePerSqft: 760 },
        { name: 'Roof slab', quantityPerSqft: 0.3060, pricePerSqft: 710 },
        { name: 'Brick Work: 1:6', quantityPerSqft: 1.1461, pricePerSqft: 285 },
        { name: 'Ceiling Plastering', quantityPerSqft: 1.1195, pricePerSqft: 47 },
        { name: 'Inner Wall Plastering', quantityPerSqft: 1.9544, pricePerSqft: 42 },
        { name: 'Outer Wall Plastering', quantityPerSqft: 1.8861, pricePerSqft: 45 },
        { name: 'Floor Tiles', quantityPerSqft: 0.6053, pricePerSqft: 120 },
        { name: 'Front Door', quantityPerSqft: 0.03320, pricePerSqft: 2500 },
        { name: 'UPVC Glass windows', quantityPerSqft: 0.111, pricePerSqft: 900 },
        { name: 'Parapet Wall', quantityPerSqft: 0.3444, pricePerSqft: 150 }
  ];
  const miscellaneous = [
    { name: 'Painting', cost: 75000 },
    { name: 'Septic Tank', cost: 40000 },
    { name: 'Plumbing', cost: 75000 },
    { name: 'Electrical', cost: 60000 },
    { name: 'Bedroom Cost', cost: bhkSelect.value * 20000 },
  ];
  let floorMat=[];
  let groundMat=[];
  let miscellaneousMat=[];

  calculateCostbtn.addEventListener('click', function () {
    const projectSqft = parseFloat(projectSqftInput.value);
    const bhk = parseInt(bhkSelect.value);
    const numFloors = parseInt(numFloorsInput.value);

    let gtotalCost = 0;
    let ftotalCost = 0;
    let gmaterialList = '<h2>Ground Floor Materials:</h2><ul>';
    let fmaterialList = '<h2>Floor Materials:</h2><ul>';

    
    let gmaterialListHTML = `
      <table>
        <thead>
          <tr>
            <th>Component</th>
            <th>Quantity (sqft)</th>
            <th>Cost (₹)</th>
          </tr>
        </thead>
        <tbody>
    `;

    for (let i = 0; i < gmaterials.length; i++) {
      const gmaterial = gmaterials[i];
      const gquantity = gmaterial.quantityPerSqft * projectSqft;
      const gcost = gquantity * gmaterial.pricePerSqft;
      gtotalCost += gcost;

      const materialDetails = {
        name: gmaterial.name,
        quantity: gquantity.toFixed(1) + ' sqft',
        cost: '₹' + gcost.toFixed(1),
        Total_cost: gtotalCost.toFixed(1),
      };
      groundMat.push(materialDetails)
      gmaterialListHTML += `
        <tr>
          <td>${gmaterial.name}</td>
          <td>${gquantity.toFixed(1)} sqft</td>
          <td>₹${gcost.toFixed(1)}</td>
        </tr>
      `;
    }

    gmaterialListHTML += `</tbody></table>`;
    gmaterialList += gmaterialListHTML;

    if (numFloors > 1) {
      fmaterialList += `
        <table>
          <thead>
            <tr>
              <th>Component</th>
              <th>Quantity (sqft)</th>
              <th>Unit Price (₹/sqft)</th>
              <th>Cost (₹)</th>
            </tr>
          </thead>
          <tbody>
      `;

      for (let i = 0; i < fmaterials.length; i++) {
        const fmaterial = fmaterials[i];
        const fquantity = fmaterial.quantityPerSqft * projectSqft * numFloors;
        const fcost = fquantity * fmaterial.pricePerSqft;
        ftotalCost += fcost;

        const materialInfo = {
          name: fmaterial.name,
          quantity: fquantity.toFixed(1) + ' sqft',
          cost: '₹' + fcost.toFixed(1),
          Total_cost: ftotalCost.toFixed(1),
        };
        floorMat.push(materialInfo);

        fmaterialList += `
          <tr>
            <td>${fmaterial.name}</td>
            <td>${fquantity.toFixed(1)} sqft</td>
            <td>₹${fmaterial.pricePerSqft.toFixed(1)}</td>
            <td>₹${fcost.toFixed(1)}</td>
          </tr>
        `;

      }

      fmaterialList += `</tbody></table>`;
    }

    let miscellaneousTotalCost = 0;

    let miscellaneousList = '';
    for (let i = 0; i < miscellaneous.length; i++) {
      const mname = miscellaneous[i].name;
      const mcost = miscellaneous[i].cost;

      miscellaneousList += `
        <tr>
          <td>${mname}</td>
          <td>${mcost}</td>
        </tr>
      `;
      miscellaneousTotalCost += parseInt(mcost); // Assuming cost is in integer format
      const material = {
        name: mname,
        cost: mcost,
        Total_cost: miscellaneousTotalCost,
      };
      miscellaneousMat.push(material);

    }

    // Calculate the additional bedroom cost
    const bhkCost = bhk * 20000;

    // Calculate the total cost
    const totalCost = gtotalCost + ftotalCost + miscellaneousTotalCost;

    // Display the result
    const costDetailsElement = document.getElementById('costDetails');
    costDetailsElement.innerHTML = `
      <h2>Total Cost Estimate:</h2>
      <table>
        <tr><th>Component</th><th>Cost (₹)</th></tr>
        <tr><td>Ground Floor Materials</td><td>₹${gtotalCost.toFixed(1)}</td></tr>
        ${numFloors > 1 ? `<tr><td>Floor Materials</td><td>₹${ftotalCost.toFixed(1)}</td></tr>` : ''}
        <tr><td>Miscellaneous Materials</td><td>₹${miscellaneousTotalCost.toFixed(1)}</td></tr>
        <tr><td>Bedroom Cost</td><td>₹${bhkCost.toFixed(1)}</td></tr>
        <tr><th>Total Cost</th><th>₹${totalCost.toFixed(1)}</th></tr>
      </table>
      ${gmaterialList}
      ${numFloors > 1 ? `${fmaterialList}` : ''}
      <h2>Miscellaneous Materials:</h2>
      <table>
        <thead>
          <tr>
            <th>Component</th>
            <th>Cost (₹)</th>
          </tr>
        </thead>
        <tbody>
          ${miscellaneousList}
        </tbody>
      </table>
    `;

});

saveToFirebasebtn.addEventListener('click', function () {
  // Check if there is data to save
  if (
    Object.keys(groundMat).length === 0 &&
    Object.keys(floorMat).length === 0 &&
    Object.keys(miscellaneousMat).length === 0
  ) {
    // Display a message if the table is empty
    alert('Table is empty. Nothing to save.');
    return;
  }

  // Prepare the data structure to be saved
  const dataToSave = {};

  // Save ground materials under 'GroundFloor' key
  if (Object.keys(groundMat).length > 0) {
    dataToSave.GroundFloor = groundMat;
  }

  // Save floor materials under 'Floor' key
  if (Object.keys(floorMat).length > 0) {
    dataToSave.Floor = floorMat;
  }

  // Save miscellaneous materials under 'Miscellaneous' key
  if (Object.keys(miscellaneousMat).length > 0) {
    dataToSave.Miscellaneous = miscellaneousMat;
  }

  // Add the current date to the data
  const currentDate = new Date().toISOString();
  dataToSave.Date = currentDate;

  // Save the data to Firebase under the user's ID
  push(userDB, dataToSave);

  // Display a success message (you can customize this message)
  alert('Data saved successfully!');
});

