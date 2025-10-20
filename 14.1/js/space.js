document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("inputBuscar");
    const searchBtn = document.getElementById("btnBuscar");
    const resultsContainer = document.getElementById("contenedor");

    searchBtn.addEventListener("click", () => {
        const query = searchInput.value;
        if (query) {
            fetchData(query);
        }
    });

    function fetchData(query) {
        const url = `https://images-api.nasa.gov/search?q=${query}`;
        resultsContainer.innerHTML = ""; // Limpiar resultados anteriores
        fetch(url)
            .then(response => response.json())
            .then(data => {
                displayResults(data.collection.items);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                resultsContainer.innerHTML = `<p class="text-danger">An error occurred while fetching data.</p>`;
            });
    }

    function displayResults(items) {
        if (items.length === 0) {
            resultsContainer.innerHTML = `<p>No results found.</p>`;
            return;
        }

        resultsContainer.classList.add("d-flex", "flex-wrap", "row");

        items.forEach(item => {
            const { data, links } = item;
            if (data && data.length > 0 && links && links.length > 0) {
                const { title, description, date_created } = data[0];
                const imageUrl = links[0].href;

                const card = `
                    <div class="col-md-4 mb-4">
                        <div class="card h-100">
                            <img src="${imageUrl}" class="card-img-top" alt="${title}">
                            <div class="card-body">
                                <h5 class="card-title">${title}</h5>
                                <p class="card-text">${description ? description.substring(0, 100) + '...' : 'No description available.'}</p>
                            </div>
                            <div class="card-footer">
                                <small class="text-muted">Date: ${new Date(date_created).toLocaleDateString()}</small>
                            </div>
                        </div>
                    </div>
                `;
                resultsContainer.innerHTML += card;
            }
        });
    }
});
