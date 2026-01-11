document.addEventListener("DOMContentLoaded", () => {
    
    const el = document.querySelector('.Organigramma-struttura');
    const container = document.body;
    const DRAG_THRESHOLD = 6; 

    const isMapMode = () => window.innerWidth <= 768;

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
        updatePending: false
    };

    let initialPinchDistance = null;
    let initialScale = null;

    function updateVisuals() {
        if (state.updatePending) return;
        state.updatePending = true;
        
        requestAnimationFrame(() => {
            if (isMapMode()) {
                el.style.transform = `translate3d(${state.pointX}px, ${state.pointY}px, 0) scale(${state.scale})`;
            } else {
                el.style.transform = "";
            }
            state.updatePending = false;
        });
    }

    function centerContent() {
        if (!isMapMode()) return;
        const contentWidth = el.scrollWidth;
        const screenWidth = window.innerWidth;
        
        state.pointX = (screenWidth - (contentWidth * state.scale)) / 2;
        state.pointY = 50; 
        updateVisuals();
    }
    
    setTimeout(centerContent, 100);
    window.addEventListener('resize', () => {
        if(isMapMode()) setTimeout(centerContent, 100);
        else el.style.transform = "";
    });

    function onPointerDown(x, y) {
        if (!isMapMode()) return;
        state.active = true;
        state.isDragging = false;
        
        state.initialTouchX = x;
        state.initialTouchY = y;
        
        container.style.cursor = 'grab';
    }

    function onPointerMove(x, y, e) {
        if (!isMapMode()) return;
        
        if (initialPinchDistance) return;
        
        if (!state.active) return;

        if (e.cancelable) e.preventDefault();

        if (!state.isDragging) {
            const moveX = Math.abs(x - state.initialTouchX);
            const moveY = Math.abs(y - state.initialTouchY);

            if (moveX < DRAG_THRESHOLD && moveY < DRAG_THRESHOLD) {
                return;
            }

            state.isDragging = true;
            container.style.cursor = 'grabbing';
    
            state.startX = x - state.pointX;
            state.startY = y - state.pointY;
        }

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

    container.addEventListener('mousedown', e => {
        if(e.button === 0) onPointerDown(e.clientX, e.clientY);
    });
    container.addEventListener('mousemove', e => onPointerMove(e.clientX, e.clientY, e));
    container.addEventListener('mouseup', onPointerUp);
    container.addEventListener('mouseleave', onPointerUp);
    
    container.addEventListener('wheel', (e) => {
        if (!isMapMode()) return;
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        state.scale = Math.min(Math.max(0.2, state.scale * delta), 3.0);
        updateVisuals();
    }, { passive: false });

    container.addEventListener('touchstart', function(e) {
        if (!isMapMode()) return;
        
        if (e.touches.length === 1) {
            onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
        } else if (e.touches.length === 2) {
            state.active = false;
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

    function getDistance(touches) {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }
});