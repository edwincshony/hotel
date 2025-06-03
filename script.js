function calculateCost(weightInGrams) {
  const pricePerKg = parseFloat(document.getElementById("pricePerKg").value);
  if (isNaN(pricePerKg) || pricePerKg <= 0) {
    alert("Please enter a valid price per kilogram.");
    return;
  }

  const pricePerGram = pricePerKg / 1000;
  const total = pricePerGram * weightInGrams;

  document.getElementById("totalCost").textContent = total.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  });
}

// Weight buttons
document.querySelectorAll(".buttons button").forEach(button => {
  button.addEventListener("click", () => {
    const weight = parseFloat(button.dataset.weight);
    calculateCost(weight);
  });
});

// Custom gram input
document.getElementById("calculateCustom").addEventListener("click", () => {
  const customWeight = parseFloat(document.getElementById("customGrams").value);
  if (isNaN(customWeight) || customWeight <= 0) {
    alert("Please enter a valid custom gram value.");
    return;
  }
  calculateCost(customWeight);
});
