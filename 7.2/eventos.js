document.getElementById('div').addEventListener("click", () => {
    alert('Hola! Soy el div')
})

document.getElementById('btn').addEventListener("click", (event) => {
    event.stopPropagation(); // Evita que el click llegue al div
    alert('Hola!');
});