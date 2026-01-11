document.addEventListener("DOMContentLoaded", function() {

    // VARIABILI MODALE
    const modal = document.getElementById("videoModal");
    const modalIframe = document.getElementById("modalIframe");
    const closeBtn = document.querySelector(".close-btn");

    /* =========================================
       1. GESTIONE CLICK SULLE CARD (Apre il Modale)
       ========================================= */
    const youtubeOverlays = document.querySelectorAll('.yt-lazy-load');

    youtubeOverlays.forEach(overlay => {
        // 1. Recupera ID
        const videoId = overlay.getAttribute('data-id');
        
        // 2. Mette la copertina
        if (videoId) {
            overlay.style.backgroundImage = `url('https://img.youtube.com/vi/${videoId}/maxresdefault.jpg')`;
        }

        // 3. Al click, apre il modale invece di caricare l'iframe nella card
        overlay.addEventListener('click', function() {
            openModal(videoId);
        });
    });

    /* =========================================
       2. FUNZIONI MODALE
       ========================================= */
    
    function openModal(videoId) {
        // Costruisce l'URL per il modale
        // Nota: Qui autoplay=1 funziona meglio perché è un'azione utente
        modalIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
        
        // Mostra il modale
        modal.classList.add("show");
    }

    function closeModal() {
        // Nasconde il modale
        modal.classList.remove("show");
        
        // IMPORTANTE: Resetta l'SRC per fermare l'audio del video
        setTimeout(() => {
            modalIframe.src = ""; 
        }, 300); // Aspetta la fine della transizione fade-out
    }

    // Event Listener per chiudere
    closeBtn.addEventListener("click", closeModal);

    // Chiude se clicchi fuori dal video (sullo sfondo scuro)
    window.addEventListener("click", function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    /* =========================================
       3. FILTRI CATEGORIE (Tuo codice precedente)
       ========================================= */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const videoCards = document.querySelectorAll('.video-card');

    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const filterValue = button.getAttribute('data-filter');
                
                videoCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    if (filterValue === 'all' || filterValue === cardCategory) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
});