const API_URL = 'https://japceibal.github.io/japflix_api/movies-data.json';

let movies = [];

// Traer películas al cargar
async function fetchMovies() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Network response was not ok');
        movies = await response.json();
        console.log("Películas cargadas:", movies.length);
    } catch (error) {
        console.error('Error cargando películas:', error);
    }
}

fetchMovies();

const btnBuscar = document.getElementById("btnBuscar");
const inputBuscar = document.getElementById("inputBuscar");
const lista = document.getElementById("lista");

// Función para mostrar estrellas según promedio de votos
function renderStars(vote) {
    let stars = "";
    const rounded = Math.round(vote / 2);
    for (let i = 1; i <= 5; i++) {
        stars += `<span class="fa fa-star ${i <= rounded ? "checked" : ""}"></span>`;
    }
    return stars;
}

// Buscar y renderizar resultados
function searchMovies() {
    const query = inputBuscar.value.trim().toLowerCase();
    lista.innerHTML = "";

    if (!query) return;

    const results = movies.filter(m => {
        return (
            m.title.toLowerCase().includes(query) ||
            m.tagline?.toLowerCase().includes(query) ||
            m.overview?.toLowerCase().includes(query) ||
            m.genres.some(g => g.name.toLowerCase().includes(query))
        );
    });

    if (results.length === 0) {
        lista.innerHTML = `<li class="list-group-item bg-dark text-light">No se encontraron resultados</li>`;
        return;
    }

    results.forEach(movie => {
        const li = document.createElement("li");
        li.className = "list-group-item list-group-item-action bg-dark text-light";
        li.innerHTML = `
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h5>${movie.title}</h5>
          <p class="mb-1"><em>${movie.tagline || ""}</em></p>
        </div>
        <div>${renderStars(movie.vote_average)}</div>
      </div>
    `;
        li.addEventListener("click", () => toggleMovieDetail(li, movie));
        lista.appendChild(li);
    });
};

// Ejecutar búsqueda al hacer click en el botón
btnBuscar.addEventListener("click", () => {
    searchMovies();
});

// Ejecutar búsqueda al presionar Enter en el input
inputBuscar.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        searchMovies();
    }
});


// Mostrar / ocultar detalle
function toggleMovieDetail(li, movie) {
    // Cerrar cualquier detalle abierto
    const openDetail = document.querySelector(".movie-detail");
    if (openDetail) openDetail.remove();

    // Si el detalle ya estaba abierto en este li, no lo volvemos a abrir
    if (li.nextElementSibling && li.nextElementSibling.classList.contains("movie-detail")) {
        return;
    }

    const genres = movie.genres.map(g => g.name).join(" - ");
    const year = movie.release_date.split("-")[0];

    const detail = document.createElement("li");
    detail.className = "list-group-item bg-dark text-light movie-detail";
    detail.innerHTML = `
    <p>${movie.overview}</p>
    <p><strong>Géneros:</strong> ${genres}</p>
    <div class="dropdown">
      <button class="btn btn-sm btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
        Más info
      </button>
      <ul class="dropdown-menu">
        <li class="dropdown-item"><strong>Año:</strong> ${year}</li>
        <li class="dropdown-item"><strong>Duración:</strong> ${movie.runtime} min</li>
        <li class="dropdown-item"><strong>Presupuesto:</strong> $${movie.budget.toLocaleString()}</li>
        <li class="dropdown-item"><strong>Ganancias:</strong> $${movie.revenue.toLocaleString()}</li>
      </ul>
    </div>
  `;

    // Insertar después del li clickeado
    li.insertAdjacentElement("afterend", detail);
}
