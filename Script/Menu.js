document.addEventListener('DOMContentLoaded', () => {
    // 1. Seleziona l'icona del menu (il tuo div.menu)
    const menuIcon = document.querySelector('.menu');
    
    // 2. Seleziona il tag body per applicare la classe
    const body = document.body;
    
    // 3. Aggiungi un ascoltatore di eventi al click
    if (menuIcon) {
        menuIcon.addEventListener('click', () => {
            // Aggiunge/Rimuove la classe 'menu-open' al body.
            body.classList.toggle('menu-open');
            
            // Opzionale: Blocca lo scorrimento del contenuto principale 
            // quando il menu mobile è aperto per evitare scroll indesiderati.
            if (body.classList.contains('menu-open')) {
                body.style.overflowY = 'hidden';
            } else {
                body.style.overflowY = 'scroll';
            }
        });
    }
    
    // Funzione per chiudere il menu dopo aver cliccato un link (UX mobile)
    const navLinks = document.querySelectorAll('.main-nav-desktop a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (body.classList.contains('menu-open')) {
                // Chiude il menu dopo la navigazione su mobile
                body.classList.remove('menu-open');
                body.style.overflowY = 'scroll';
            }
        });
    });
});