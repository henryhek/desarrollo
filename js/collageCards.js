document.addEventListener('DOMContentLoaded', function () {
    const cardContainer = document.getElementById('card-container');
    const sheetURL = 'https://opensheet.elk.sh/15stlOP4e4qobL11DFXEkI6SB74aEQjTiOqVl6HNEZBY/match';
    const prevBtn = document.getElementById('previous-page');
    const nextBtn = document.getElementById('next-page');

    let todasLasParejas = [];
    let paginaActual = 1;
    const parejasPorPagina = 11;

    fetch(sheetURL)
        .then(response => response.json())
        .then(parejas => {
            todasLasParejas = parejas;
            mostrarPagina(paginaActual);
        })
        .catch(error => {
            console.error('Error cargando datos del Sheet:', error);
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

        card.classList.add('clicked');
        return card;
    }

    function crearDivPareja(pareja) {
        const divPareja = document.createElement('div');
        divPareja.classList.add('pareja');

        const tieneVideo = pareja.video && pareja.video.trim() !== '';

        const divMentee = crearCarta(pareja.mentee, 'mentee');
        const divMentora = crearCarta(pareja.mentora, 'mentora', tieneVideo, pareja.video);

        divPareja.appendChild(divMentee);
        divPareja.appendChild(divMentora);

        return divPareja;
    }

    function mostrarPagina(pagina) {
        cardContainer.innerHTML = '';

        const inicio = (pagina - 1) * parejasPorPagina;
        const fin = inicio + parejasPorPagina;
        const parejasPagina = todasLasParejas.slice(inicio, fin);

        parejasPagina.forEach(pareja => {
            const divPareja = crearDivPareja(pareja);
            cardContainer.appendChild(divPareja);
        });

        prevBtn.disabled = pagina === 1;
        nextBtn.disabled = fin >= todasLasParejas.length;
    }

    prevBtn.addEventListener('click', () => {
        if (paginaActual > 1) {
            paginaActual--;
            mostrarPagina(paginaActual);
        }
    });

    nextBtn.addEventListener('click', () => {
        if ((paginaActual * parejasPorPagina) < todasLasParejas.length) {
            paginaActual++;
            mostrarPagina(paginaActual);
        }
    });

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

    document.getElementById('close-modal')?.addEventListener('click', cerrarModal);
});
