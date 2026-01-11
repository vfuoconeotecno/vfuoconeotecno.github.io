document.addEventListener("DOMContentLoaded", () => {
    // Attiva solo su mobile/tablet
    if (window.innerWidth > 768) return;

    const el = document.querySelector('.Organigramma-struttura');
    const container = document.body;

    // STATO DEL SISTEMA
    let state = {
        scale: 0.5, // Zoom iniziale (0.5 = 50%)
        panning: false,
        pointX: 0, // Posizione X attuale
        pointY: 0, // Posizione Y attuale
        startX: 0,
        startY: 0
    };

    // Variabili per il Pinch (Zoom due dita)
    let initialPinchDistance = null;
    let initialScale = null;

    // 1. FUNZIONE PER APPLICARE LE MODIFICHE VISIVE
    function setTransform() {
        el.style.transform = `translate(${state.pointX}px, ${state.pointY}px) scale(${state.scale})`;
    }

    // 2. CENTRATURA INIZIALE AUTOMATICA
    function centerContent() {
        // Ottieni dimensioni reali dell'organigramma
        const contentWidth = el.scrollWidth;
        const contentHeight = el.scrollHeight;
        
        // Ottieni dimensioni schermo
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        // Calcola coordinate per centrare
        state.pointX = (screenWidth - (contentWidth * state.scale)) / 2;
        state.pointY = 50; // Un po' di margine dall'alto (o usa formula per centro verticale)
        
        setTransform();
    }

    // Esegui centratura al caricamento
    // Usiamo un piccolo timeout per essere sicuri che il browser abbia calcolato le dimensioni
    setTimeout(centerContent, 100);

    // 3. GESTIONE TOCCO (Touch Start)
    container.addEventListener('touchstart', function(e) {
        if (e.touches.length === 1) {
            // Modalità PAN (Spostamento 1 dito)
            state.panning = true;
            // Calcoliamo l'offset rispetto alla posizione ATTUALE (risolve il bug dello "scatto")
            state.startX = e.touches[0].clientX - state.pointX;
            state.startY = e.touches[0].clientY - state.pointY;
        } else if (e.touches.length === 2) {
            // Modalità ZOOM (2 dita)
            state.panning = false;
            initialPinchDistance = getDistance(e.touches);
            initialScale = state.scale;
        }
    }, { passive: false });

    // 4. GESTIONE MOVIMENTO (Touch Move)
    container.addEventListener('touchmove', function(e) {
        e.preventDefault(); // Blocca scroll nativo

        if (e.touches.length === 1 && state.panning) {
            // Calcola nuova posizione basata sulla differenza
            state.pointX = e.touches[0].clientX - state.startX;
            state.pointY = e.touches[0].clientY - state.startY;
            setTransform();
        } else if (e.touches.length === 2 && initialPinchDistance) {
            // Calcola nuovo zoom
            const currentDistance = getDistance(e.touches);
            // La formula magica del pinch
            const newScale = initialScale * (currentDistance / initialPinchDistance);
            
            // Limita lo zoom (minimo 0.2, massimo 2.0)
            state.scale = Math.min(Math.max(0.2, newScale), 2.0);
            setTransform();
        }
    }, { passive: false });

    // 5. FINE TOCCO
    container.addEventListener('touchend', function(e) {
        state.panning = false;
        initialPinchDistance = null;
    });

    // Helper: calcola distanza tra due dita (Pitagora)
    function getDistance(touches) {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }
});