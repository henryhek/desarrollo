document.addEventListener('DOMContentLoaded', async function () {
    const cardContainer = document.getElementById('card-container');
    const paginationContainer = document.getElementById('pagination-container');
    const cardsPerPage = 10;
    let currentPage = 1;
    let mentoras = [];

    async function obtenerDatos() {
        try {
            const response = await fetch('https://script.google.com/macros/s/AKfycbylp0BERX-tiQAJEsQz76D8Kjgd8uUAMXKa3KLHBJfPoegPl4k2qzr91ItEONqu5lZsHg/exec');
            const data = await response.json();
            
            console.log("Primera fila de datos recibida:", data[0]);

            mentoras = data.map(row => {
                // Extraemos todas las llaves reales que nos manda el script
                const llaves = Object.keys(row);
                
                // Buscamos la llave correcta ignorando mayúsculas y espacios fantasmas (.trim())
                const llaveNombre = llaves.find(k => k.toLowerCase().trim() === 'nombre');
                const llaveProfesion = llaves.find(k => k.toLowerCase().trim() === 'profesión' || k.toLowerCase().trim() === 'profesion');
                const llaveCargo = llaves.find(k => k.toLowerCase().trim() === 'empresa-cargo' || k.toLowerCase().trim() === 'empresa_cargo');
                const llaveEmpresa = llaves.find(k => k.toLowerCase().trim() === 'perfil');
                
                // Aquí atrapamos la columna de fotos sin importar cómo llegue
                const llaveFoto = llaves.find(k => k.toLowerCase().trim() === 'fotos' || k.toLowerCase().trim() === 'foto');

                return {
                    mentora: llaveNombre ? row[llaveNombre] : '',
                    profesion: llaveProfesion ? row[llaveProfesion] : '',
                    cargo: llaveCargo ? row[llaveCargo] : '',
                    empresa: llaveEmpresa ? row[llaveEmpresa] : '',
                    foto: llaveFoto ? row[llaveFoto] : undefined
                };
            });

            mostrarMentoras();
        } catch (error) {
            console.error('Error al cargar los datos de Google Sheets:', error);
        }
    }

    function crearCarta(mentoraNombre, profesion, cargo, empresa, fotoRuta) {
    const card = document.createElement('div');
    card.classList.add('card');

    const bgDiv = document.createElement('div');
    bgDiv.classList.add('bg-image');
    
    if (fotoRuta && fotoRuta.trim() !== "") {
        bgDiv.style.backgroundImage = `url('https://hely.com.co/mrb/tarjetas/${fotoRuta.trim()}')`;
    } else {
        bgDiv.style.backgroundImage = `url('https://hely.com.co/mrb/tarjetas/assets/fotos/default.png')`;
    }

    // Creamos una sola línea combinada
    let infoSubtitulo = profesion ? profesion : '';
    if (cargo) {
        // Si ya hay profesión, le pone el guion intermedio; si no, solo pone el cargo
        infoSubtitulo += infoSubtitulo ? ` - ${cargo}` : cargo; 
    }

    card.innerHTML = `
        <div class="textos-card">
            <h3 class="nombre">${mentoraNombre || ''}</h3>
            <p class="profesion-cargo">${infoSubtitulo}</p> 
        </div>
    `;

    card.prepend(bgDiv);
    return card;
}

    function mostrarMentoras(page = 1) {
        cardContainer.innerHTML = '';
        const start = (page - 1) * cardsPerPage;
        const end = start + cardsPerPage;
        const mentorasPagina = mentoras.slice(start, end);

        mentorasPagina.forEach(item => {
            // Pasamos la variable item.foto a la función
            const card = crearCarta(item.mentora, item.profesion, item.cargo, item.empresa, item.foto);
            cardContainer.appendChild(card);
        });

        renderPaginacion(page);
    }

    function renderPaginacion(page) {
        const totalPages = Math.ceil(mentoras.length / cardsPerPage);
        paginationContainer.innerHTML = '';

        const prevBtn = document.createElement('button');
        prevBtn.textContent = 'Anterior';
        prevBtn.disabled = page === 1;
        prevBtn.onclick = () => cambiarPagina(page - 1);
        paginationContainer.appendChild(prevBtn);

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.textContent = i;
            if (i === page) btn.classList.add('active');
            btn.onclick = () => cambiarPagina(i);
            paginationContainer.appendChild(btn);
        }

        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Siguiente';
        nextBtn.disabled = page === totalPages;
        nextBtn.onclick = () => cambiarPagina(page + 1);
        paginationContainer.appendChild(nextBtn);
    }

    function cambiarPagina(page) {
        currentPage = page;
        mostrarMentoras(currentPage);
    }

    obtenerDatos();
});