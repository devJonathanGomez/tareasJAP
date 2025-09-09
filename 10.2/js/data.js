// Mostras dato guardado en localStorage
const displayText = document.getElementById('data');
displayText.textContent = localStorage.getItem('inputValue');