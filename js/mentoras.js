document.addEventListener('DOMContentLoaded', function () {
    const mentoras = [
        { mentora: 'Adriana Peña', profesion: 'Administradora de empresas, Máster en Marketing', cargo: 'Jefe Unidad de Emprendimiento', empresa: 'Universidad EAN' },
        { mentora: 'Ana Maria Garcia', profesion: 'Psicóloga', cargo: '', empresa: 'Consultorio privado' },
        { mentora: 'Angela Quiroga', profesion: 'Ingeniera agrícola', cargo: 'Facilitadora de Agricultura Urbana', empresa: 'Huertopia' },
        { mentora: 'Angie Hernandez', profesion: 'Economista', cargo: 'Creadora y fundadora', empresa: 'AWE y Creadoras de cambio' },
        { mentora: 'Blanca Elena Reyes', profesion: 'Economista, Administradora de Empresas', cargo: 'Directora Ejecutiva', empresa: 'Fundación BIVE' },
        { mentora: 'Cecilia Arellano', profesion: 'Psicóloga Coach', cargo: 'Directora', empresa: 'Fundación Mujeres por Colombia' },
        { mentora: 'Claudia Calderon', profesion: 'Finanzas y Comercio Exterior', cargo: 'Consultora empresarial y coach de negocios', empresa: 'Independiente' },
        { mentora: 'Cindy Sampayo', profesion: 'Ingeniera Industrial', cargo: 'Directora', empresa: 'Fundación C-Innova' },
        { mentora: 'Diana Saenz', profesion: 'Administración de Empresas', cargo: 'Gerente de gestión del conocimiento', empresa: 'Fundación WWB Colombia' },
        { mentora: 'Elizabeth Bustos', profesion: 'Mercadóloga, Antropóloga', cargo: 'Directora', empresa: 'EdeSer' },
        { mentora: 'Jennifer Perez', profesion: 'Ingeniera de Mercados', cargo: 'Gerente de Operaciones', empresa: 'Arroba Media Group' },
        { mentora: 'Jimena Ortiz', profesion: 'Economista', cargo: 'Coordinadora técnica', empresa: 'Fundación WWB Colombia' },
        { mentora: 'Liliana Florez', profesion: 'Psicóloga', cargo: 'Directora', empresa: 'Psiconsejería' },
        { mentora: 'Luz Helena Rubio', profesion: 'Administración de Empresas', cargo: 'Líder', empresa: 'Centro de Liderazgo Colaborativo y de Innovación – CLCI' },
        { mentora: 'Marcela Moreno', profesion: 'Comunicadora Social', cargo: 'Consultora en comunicaciones y asuntos públicos', empresa: 'Independiente' }, 
        { mentora: 'Maria Cecilia Obando', profesion: 'Economista', cargo: '', empresa: '' },
        { mentora: 'Maria Celina Restrepo', profesion: 'Comunicadora Social Periodista', cargo: '', empresa: '' },
        { mentora: 'Maria Clara Gaitan', profesion: 'Administración Turística', cargo: 'Coach', empresa: 'Independiente' },
        { mentora: 'Maria Jose Salinas', profesion: '', cargo: '', empresa: '' },
        { mentora: 'Martha Aponte', profesion: '', cargo: '', empresa: '' },
        { mentora: 'Martha Lucia Garzon', profesion: 'Ingeniera Civil, Coach profesional de escencia', cargo: 'Consultora en desarrollo organizacional y liderazgo', empresa: 'Independiente' },
        { mentora: 'Martha Lucia Uribe', profesion: 'Economista', cargo: '', empresa: '' },
        { mentora: 'Martha Peña', profesion: 'Fonoaudióloga', cargo: '', empresa: 'Centro Médico Calle 91' },
        { mentora: 'Mónica Fernández', profesion: 'Lingüista, magíster en Innovación Empresarial', cargo: 'Gerente de Procesos', empresa: 'GESSIG SAS' },
        { mentora: 'Nancy Alvarez', profesion: 'Psicóloga', cargo: 'Gerente de talento Humano Latam', empresa: 'Americas BPS - Grupo Carvajal' },
        { mentora: 'Olga Loza', profesion: 'Contadora, Especialista en Revisoría Fiscal y Auditoría Externa - ', cargo: 'Apoyo en el área Administrativa y de control', empresa: 'Fundación Amor y Esperanza' },
        { mentora: 'Olga Lucia Lozano', profesion: 'Abogada', cargo: 'Consultora', empresa: 'OKAPI' },
        { mentora: 'Paola Cortaza', profesion: 'Administradora de Empresas', cargo: 'Director General', empresa: 'Promarket Strategy' },
        { mentora: 'Sonia Perdomo', profesion: '', cargo: '', empresa: '' },
        { mentora: 'Ximena Restrepo', profesion: 'Profesional en Mercadeo y Publicidad', cargo: 'Gerente Mercado', empresa: 'Makro' }
    ];
    const cardsPerPage = 15;
let currentPage = 1;
    const cardContainer = document.getElementById('card-container');

    function crearCarta(mentoraNombre, profesion, cargo, empresa) {
        const card = document.createElement('div');
        card.classList.add('card');
    
        const nombreArchivo = mentoraNombre
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Quitar acentos
            .replace(/ñ/g, "n")              // Reemplazar ñ
            .replace(/Ñ/g, "N")              // Reemplazar Ñ
            .replace(/[^\w\s]/gi, '')        // Quitar caracteres especiales
            .replace(/\s+/g, '-')            // Reemplazar espacios por guiones
            .toLowerCase();                  // Pasar a minúsculas
    
        // Aplicar la imagen como fondo a un div
        const bgDiv = document.createElement('div');
        bgDiv.classList.add('bg-image');
        bgDiv.style.backgroundImage = `url('img/mentora/${nombreArchivo}.png')`;
    
        card.innerHTML = `
            <div class="textos-card">
                <h3 class="nombre">${mentoraNombre}</h3>
                <p class="profesion">${profesion} ${cargo}<br>${empresa}</p>
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
            const card = crearCarta(item.mentora, item.profesion, item.cargo, item.empresa);
            cardContainer.appendChild(card);
        });
    
        renderPaginacion(page);
    }
    function renderPaginacion(page) {
        const totalPages = Math.ceil(mentoras.length / cardsPerPage);
        const paginationContainer = document.getElementById('pagination-container');
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
    
    
    mostrarMentoras();
    
});
