document.addEventListener('DOMContentLoaded', function () {
    const SHEET_URL = 'https://script.google.com/macros/s/AKfycbxR4XEsqJm-muc1Hv6E4FoSFBVguBYYIbz273NcWdFZ1JdH-n2lf5_tGcJoaYZDjH-rsg/exec';

    const cardContainer = document.getElementById('card-container');
    const paginationContainer = document.getElementById('pagination-container');
    const filterAllBtn = document.getElementById('filter-all');
    const filterPresencialBtn = document.getElementById('filter-presencial');
    const filterVirtualBtn = document.getElementById('filter-virtual');
    const cardsPerPageInput = document.getElementById('cards-per-page');
    const downloadBtn = document.getElementById('download-btn');
    const statusEl = document.getElementById('status-mentoras');
    const previewFrame = document.getElementById('preview-frame');

    let mentoras = [];
    let filteredMentoras = [];
    let currentPage = 1;
    let currentFilter = 'all';
    let cardsPerPage = getValidCardsPerPage(cardsPerPageInput ? cardsPerPageInput.value : 10);

    const quitarTildes = (txt = '') => String(txt)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();

    const estaMarcado = (valor) => {
        if (valor === undefined || valor === null || valor === '') return false;
        if (typeof valor === 'boolean') return valor;
        const texto = String(valor).trim().toLowerCase();
        return texto === 'true' || texto === 'verdadero' || texto === 'si' || texto === 'sí' || texto === '1' || texto === 'yes' || texto === 'on' || texto === 'x';
    };

    function getValueByKey(row, posiblesLlaves) {
        const keys = Object.keys(row || {});
        const found = keys.find((k) => {
            const normalized = quitarTildes(k);
            return posiblesLlaves.some((candidate) => normalized === candidate || normalized.includes(candidate));
        });

        return found ? row[found] : '';
    }

    function resolverFoto(fotoRaw) {
        const fallback = 'tarjetas/assets/fotos/placeholder.png';
        const foto = String(fotoRaw || '').trim();
        if (!foto) return fallback;

        if (/^https?:\/\//i.test(foto)) return foto;

        const clean = foto.replace(/^\.?\//, '');
        if (clean.startsWith('tarjetas/')) return clean;
        if (clean.startsWith('assets/')) return `tarjetas/${clean}`;
        if (clean.includes('/')) return clean;

        return `tarjetas/assets/fotos/${clean}`;
    }

    function normalizeMentora(row) {
        const nombre = getValueByKey(row, ['nombre', 'mentora']);
        const profesion = getValueByKey(row, ['profesion', 'profesion']);
        const cargo = getValueByKey(row, ['empresa-cargo', 'empresa_cargo', 'cargo']);
        const foto = getValueByKey(row, ['fotos', 'foto', 'imagen']);
        const presencial = getValueByKey(row, ['presencial']);
        const virtual = getValueByKey(row, ['virtual']);

        if (!String(nombre || '').trim()) return null;

        return {
            mentora: String(nombre).trim(),
            profesion: String(profesion || '').trim(),
            cargo: String(cargo || '').trim(),
            foto: resolverFoto(foto),
            presencial: estaMarcado(presencial),
            virtual: estaMarcado(virtual)
        };
    }

    function getValidCardsPerPage(value) {
        const parsed = Number(value);
        if (!Number.isFinite(parsed)) return 10;
        return Math.min(30, Math.max(1, Math.floor(parsed)));
    }

    function buildSubtitle(mentora) {
        if (mentora.profesion && mentora.cargo) return `${mentora.profesion} - ${mentora.cargo}`;
        return mentora.profesion || mentora.cargo || '';
    }

    function crearCarta(mentora) {
        const card = document.createElement('div');
        card.classList.add('card');

        const img = document.createElement('img');
        img.className = 'bg-image';
        img.src = mentora.foto;
        img.alt = mentora.mentora;
        img.loading = 'lazy';
        img.crossOrigin = 'anonymous';
        img.referrerPolicy = 'no-referrer';
        img.onerror = () => {
            img.src = 'tarjetas/assets/fotos/placeholder.png';
        };

        const textos = document.createElement('div');
        textos.className = 'textos-card';

        const nombre = document.createElement('h3');
        nombre.className = 'nombre';
        nombre.textContent = mentora.mentora;

        const subtitle = document.createElement('p');
        subtitle.className = 'profesion-cargo';
        subtitle.textContent = buildSubtitle(mentora);

        textos.appendChild(nombre);
        textos.appendChild(subtitle);

        card.appendChild(img);
        card.appendChild(textos);

        return card;
    }

    function applyFilter() {
        if (currentFilter === 'presencial') {
            filteredMentoras = mentoras.filter((m) => m.presencial);
            return;
        }

        if (currentFilter === 'virtual') {
            filteredMentoras = mentoras.filter((m) => m.virtual);
            return;
        }

        filteredMentoras = mentoras.slice();
    }

    function renderPaginacion() {
        const totalPages = Math.max(1, Math.ceil(filteredMentoras.length / cardsPerPage));
        paginationContainer.innerHTML = '';

        if (totalPages <= 1) return;

        const prevBtn = document.createElement('button');
        prevBtn.textContent = 'Anterior';
        prevBtn.disabled = currentPage === 1;
        prevBtn.onclick = () => {
            currentPage = Math.max(1, currentPage - 1);
            render();
        };
        paginationContainer.appendChild(prevBtn);

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.textContent = String(i);
            if (i === currentPage) btn.classList.add('active');
            btn.onclick = () => {
                currentPage = i;
                render();
            };
            paginationContainer.appendChild(btn);
        }

        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Siguiente';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.onclick = () => {
            currentPage = Math.min(totalPages, currentPage + 1);
            render();
        };
        paginationContainer.appendChild(nextBtn);
    }

    function render() {
        applyFilter();

        const totalPages = Math.max(1, Math.ceil(filteredMentoras.length / cardsPerPage));
        if (currentPage > totalPages) currentPage = totalPages;

        const start = (currentPage - 1) * cardsPerPage;
        const end = start + cardsPerPage;
        const pageItems = filteredMentoras.slice(start, end);

        cardContainer.innerHTML = '';
        pageItems.forEach((item) => {
            cardContainer.appendChild(crearCarta(item));
        });

        renderPaginacion();

        if (statusEl) {
            const filtroLabel = currentFilter === 'all' ? 'todas' : currentFilter;
            statusEl.textContent = `${filteredMentoras.length} mentoras (${filtroLabel}) - pagina ${currentPage} de ${totalPages}`;
        }

        if (previewFrame) {
            renderExportCanvas({ showPreview: true }).catch(() => {});
        }
    }

    function roundRectPath(ctx, x, y, width, height, radius) {
        const r = Math.min(radius, width / 2, height / 2);
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + width, y, x + width, y + height, r);
        ctx.arcTo(x + width, y + height, x, y + height, r);
        ctx.arcTo(x, y + height, x, y, r);
        ctx.arcTo(x, y, x + width, y, r);
        ctx.closePath();
    }

    function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
        const words = String(text || '').split(' ');
        let line = '';
        const lines = [];

        words.forEach((word) => {
            const testLine = line ? `${line} ${word}` : word;
            if (ctx.measureText(testLine).width > maxWidth && line) {
                lines.push(line);
                line = word;
            } else {
                line = testLine;
            }
        });

        if (line) lines.push(line);

        lines.slice(0, 3).forEach((entry, index) => {
            ctx.fillText(entry, x, y + index * lineHeight);
        });

        return lines.length;
    }

    function drawImageCover(ctx, image, x, y, width, height) {
        if (!image || !image.naturalWidth || !image.naturalHeight) return;
        const imgW = image.naturalWidth;
        const imgH = image.naturalHeight;
        const scale = Math.max(width / imgW, height / imgH);
        const drawW = imgW * scale;
        const drawH = imgH * scale;
        const offsetX = x + (width - drawW) / 2;
        const offsetY = y + (height - drawH) / 2;

        ctx.save();
        roundRectPath(ctx, x, y, width, height, 12);
        ctx.clip();
        ctx.drawImage(image, offsetX, offsetY, drawW, drawH);
        ctx.restore();
    }

    function loadImage(src) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null);
            img.crossOrigin = 'anonymous';
            img.referrerPolicy = 'no-referrer';
            img.src = src;
        });
    }

    async function renderExportCanvas({ showPreview = true } = {}) {
        const cardsVisibles = Array.from(cardContainer.children);
        if (!cardsVisibles.length) return null;

        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#fdfdff';
        ctx.fillRect(0, 0, 1024, 1024);

        ctx.fillStyle = '#b31c82';
        ctx.beginPath();
        ctx.moveTo(-80, -90);
        ctx.lineTo(260, -90);
        ctx.lineTo(340, 180);
        ctx.lineTo(-80, 180);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#b31c82';
        ctx.beginPath();
        ctx.moveTo(1024, 1024);
        ctx.lineTo(760, 1024);
        ctx.lineTo(1024, 750);
        ctx.closePath();
        ctx.fill();

        const title = currentFilter === 'all' ? 'Mentoras 2026' : `Mentoras ${currentFilter}`;
        ctx.fillStyle = '#b31c82';
        ctx.font = '700 56px Montserrat, sans-serif';
        ctx.textBaseline = 'top';
        ctx.fillText(title, 44, 56);

        const logoTop = await loadImage('logo-mrb.png');
        if (logoTop) {
            ctx.drawImage(logoTop, 760, 40, 210, 120);
        }

        const cols = cardsVisibles.length > 8 ? 5 : (cardsVisibles.length > 4 ? 4 : 3);
        const gap = 16;
        const paddingX = 34;
        const paddingY = 180;
        const cardWidth = (1024 - paddingX * 2 - gap * (cols - 1)) / cols;
        const cardHeight = 260;
        const availableHeight = 1024 - paddingY - 120;
        const rows = Math.ceil(cardsVisibles.length / cols);
        const contentHeight = rows * cardHeight + (rows - 1) * gap;
        const startY = paddingY + Math.max(0, (availableHeight - contentHeight) / 2);

        const footerHeight = 108;
        const footerY = 1024 - footerHeight - 18;
        ctx.fillStyle = '#6a62a5';
        ctx.fillRect(0, footerY, 1024, footerHeight + 20);

        const logoBottom = await loadImage('logo-mrb-white.svg');
        if (logoBottom) {
            ctx.drawImage(logoBottom, 392, 940, 240, 60);
        }

        for (let index = 0; index < cardsVisibles.length; index += 1) {
            const cardEl = cardsVisibles[index];
            const imgEl = cardEl.querySelector('.bg-image');
            const textEl = cardEl.querySelector('.textos-card');
            const nameEl = cardEl.querySelector('.nombre');
            const infoEl = cardEl.querySelector('.profesion-cargo');

            const row = Math.floor(index / cols);
            const col = index % cols;
            const x = paddingX + col * (cardWidth + gap);
            const y = startY + row * (cardHeight + gap);

            ctx.save();
            ctx.fillStyle = '#ffffff';
            roundRectPath(ctx, x, y, cardWidth, cardHeight, 14);
            ctx.fill();
            ctx.restore();

            if (imgEl) {
                const source = imgEl.currentSrc || imgEl.getAttribute('src') || '';
                const imageEl = imgEl.complete ? imgEl : await loadImage(source);
                if (imageEl) {
                    drawImageCover(ctx, imageEl, x + 8, y + 8, cardWidth - 16, 170);
                }
            }

            ctx.fillStyle = '#b31c82';
            roundRectPath(ctx, x, y + 178, cardWidth, cardHeight - 178 - 8, 14);
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.font = '700 22px Montserrat, sans-serif';
            ctx.textBaseline = 'top';
            const name = nameEl ? nameEl.textContent : '';
            const info = infoEl ? infoEl.textContent : '';
            const textX = x + 12;
            const textY = y + 188;
            const maxWidth = cardWidth - 24;
            wrapText(ctx, name, textX, textY, maxWidth, 24);
            ctx.font = '600 16px Montserrat, sans-serif';
            wrapText(ctx, info, textX, textY + 52, maxWidth, 18);
        }

        if (showPreview && previewFrame) {
            previewFrame.innerHTML = '';
            previewFrame.appendChild(canvas);
            canvas.style.width = '100%';
            canvas.style.maxWidth = '620px';
            canvas.style.height = 'auto';
            canvas.style.display = 'block';
            canvas.style.margin = '0 auto';
        }

        return canvas;
    }

    async function descargarPaginaActual() {
        downloadBtn.disabled = true;
        const originalText = downloadBtn.textContent;
        downloadBtn.textContent = 'Generando...';

        try {
            await document.fonts.ready;
            const canvas = await renderExportCanvas({ showPreview: true });
            if (!canvas) return;

            const link = document.createElement('a');
            link.download = `mentoras_pagina_${currentPage}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('Error al descargar la pagina actual:', error);
            if (statusEl) {
                statusEl.textContent = 'No se pudo descargar la imagen. Revisa que las fotos esten accesibles.';
            }
        } finally {
            downloadBtn.disabled = false;
            downloadBtn.textContent = originalText;
        }
    }

    async function obtenerDatos() {
        try {
            if (statusEl) statusEl.textContent = 'Cargando mentoras...';
            const response = await fetch(`${SHEET_URL}?t=${Date.now()}`);
            if (!response.ok) throw new Error('No se pudo conectar con Google Sheets.');

            const data = await response.json();
            if (!Array.isArray(data)) throw new Error('La respuesta de la hoja no es valida.');

            mentoras = data.map(normalizeMentora).filter(Boolean);
            currentPage = 1;
            render();
        } catch (error) {
            console.error(error);
            if (statusEl) {
                statusEl.textContent = 'Error cargando mentoras. Verifica la conexion o la URL del Apps Script.';
            }
        }
    }

    filterAllBtn.addEventListener('click', () => {
        currentFilter = 'all';
        currentPage = 1;
        filterAllBtn.classList.add('active');
        filterPresencialBtn.classList.remove('active');
        filterVirtualBtn.classList.remove('active');
        render();
    });

    filterPresencialBtn.addEventListener('click', () => {
        currentFilter = 'presencial';
        currentPage = 1;
        filterAllBtn.classList.remove('active');
        filterPresencialBtn.classList.add('active');
        filterVirtualBtn.classList.remove('active');
        render();
    });

    filterVirtualBtn.addEventListener('click', () => {
        currentFilter = 'virtual';
        currentPage = 1;
        filterAllBtn.classList.remove('active');
        filterPresencialBtn.classList.remove('active');
        filterVirtualBtn.classList.add('active');
        render();
    });

    cardsPerPageInput.addEventListener('input', () => {
        const valid = getValidCardsPerPage(cardsPerPageInput.value);
        cardsPerPage = valid;
        currentPage = 1;
        render();
    });

    cardsPerPageInput.addEventListener('blur', () => {
        cardsPerPageInput.value = String(getValidCardsPerPage(cardsPerPageInput.value));
    });

    downloadBtn.addEventListener('click', descargarPaginaActual);

    obtenerDatos();
});
