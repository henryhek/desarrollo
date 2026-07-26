document.addEventListener('DOMContentLoaded', function () {
    const parejas = [
        { mentee: 'Yira Caneva', mentora: 'Maria Celina Restrepo', video: 'https://hely.com.co/mrb/video/maria-celina-restrepo.mp4' },
        { mentee: 'Yurani Donato', mentora: 'Zulma Villar', video: null },
        { mentee: 'Nini Johanna Toscano', mentora: 'Blanca Helena Reyes', video: null },
        { mentee: 'María Fernanda Cuervo', mentora: 'Angela Patricia Quiroga', video: 'https://hely.com.co/mrb/video/angela-quiroga.mp4' },
        { mentee: 'Alexandra Millán Cortes', mentora: 'Martha Lucia Uribe', video: 'https://www.youtube.com/embed/mAdyWS1aUJY?si=1LFOXE2NT5yC3baRO' },
        { mentee: 'Mariana Chavez Redondo', mentora: 'Paola Cortaza', video: 'https://hely.com.co/mrb/video/paola-cortaza.mp4' },
        { mentee: 'Andrea Lorena Real', mentora: 'Angela Torres', video: 'https://hely.com.co/mrb/video/angela-torres.mp4' },
        { mentee: 'Katherine Sosa', mentora: 'Liliana Florez', video: null },
        { mentee: 'Diana Fuquene', mentora: 'Celinea Orostegui', video: null },
        { mentee: 'Liliana Malambo', mentora: 'Adriana Peña', video: null },
        { mentee: 'Maria Alejandra Romero', mentora: 'Ximena Restrepo', video: null },
        { mentee: 'Andrea Prieto Sáenz', mentora: 'Lina María Gomez', video: null },
        { mentee: 'Heidy Martinez', mentora: 'Olga Loza', video: null },
        { mentee: 'Karen Obando', mentora: 'Nancy Alvarez', video: null },
        { mentee: 'María de los Ángeles Pinto', mentora: 'Maria Clara Gaitan', video: null },
        { mentee: 'Angélica Dulcey', mentora: 'Karym Grijalba', video: null },
        { mentee: 'Camila Lara Caviedes', mentora: 'Maria Jose Salinas', video: null },
        { mentee: 'Mariana Garcia Agudelo', mentora: 'Marcela Moreno Arias', video: null },
        { mentee: 'Alejandra Ibarra', mentora: 'Martha Lucia Garzon', video: null },
        { mentee: 'Dayra Lizzeth Suárez', mentora: 'Angie Hernandez', video: null },
        { mentee: 'Lizeth Johanna Díaz', mentora: 'Luz Helena Rubio', video: null },
        { mentee: 'Andrea Marcela Bonelo', mentora: 'Marcela Gomez', video: null },
        { mentee: 'Jenice Sabine Elles', mentora: 'Angela Maria Orozco', video: null },
        { mentee: 'Mónica Fernandez Tibaduiza', mentora: 'Diana Saenz', video: null },
        { mentee: 'Alejandra Martinez', mentora: 'Cecilia Arellano', video: null },
        { mentee: 'Sandra Pérez', mentora: 'Caterina Platovzky', video: null },
        { mentee: 'Katherine Bohorguez', mentora: 'Martha Janneth Peña', video: null },
        { mentee: 'Lesly Tatiana Castillo', mentora: 'Jimena Ortiz', video: null },
        { mentee: 'Viviana Deysse Sánchez', mentora: 'Jennifer Perez', video: null },
        { mentee: 'Nina Juliana Aguilera', mentora: 'Elizabeth Bustos', video: null },
    ];

    const mentorasConVideo = parejas.filter(pareja => pareja.video); // Obtener mentoras con video asociado

    const cardContainer = document.getElementById('card-container');
    const paginationContainer = document.getElementById('pagination-container');
    const cardsPerPage = 1;
    let currentPage = 1;

    // Función para crear una carta con una imagen, un título y un botón para mentoras con video
    function crearCarta(nombre, tipo, tieneVideo, videoURL) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.classList.add(tipo); // Agregar la clase tipo (mentee o mentora)

        // Agregar la clase con-video solo si tiene video asociado
        if (tieneVideo) {
            card.classList.add('con-video');
        }

        card.innerHTML = `
            <h3>${tipo.charAt(0).toUpperCase() + tipo.slice(1)}</h3>
            <h3 class="nombres">${nombre}</h3>
        `;

        // Normalizar y limpiar el nombre para usarlo como nombre de archivo de imagen
        const nombreArchivo = nombre
            .normalize("NFD") // Normalizar los caracteres especiales
            .replace(/[\u0300-\u036f]/g, "") // Eliminar diacríticos
            .replace(/[^\w\s]/gi, '') // Eliminar caracteres especiales
            .replace(/\s+/g, '-') // Reemplazar espacios con guiones
            .toLowerCase(); // Convertir a minúsculas

        const img = document.createElement('img');
        img.src = `img/${tipo}/${nombreArchivo}.png`;
        img.alt = `${nombre} - ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`;
        card.appendChild(img);

        // Agregar el botón "Ver Saludo" solo para mentoras con video asociado
        if (tipo === 'mentora' && tieneVideo) {
            const button = document.createElement('button');
            button.textContent = 'Ver Saludo';
            button.classList.add('video-button'); // Agregar clase para estilos
            card.appendChild(button); // Agregar el botón al card

            // Agregar evento de clic al botón "Ver Saludo"
            button.addEventListener('click', (event) => {
                event.stopPropagation(); // Evitar que el clic se propague a la card
                mostrarModalVideo(videoURL);
            });
        }

        card.addEventListener('click', () => {
            card.classList.toggle('clicked');
        });

        return card;
    }

    function mostrarCartas(pagina) {
        const startIndex = (pagina - 1) * cardsPerPage;
        const endIndex = startIndex + cardsPerPage;
        cardContainer.innerHTML = '';

        for (let i = startIndex; i < endIndex && i < parejas.length; i++) {
            const pareja = parejas[i];
            const cardMentee = crearCarta(pareja.mentee, 'mentee');
            const cardMentora = crearCarta(pareja.mentora, 'mentora', pareja.video !== null, pareja.video);
            cardContainer.appendChild(cardMentee);
            cardContainer.appendChild(cardMentora);
        }
    }

    function crearBotonesPaginacion() {
        const numPages = Math.ceil(parejas.length / cardsPerPage);
        paginationContainer.innerHTML = '';

        for (let i = 1; i <= numPages; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.addEventListener('click', () => {
                currentPage = i;
                mostrarCartas(currentPage);

                document.querySelectorAll('.pagination button').forEach(btn => {
                    btn.classList.remove('active');
                });

                button.classList.add('active');
            });

            if (i === currentPage) {
                button.classList.add('active');
            }

            paginationContainer.appendChild(button);
        }
    }

    function previousPage() {
        if (currentPage > 1) {
            currentPage--;
            mostrarCartas(currentPage);
            actualizarEstadoBotones();
        }
    }

    function nextPage() {
        const numPages = Math.ceil(parejas.length / cardsPerPage);
        if (currentPage < numPages) {
            currentPage++;
            mostrarCartas(currentPage);
            actualizarEstadoBotones();
        }
    }

    function actualizarEstadoBotones() {
        const previousButton = document.getElementById('previous-page');
        const nextButton = document.getElementById('next-page');
        const numPages = Math.ceil(parejas.length / cardsPerPage);

        if (currentPage === 1) {
            previousButton.disabled = true;
        } else {
            previousButton.disabled = false;
        }

        if (currentPage === numPages) {
            nextButton.disabled = true;
        } else {
            nextButton.disabled = false;
        }
    }

    document.getElementById('previous-page').addEventListener('click', previousPage);
    document.getElementById('next-page').addEventListener('click', nextPage);

    document.addEventListener('DOMContentLoaded', actualizarEstadoBotones);

    mostrarCartas(currentPage);
    crearBotonesPaginacion();

    function mostrarModalVideo(videoURL) {
        const modal = document.getElementById('modal');
        const video = document.getElementById('video-modal');

        video.src = videoURL;
        modal.style.display = 'block';

        // Agregar evento para cerrar el modal al hacer clic fuera del mismo
        window.addEventListener('click', cerrarModalExterno);
    }

    function cerrarModal() {
        const modal = document.getElementById('modal');
        const video = document.getElementById('video-modal');

        video.src = '';
        modal.style.display = 'none';

        // Remover el evento para cerrar el modal al hacer clic fuera del mismo
        window.removeEventListener('click', cerrarModalExterno);
    }

    function cerrarModalExterno(event) {
        const modal = document.getElementById('modal');
        if (event.target === modal) {
            cerrarModal();
        }
    }

    document.getElementById('close-modal').addEventListener('click', cerrarModal);
});
