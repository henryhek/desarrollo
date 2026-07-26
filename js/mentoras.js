document.addEventListener('DOMContentLoaded', async function () {
    // --- CONFIGURACIÓN ---
    const cardsPerPage = 10;
    // --- ---

    const cardContainer = document.getElementById('card-container');
    const paginationContainer = document.getElementById('pagination-container');
    const filterAllBtn = document.getElementById('filter-all');
    const filterPresencialBtn = document.getElementById('filter-presencial');
    const filterVirtualBtn = document.getElementById('filter-virtual');
    const downloadBtn = document.getElementById('download-btn');

    let currentPage = 1;
    let mentoras = [];
    let currentFilter = 'all';

    const estaMarcado = (valor) => {
        if (valor === undefined || valor === null || valor === "") return false;
        if (typeof valor === 'boolean') return valor;
        const texto = String(valor).trim().toLowerCase();
        return texto === "true" || texto === "verdadero" || texto === "sí" || texto === "si" || texto === "1" || texto === "yes" || texto === "on" || texto === "x";
    };

    async function obtenerDatos() {
        try {
            const response = await fetch('https://script.google.com/macros/s/AKfycbylp0BERX-tiQAJEsQz76D8Kjgd8uUAMXKa3KLHBJfPoegPl4k2qzr91ItEONqu5lZsHg/exec');
            const data = await response.json();
            
            mentoras = data.map(row => {
                const llaves = Object.keys(row);
                
                const llaveNombre = llaves.find(k => k.toLowerCase().trim() === 'nombre');
                const llaveProfesion = llaves.find(k => k.toLowerCase().trim() === 'profesión' || k.toLowerCase().trim() === 'profesion');
                const llaveCargo = llaves.find(k => k.toLowerCase().trim() === 'empresa-cargo' || k.toLowerCase().trim() === 'empresa_cargo');
                const llaveEmpresa = llaves.find(k => k.toLowerCase().trim() === 'perfil');
                const llaveFoto = llaves.find(k => k.toLowerCase().trim() === 'fotos' || k.toLowerCase().trim() === 'foto');
                const llavePresencial = llaves.find(k => k.toLowerCase().trim() === 'presencial');
                const llaveVirtual = llaves.find(k => k.toLowerCase().trim() === 'virtual');

                return {
                    mentora: llaveNombre ? row[llaveNombre] : '',
                    profesion: llaveProfesion ? row[llaveProfesion] : '',
                    cargo: llaveCargo ? row[llaveCargo] : '',
                    empresa: llaveEmpresa ? row[llaveEmpresa] : '',
                    foto: llaveFoto ? row[llaveFoto] : undefined,
                    presencial: llavePresencial ? estaMarcado(row[llavePresencial]) : false,
                    virtual: llaveVirtual ? estaMarcado(row[llaveVirtual]) : false,
                };
            });

            filterAndShowMentoras();
        } catch (error) {
            console.error('Error al cargar los datos de Google Sheets:', error);
        }
    }

    function crearCarta(mentora) {
        const card = document.createElement('div');
        card.classList.add('card');
        if (mentora.presencial) card.classList.add('presencial');
        if (mentora.virtual) card.classList.add('virtual');

        const bgDiv = document.createElement('div');
        bgDiv.classList.add('bg-image');
        
        if (mentora.foto && mentora.foto.trim() !== "") {
            bgDiv.style.backgroundImage = `url('https://hely.com.co/mrb/tarjetas/${mentora.foto.trim()}')`;
        } else {
            bgDiv.style.backgroundImage = `url('https://hely.com.co/mrb/tarjetas/assets/fotos/default.png')`;
        }

        let infoSubtitulo = mentora.profesion ? mentora.profesion : '';
        if (mentora.cargo) {
            infoSubtitulo += infoSubtitulo ? ` - ${mentora.cargo}` : mentora.cargo; 
        }

        card.innerHTML = `
            <div class="textos-card">
                <h3 class="nombre">${mentora.mentora || ''}</h3>
                <p class="profesion-cargo">${infoSubtitulo}</p> 
            </div>
        `;

        card.prepend(bgDiv);
        return card;
    }

    function filterAndShowMentoras() {
        cardContainer.innerHTML = '';
        const filteredMentoras = getFilteredMentoras();

        filteredMentoras.forEach(item => {
            const card = crearCarta(item);
            cardContainer.appendChild(card);
        });

        currentPage = 1;
        mostrarPagina(currentPage);
    }

    function getFilteredMentoras() {
        if (currentFilter === 'presencial') {
            return mentoras.filter(m => m.presencial);
        }
        if (currentFilter === 'virtual') {
            return mentoras.filter(m => m.virtual);
        }
        return mentoras;
    }

    function mostrarPagina(page) {
        const cards = Array.from(cardContainer.children);
        const start = (page - 1) * cardsPerPage;
        const end = start + cardsPerPage;

        cards.forEach((card, index) => {
            card.style.display = (index >= start && index < end) ? 'flex' : 'none';
        });

        renderPaginacion(page, cards.length);
    }
    
    function renderPaginacion(page, totalItems) {
        const totalPages = Math.ceil(totalItems / cardsPerPage);
        paginationContainer.innerHTML = '';

        if (totalPages <= 1) return;

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
        mostrarPagina(currentPage);
    }

    filterAllBtn.addEventListener('click', () => {
        currentFilter = 'all';
        filterAllBtn.classList.add('active');
        filterPresencialBtn.classList.remove('active');
        filterVirtualBtn.classList.remove('active');
        filterAndShowMentoras();
    });

    filterPresencialBtn.addEventListener('click', () => {
        currentFilter = 'presencial';
        filterAllBtn.classList.remove('active');
        filterPresencialBtn.classList.add('active');
        filterVirtualBtn.classList.remove('active');
        filterAndShowMentoras();
    });

    filterVirtualBtn.addEventListener('click', () => {
        currentFilter = 'virtual';
        filterAllBtn.classList.remove('active');
        filterPresencialBtn.classList.remove('active');
        filterVirtualBtn.classList.add('active');
        filterAndShowMentoras();
    });

    downloadBtn.addEventListener('click', async () => {
        const originalPage = currentPage;
        paginationContainer.style.display = 'none';
        
        const cards = Array.from(cardContainer.children);
        cards.forEach(card => card.style.display = 'flex');

        await document.fonts.ready;
        await new Promise(r => setTimeout(r, 500));

        html2canvas(cardContainer, { useCORS: true, scale: 2 }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'mentoras.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            
            paginationContainer.style.display = 'flex';
            mostrarPagina(originalPage);
        });
    });

    obtenerDatos();
});