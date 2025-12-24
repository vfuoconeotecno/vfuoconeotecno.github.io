document.addEventListener('DOMContentLoaded', () => {
    const lightButton = document.getElementById('theme-light');
    const darkButton = document.getElementById('theme-dark');
    const christmasButton = document.getElementById('theme-christmas');
    const themeClasses = ['theme-light', 'theme-dark', 'theme-christmas'];

    // 1. Determina il percorso corretto una volta sola
    const getPath = () => {
        const p = window.location.pathname;
        const s = p.split('/').filter(Boolean);
        if (p.includes('/Personale/') && s.length >= 4) return '../../../Audio/Natale.mp3';
        if (p.includes('/Medaglie/') || p.includes('/Personale/')) return '../../Audio/Natale.mp3';
        if (s.length >= 1 && !p.endsWith('index.html') && p.includes('/')) return '../Audio/Natale.mp3';
        return './Audio/Natale.mp3';
    };

    // 2. Inizializza l'audio IMMEDIATAMENTE
    const audio = new Audio(getPath());
    audio.loop = true;
    audio.volume = 0.05;
    
    // Recupera tempo e muto salvati
    const savedTime = localStorage.getItem('christmasAudioTime');
    if (savedTime) audio.currentTime = parseFloat(savedTime);
    audio.muted = localStorage.getItem('christmasAudioMuted') === 'true';

    // Salva il tempo ogni secondo (meno pesante di 100ms)
    setInterval(() => {
        if (!audio.paused) localStorage.setItem('christmasAudioTime', audio.currentTime);
    }, 1000);

    // 3. Funzione di controllo tema e musica
    const syncAudio = (theme) => {
        if (theme === 'theme-christmas') {
            audio.play().catch(() => {
                // Se il browser blocca, aspetta il primo click sulla pagina
                const retry = () => { audio.play(); document.removeEventListener('click', retry); };
                document.addEventListener('click', retry);
            });
            if (muteBtn) muteBtn.style.display = 'flex';
        } else {
            audio.pause();
            if (muteBtn) muteBtn.style.display = 'none';
        }
    };

    // 4. Gestione dei pulsanti e del tema
    const applyTheme = (name) => {
        document.body.classList.remove(...themeClasses);
        if (name && name !== 'theme-default') document.body.classList.add(name);
        localStorage.setItem('themePreference', name);
        syncAudio(name);
    };

    // 5. Interfaccia Mute
    const muteBtn = document.createElement('div');
    Object.assign(muteBtn.style, {
        position: 'fixed', bottom: '10px', right: '20px', width: '35px', height: '35px',
        backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '50%', display: 'none',
        justifyContent: 'center', alignItems: 'center', cursor: 'pointer', zIndex: '9999', border: '2px solid white'
    });
    muteBtn.innerHTML = '<span style="color:white; font-size:20px;">♪</span>';
    document.body.appendChild(muteBtn);

    muteBtn.addEventListener('click', () => {
        audio.muted = !audio.muted;
        localStorage.setItem('christmasAudioMuted', audio.muted);
    });

    // Listener eventi
    if (lightButton) lightButton.addEventListener('click', () => applyTheme('theme-light'));
    if (darkButton) darkButton.addEventListener('click', () => applyTheme('theme-dark'));
    if (christmasButton) christmasButton.addEventListener('click', () => applyTheme('theme-christmas'));

    // Avvio iniziale
    const currentTheme = localStorage.getItem('themePreference') || 'theme-light';
    applyTheme(currentTheme);
});