document.addEventListener("DOMContentLoaded", () => {
    
    const el = document.querySelector('.Organigramma-struttura');
    const container = document.body;

    // Configurazione soglia (Pixel): quanto deve muoversi il dito prima che la mappa si sposti
    const DRAG_THRESHOLD = 8; 

    const isMapMode = () => window.innerWidth <= 768;

    // STATO DEL SISTEMA
    let state = {
        scale: 0.6, 
        pointX: 0, 
        pointY: 0,
        startX: 0, // Offset relativo per il calcolo
        startY: 0,
        initialTouchX: 0, // Posizione fisica iniziale del dito X
        initialTouchY: 0, // Posizione fisica iniziale del dito Y
        isDragging: false, // Diventa true SOLO dopo aver superato la soglia
        active: false // Se il mouse/dito è giù
    };

    let initialPinchDistance = null;
    let initialScale = null;

    // 1. APPLICA LE MODIFICHE
    function setTransform() {
        if (!isMapMode()) {
            el.style.transform = ""; 
            return; 
        }
        el.style.transform = `translate(${state.pointX}px, ${state.pointY}px) scale(${state.scale})`;
    }

    // 2. CENTRATURA INIZIALE
    function centerContent() {
        if (!isMapMode()) return;
        const contentWidth = el.scrollWidth;
        const screenWidth = window.innerWidth;
        // Centra
        state.pointX = (screenWidth - (contentWidth * state.scale)) / 2;
        state.pointY = 50; 
        setTransform();
    }
    
    setTimeout(centerContent, 100);
    window.addEventListener('resize', () => {
        if(isMapMode()) setTimeout(centerContent, 100);
        else el.style.transform = "";
    });

    /* =========================================
       GESTIONE MOUSE (PC)
       ========================================= */
    container.addEventListener('mousedown', (e) => {
        if (!isMapMode()) return;
        e.preventDefault();
        
        state.active = true;
        state.isDragging = false; // Reset dello stato trascinamento
        
        // Salviamo dove abbiamo cliccato fisicamente
        state.initialTouchX = e.clientX;
        state.initialTouchY = e.clientY;

        // Calcoliamo l'offset matematico
        state.startX = e.clientX - state.pointX;
        state.startY = e.clientY - state.pointY;
        
        container.style.cursor = 'grab';
    });

    container.addEventListener('mousemove', (e) => {
        if (!isMapMode() || !state.active) return;
        e.preventDefault();

        // CALCOLO DISTANZA: Ci siamo mossi abbastanza?
        const moveX = Math.abs(e.clientX - state.initialTouchX);
        const moveY = Math.abs(e.clientY - state.initialTouchY);

        // Se non stavamo già trascinando E il movimento è piccolo, ESCI.
        if (!state.isDragging && (moveX < DRAG_THRESHOLD && moveY < DRAG_THRESHOLD)) {
            return;
        }

        // Se arriviamo qui, l'utente vuole trascinare davvero
        state.isDragging = true; 
        container.style.cursor = 'grabbing';

        state.pointX = e.clientX - state.startX;
        state.pointY = e.clientY - state.startY;
        setTransform();
    });

    const stopMousePan = () => {
        state.active = false;
        state.isDragging = false;
        container.style.cursor = 'grab';
    };
    container.addEventListener('mouseup', stopMousePan);
    container.addEventListener('mouseleave', stopMousePan);

    // Zoom Mouse
    container.addEventListener('wheel', (e) => {
        if (!isMapMode()) return;
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = state.scale * delta;
        state.scale = Math.min(Math.max(0.2, newScale), 3.0);
        setTransform();
    }, { passive: false });


    /* =========================================
       GESTIONE TOUCH (CELLULARE)
       ========================================= */
    container.addEventListener('touchstart', function(e) {
        if (!isMapMode()) return;
        
        if (e.touches.length === 1) {
            state.active = true;
            state.isDragging = false; // Reset
            
            // Salviamo posizioni iniziali
            state.initialTouchX = e.touches[0].clientX;
            state.initialTouchY = e.touches[0].clientY;

            state.startX = e.touches[0].clientX - state.pointX;
            state.startY = e.touches[0].clientY - state.pointY;

        } else if (e.touches.length === 2) {
            state.active = false; // Disabilita pan se zoomiamo
            initialPinchDistance = getDistance(e.touches);
            initialScale = state.scale;
        }
    }, { passive: false });

    container.addEventListener('touchmove', function(e) {
        if (!isMapMode()) return;

        // Blocchiamo scroll nativo solo se stiamo "lavorando"
        if(state.active || initialPinchDistance) e.preventDefault();

        if (e.touches.length === 1 && state.active) {
            // VERIFICA ZONA MORTA
            const moveX = Math.abs(e.touches[0].clientX - state.initialTouchX);
            const moveY = Math.abs(e.touches[0].clientY - state.initialTouchY);

            // Se il movimento è minuscolo, ignoralo (è un tap tremolante)
            if (!state.isDragging && (moveX < DRAG_THRESHOLD && moveY < DRAG_THRESHOLD)) {
                return;
            }

            // Superata la soglia, attiva il movimento
            state.isDragging = true;
            
            state.pointX = e.touches[0].clientX - state.startX;
            state.pointY = e.touches[0].clientY - state.startY;
            setTransform();

        } else if (e.touches.length === 2 && initialPinchDistance) {
            const currentDistance = getDistance(e.touches);
            const newScale = initialScale * (currentDistance / initialPinchDistance);
            state.scale = Math.min(Math.max(0.2, newScale), 3.0);
            setTransform();
        }
    }, { passive: false });

    container.addEventListener('touchend', function(e) {
        state.active = false;
        state.isDragging = false;
        initialPinchDistance = null;
    });

    function getDistance(touches) {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }
});