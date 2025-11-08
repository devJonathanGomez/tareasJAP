// Espera a que el contenido del DOM esté completamente cargado antes de ejecutar el script.
document.addEventListener('DOMContentLoaded', () => {
    // Obtiene las referencias a los elementos del DOM que se necesitarán.
    const dogImage = document.getElementById('dog-image');
    const optionsContainer = document.getElementById('options-container');
    const currentScoreEl = document.getElementById('current-score');
    const highScoreEl = document.getElementById('high-score');
    const nextButton = document.getElementById('next-button');

    // Variables para mantener el estado del juego.
    let allBreeds = []; // Almacenará la lista de todas las razas de perros.
    let correctBreed = ''; // Almacenará la raza correcta para la ronda actual.
    let currentScore = 0; // Puntuación de la partida actual.
    // Obtiene la puntuación más alta del almacenamiento local, o 0 si no existe.
    let highScore = localStorage.getItem('dogBreedHighScore') || 0;

    // Muestra la puntuación más alta guardada.
    highScoreEl.textContent = highScore;

    // Función asíncrona para obtener la lista de todas las razas de la API.
    async function fetchAllBreeds() {
        try {
            const response = await fetch('https://dog.ceo/api/breeds/list/all');
            const data = await response.json();
            // Extrae los nombres de las razas del objeto de respuesta y los guarda.
            allBreeds = Object.keys(data.message);
        } catch (error) {
            console.error('Error fetching breed list:', error);
            optionsContainer.innerHTML = '<p>No se pudieron cargar las razas. Inténtalo de nuevo más tarde.</p>';
        }
    }

    // Función asíncrona para cargar una nueva imagen de perro y preparar la siguiente pregunta.
    async function loadNewDog() {
        // Limpia las opciones anteriores.
        optionsContainer.innerHTML = '';
        try {
            // Pide una imagen aleatoria a la API.
            const response = await fetch('https://dog.ceo/api/breeds/image/random');
            const data = await response.json();
            const imageUrl = data.message;
            dogImage.src = imageUrl; // Muestra la nueva imagen.

            // Extrae el nombre de la raza de la URL de la imagen.
            correctBreed = getBreedFromUrl(imageUrl);
            
            // Genera las opciones de respuesta (una correcta y tres incorrectas).
            const options = generateOptions(correctBreed);
            // Muestra las opciones en la pantalla.
            displayOptions(options);

        } catch (error) {
            console.error('Error fetching dog image:', error);
        }
    }

    // Función para extraer el nombre de la raza desde la URL de la imagen.
    function getBreedFromUrl(url) {
        const parts = url.split('/');
        // La raza está en el antepenúltimo segmento de la URL. Se reemplazan los guiones por espacios.
        return parts[parts.length - 2].replace(/-/g, ' ');
    }

    // Genera un array de 4 opciones, incluyendo la correcta y 3 aleatorias.
    function generateOptions(correct) {
        const options = new Set([correct]); // Usa un Set para evitar opciones duplicadas.
        // Añade razas aleatorias hasta que haya 4 opciones.
        while (options.size < 4) {
            const randomBreed = allBreeds[Math.floor(Math.random() * allBreeds.length)];
            options.add(randomBreed.replace(/-/g, ' '));
        }
        // Convierte el Set a un array y lo baraja.
        return shuffleArray([...options]);
    }

    // Crea y muestra los botones de opción en el contenedor.
    function displayOptions(options) {
        options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            // Asigna el evento de clic para comprobar la respuesta.
            button.onclick = (e) => checkAnswer(e.target, option);
            optionsContainer.appendChild(button);
        });
    }

    // Función para comprobar si la respuesta seleccionada es correcta.
    function checkAnswer(button, selectedBreed) {
        const buttons = optionsContainer.querySelectorAll('button');
        // Deshabilita todos los botones después de una selección.
        buttons.forEach(btn => btn.disabled = true);

        if (selectedBreed === correctBreed) {
            // Si es correcta, marca el botón en verde e incrementa la puntuación.
            button.classList.add('correct');
            currentScore++;
            currentScoreEl.textContent = currentScore;
            // Si la puntuación actual supera la más alta, la actualiza.
            if (currentScore > highScore) {
                highScore = currentScore;
                highScoreEl.textContent = highScore;
                localStorage.setItem('dogBreedHighScore', highScore);
            }
        } else {
            // Si es incorrecta, marca el botón en rojo y resetea la puntuación.
            button.classList.add('incorrect');
            currentScore = 0;
            currentScoreEl.textContent = currentScore;
            // Muestra cuál era la respuesta correcta.
            buttons.forEach(btn => {
                if (btn.textContent === correctBreed) {
                    btn.classList.add('correct');
                }
            });
        }
        // Muestra el botón "Siguiente".
        nextButton.style.display = 'block';
    }
    
    // Función para barajar un array (algoritmo de Fisher-Yates).
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Evento para el botón "Siguiente", que carga la siguiente pregunta.
    nextButton.addEventListener('click', () => {
        nextButton.style.display = 'none'; // Oculta el botón de nuevo.
        loadNewDog();
    });

    // Función inicial para configurar y empezar el juego.
    async function initGame() {
        nextButton.style.display = 'none'; // Oculta el botón "Siguiente" al inicio.
        await fetchAllBreeds(); // Carga la lista de razas.
        // Si se cargaron las razas, empieza la primera ronda.
        if (allBreeds.length > 0) {
            loadNewDog();
        }
    }

    // Inicia el juego.
    initGame();
});
