document.addEventListener("DOMContentLoaded", () => {
    
    const el = document.querySelector('.Organigramma-struttura');
    const container = document.body;

    // SOGLIA DI TOLLERANZA (Pixel)
    // Serve a distinguere un "click maldestro" da un vero trascinamento
    const DRAG_THRESHOLD = 6; 

    const isMapMode = () => window.innerWidth <= 768;

    // STATO DEL SISTEMA
    let state = {
        scale: 0.6, 
        pointX: 0, 
        pointY: 0,
        startX: 0, 
        startY: 0,
        initialTouchX: 0,
        initialTouchY: 0,
        isDragging: false, 
        active: false,
        updatePending: false // Per ottimizzare i frame (requestAnimationFrame)
    };

    let initialPinchDistance = null;
    let initialScale = null;

    // 1. FUNZIONE DI AGGIORNAMENTO GRAFICO (Ottimizzata 60fps)
    function updateVisuals() {
        if (state.updatePending) return;
        state.updatePending = true;
        
        requestAnimationFrame(() => {
            if (isMapMode()) {
                // Usa translate3d per forzare l'accelerazione hardware della GPU
                el.style.transform = `translate3d(${state.pointX}px, ${state.pointY}px, 0) scale(${state.scale})`;
            } else {
                el.style.transform = "";
            }
            state.updatePending = false;
        });
    }

    // 2. CENTRATURA INIZIALE
    function centerContent() {
        if (!isMapMode()) return;
        const contentWidth = el.scrollWidth;
        const screenWidth = window.innerWidth;
        
        state.pointX = (screenWidth - (contentWidth * state.scale)) / 2;
        state.pointY = 50; 
        updateVisuals();
    }
    
    // Centra all'avvio e se giri il telefono
    setTimeout(centerContent, 100);
    window.addEventListener('resize', () => {
        if(isMapMode()) setTimeout(centerContent, 100);
        else el.style.transform = "";
    });


    /* =========================================
       GESTIONE UNIFICATA (MOUSE + TOUCH)
       ========================================= */

    function onPointerDown(x, y) {
        if (!isMapMode()) return;
        state.active = true;
        state.isDragging = false;
        
        // Salviamo dove abbiamo toccato fisicamente
        state.initialTouchX = x;
        state.initialTouchY = y;
        
        // Non calcoliamo ancora startX/Y. Lo faremo solo se inizia il vero trascinamento.
        container.style.cursor = 'grab';
    }

    function onPointerMove(x, y, e) {
        if (!isMapMode()) return;
        
        // Se stiamo pizzicando (zoom 2 dita), ignora il movimento normale
        if (initialPinchDistance) return;
        
        if (!state.active) return;

        // Blocchiamo lo scroll nativo della pagina
        if (e.cancelable) e.preventDefault();

        // 1. SIAMO ANCORA IN FASE DI "DECISIONE"?
        if (!state.isDragging) {
            const moveX = Math.abs(x - state.initialTouchX);
            const moveY = Math.abs(y - state.initialTouchY);

            // Se non ci siamo mossi abbastanza, esci. (È solo un click tremolante)
            if (moveX < DRAG_THRESHOLD && moveY < DRAG_THRESHOLD) {
                return;
            }

            // 2. OK, È UN TRASCINAMENTO REALE!
            state.isDragging = true;
            container.style.cursor = 'grabbing';
            
            // FIX DEL "SALTO":
            // Ricalcoliamo il punto di ancoraggio ORA, basandoci sulla posizione attuale del dito.
            // In questo modo il movimento inizia FLUIDO da 0, senza scatti.
            state.startX = x - state.pointX;
            state.startY = y - state.pointY;
        }

        // 3. APPLICA IL MOVIMENTO
        state.pointX = x - state.startX;
        state.pointY = y - state.startY;
        
        updateVisuals();
    }

    function onPointerUp() {
        state.active = false;
        state.isDragging = false;
        initialPinchDistance = null;
        container.style.cursor = 'grab';
    }


    /* --- EVENTI MOUSE --- */
    container.addEventListener('mousedown', e => {
        if(e.button === 0) onPointerDown(e.clientX, e.clientY); // Solo tasto sinistro
    });
    container.addEventListener('mousemove', e => onPointerMove(e.clientX, e.clientY, e));
    container.addEventListener('mouseup', onPointerUp);
    container.addEventListener('mouseleave', onPointerUp);
    
    // Zoom Mouse (Rotella)
    container.addEventListener('wheel', (e) => {
        if (!isMapMode()) return;
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        state.scale = Math.min(Math.max(0.2, state.scale * delta), 3.0);
        updateVisuals();
    }, { passive: false });


    /* --- EVENTI TOUCH (CELLULARE) --- */
    container.addEventListener('touchstart', function(e) {
        if (!isMapMode()) return;
        
        if (e.touches.length === 1) {
            onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
        } else if (e.touches.length === 2) {
            state.active = false; // Zoom vince su Pan
            initialPinchDistance = getDistance(e.touches);
            initialScale = state.scale;
        }
    }, { passive: false });

    container.addEventListener('touchmove', function(e) {
        if (!isMapMode()) return;

        if (e.touches.length === 1) {
            onPointerMove(e.touches[0].clientX, e.touches[0].clientY, e);
        } else if (e.touches.length === 2 && initialPinchDistance) {
            if (e.cancelable) e.preventDefault();
            const currentDistance = getDistance(e.touches);
            const newScale = initialScale * (currentDistance / initialPinchDistance);
            state.scale = Math.min(Math.max(0.2, newScale), 3.0);
            updateVisuals();
        }
    }, { passive: false });

    container.addEventListener('touchend', onPointerUp);


    // Helper
    function getDistance(touches) {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }
});