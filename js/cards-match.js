document.addEventListener('DOMContentLoaded', function () {
    const cardContainer = document.getElementById('card-container');
    const paginationContainer = document.getElementById('pagination-container');
    const previousButton = document.getElementById('previous-page');
    const nextButton = document.getElementById('next-page');
    const sheetURL = 'https://opensheet.elk.sh/15stlOP4e4qobL11DFXEkI6SB74aEQjTiOqVl6HNEZBY/match';

    const cardsPerPage = 1;
    let currentPage = 1;
    let parejas = [];

    fetch(sheetURL)
        .then(response => response.json())
        .then(data => {
            parejas = data;
            mostrarCartas(currentPage);
            crearBotonesPaginacion();
            actualizarEstadoBotones();
        })
        .catch(error => {
            console.error('Error cargando los datos del Sheet:', error);
        });

    function crearCarta(nombre, tipo, tieneVideo, videoURL) {
        const card = document.createElement('div');
        card.classList.add('card', tipo);
        if (tieneVideo) card.classList.add('con-video');

        card.innerHTML = `
            <h3>${tipo.charAt(0).toUpperCase() + tipo.slice(1)}</h3>
            <h3 class="nombres">${nombre}</h3>
        `;

        const nombreArchivo = nombre
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\w\s]/gi, '')
            .replace(/\s+/g, '-')
            .toLowerCase();

        const img = document.createElement('img');
        img.src = `img/${tipo}/${nombreArchivo}.png`;
        img.alt = `${nombre} - ${tipo}`;
        card.appendChild(img);

        if (tipo === 'mentora' && tieneVideo) {
            const button = document.createElement('button');
            button.textContent = 'Ver Saludo';
            button.classList.add('video-button');
            card.appendChild(button);

            button.addEventListener('click', (event) => {
                event.stopPropagation();
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
            const tieneVideo = pareja.video && pareja.video.trim() !== '';
            const cardMentee = crearCarta(pareja.mentee, 'mentee');
            const cardMentora = crearCarta(pareja.mentora, 'mentora', tieneVideo, pareja.video);
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
                actualizarEstadoBotones();
                document.querySelectorAll('#pagination-container button').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });

            if (i === currentPage) button.classList.add('active');
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
        const numPages = Math.ceil(parejas.length / cardsPerPage);
        previousButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === numPages;

        document.querySelectorAll('#pagination-container button').forEach((btn, index) => {
            btn.classList.toggle('active', index + 1 === currentPage);
        });
    }

    previousButton.addEventListener('click', previousPage);
    nextButton.addEventListener('click', nextPage);

    function mostrarModalVideo(videoURL) {
        const modal = document.getElementById('modal');
        const video = document.getElementById('video-modal');

        video.src = videoURL;
        modal.style.display = 'block';
        window.addEventListener('click', cerrarModalExterno);
    }

    function cerrarModal() {
        const modal = document.getElementById('modal');
        const video = document.getElementById('video-modal');

        video.src = '';
        modal.style.display = 'none';
        window.removeEventListener('click', cerrarModalExterno);
    }

    function cerrarModalExterno(event) {
        const modal = document.getElementById('modal');
        if (event.target === modal) cerrarModal();
    }

    document.getElementById('close-modal').addEventListener('click', cerrarModal);
});
