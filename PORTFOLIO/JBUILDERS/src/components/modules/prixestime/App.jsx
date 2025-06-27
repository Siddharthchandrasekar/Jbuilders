import React, { useState } from 'react';
import Chart from 'chart.js/auto';

const AppPrix = () => {
  const [projectSqft, setProjectSqft] = useState('');
  const [bhk, setBhk] = useState(1);
  const [numFloors, setNumFloors] = useState('');
  const [costDetails, setCostDetails] = useState(null);

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
    { name: 'Painting', cost : 75000},
        { name: 'Septic Tank', cost : 40000},
        { name: 'Plumbing', cost : 75000},
        { name: 'Electrical', cost : 60000},
  ];

  const calculateCost = () => {
    var gtotalCost = 0;
    var ftotalCost = 0;
    var gmaterialList = '<h2>Ground Floor Materials:</h2><ul>';
    var fmaterialList = '<h2>Floor Materials:</h2><ul>';
  
    gmaterialList += `
<table>
  <tr>
    <th>Component</th>
    <th>Quantity (sqft)</th>
    <th>Cost (₹)</th>
  </tr>
`;

for (var i = 0; i < gmaterials.length; i++) {
  var gmaterial = gmaterials[i];
  var gquantity = gmaterial.quantityPerSqft * projectSqft;
  var gcost = gquantity * gmaterial.pricePerSqft;
  gtotalCost += gcost;
  gmaterialList += `
    <tr>
      <td>${gmaterial.name}</td>
      <td>${gquantity.toFixed(1)} sqft</td>
      <td>₹${gcost.toFixed(1)}</td>
    </tr>
  `;
}

gmaterialList += `</table>`;

  
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

  for (var i = 0; i < fmaterials.length; i++) {
    var fmaterial = fmaterials[i];
    var fquantity = fmaterial.quantityPerSqft * projectSqft * numFloors;
    var fcost = fquantity * fmaterial.pricePerSqft;
    ftotalCost += fcost;

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

  
    // Calculate the additional bedroom cost
    var bhkCost = bhk * 20000;
  
    // Calculate the total cost
    var totalCost = gtotalCost + ftotalCost + bhkCost;
  
    // Display the result
    var costDetailsElement = document.getElementById('costDetails');
    costDetailsElement.innerHTML = `
      <h2>Total Cost Estimate:</h2>
      <table>
        <tr><th>Component</th><th>Cost (₹)</th></tr>
        <tr><td>Ground Floor Materials</td><td>₹${gtotalCost.toFixed(1)}</td></tr>
        ${numFloors > 1 ? `<tr><td>Floor Materials</td><td>₹${ftotalCost.toFixed(1)}</td></tr>` : ''}
        <tr><td>Bedroom Cost</td><td>₹${bhkCost.toFixed(1)}</td></tr>
        <tr><th>Total Cost</th><th>₹${totalCost.toFixed(1)}</th></tr>
      </table>
      <h2>Material Details:</h2>
      
      <tr><th>${gmaterialList}</th></tr>
      <tr><th> ${numFloors > 1 ? fmaterialList : ''} </tr></th>
    `;
  
    // Create a pie chart
    const pieChartLabels = [];
    const pieChartData = [];
  
    gmaterials.forEach((gmaterial) => {
      pieChartLabels.push(gmaterial.name);
      pieChartData.push(gmaterial.quantityPerSqft * projectSqft * gmaterial.pricePerSqft);
    });
  
    if (numFloors > 1) {
      fmaterials.forEach((fmaterial) => {
        pieChartLabels.push(fmaterial.name);
        pieChartData.push(fmaterial.quantityPerSqft * projectSqft * fmaterial.pricePerSqft * numFloors);
      });
    }
  
    // Create a chart context for the pie chart
    const pieChartCtx = document.getElementById('costPieChart').getContext('2d');
  
    // Create a pie chart
    const pieChart = new Chart(pieChartCtx, {
      type: 'pie',
      data: {
        datasets: [
          {
            data: pieChartData,
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)', // Red
              'rgba(54, 162, 235, 0.6)', // Blue
              'rgba(255, 206, 86, 0.6)', // Yellow
              'rgba(75, 192, 192, 0.6)', // Green
              'rgba(153, 102, 255, 0.6)', // Purple
              'rgba(255, 159, 64, 0.6)', // Orange
              // Add more colors as needed
            ],
          },
        ],
        labels: pieChartLabels,
      },
    });
  };

  return (
    <div className="container">
      <h1>Construction Cost Estimation Tool</h1>
      <div className="input-container">
        <label htmlFor="projectSqft">Total Square Feet:</label>
        <input
          type="number"
          id="projectSqft"
          placeholder="Enter project square feet"
          value={projectSqft}
          onChange={(e) => setProjectSqft(e.target.value)}
        />
      </div>
      <div className="input-container">
        <label htmlFor="bhk">Bedrooms (BHK):</label>
        <select value={bhk} onChange={(e) => setBhk(e.target.value)}>
          <option value="1">1 BHK</option>
          <option value="2">2 BHK</option>
          <option value="3">3 BHK</option>
          {/* Add more options as needed */}
        </select>
      </div>
      <div className="input-container">
        <label htmlFor="numFloors">Number of Floors:</label>
        <input
          type="number"
          id="numFloors"
          placeholder="Enter number of floors"
          value={numFloors}
          onChange={(e) => setNumFloors(e.target.value)}
        />
      </div>
      <button onClick={calculateCost}>Calculate</button>
      <div id="costDetails">
        {costDetails}
        {/* Cost details will be displayed here */}
      </div>
      <>
      <div>
        <h1 id="title">Graphical Representation</h1>
        <canvas id="costPieChart" style={{ width: '400px', height: '300px' }} />
      </div>
      </>
    </div>
  );
};

export default AppPrix;
