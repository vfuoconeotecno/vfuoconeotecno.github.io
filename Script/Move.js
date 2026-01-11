if (window.innerWidth <= 768) {
        const slider = document.body;
        const container = document.querySelector('.Organigramma-struttura');
        let isDown = false;
        let startX, startY;
        let scrollLeft, scrollTop;

        // Quando tocchi lo schermo
        slider.addEventListener('touchstart', (e) => {
            isDown = true;
            startX = e.touches[0].pageX - container.offsetLeft;
            startY = e.touches[0].pageY - container.offsetTop;
            
            // Calcola la posizione attuale usando il transform translate (se esistente) o 0
            const style = window.getComputedStyle(container);
            const matrix = new WebKitCSSMatrix(style.transform);
            
            scrollLeft = matrix.m41;
            scrollTop = matrix.m42;
        });

        // Quando alzi il dito
        slider.addEventListener('touchend', () => {
            isDown = false;
        });

        // Quando muovi il dito
        slider.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            e.preventDefault(); // Evita lo scroll nativo della pagina
            
            const x = e.touches[0].pageX - container.offsetLeft;
            const y = e.touches[0].pageY - container.offsetTop;
            
            const walkX = (x - startX) * 1.5; // Velocità movimento orizzontale
            const walkY = (y - startY) * 1.5; // Velocità movimento verticale
            
            // Applica il movimento mantenendo lo scale originale (0.7)
            container.style.transform = `scale(0.7) translate(${scrollLeft + walkX}px, ${scrollTop + walkY}px)`;
        });
    }