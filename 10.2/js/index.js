// Guardar el valor del input en localStorage
const inputText = document.getElementById('inputText');
const buttonText = document.getElementById('buttonText');
buttonText.addEventListener('click', () => {
  localStorage.setItem('inputValue', inputText.value);
});