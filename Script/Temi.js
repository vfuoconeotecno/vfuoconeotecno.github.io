document.addEventListener('DOMContentLoaded', () => {
    console.log("Script Natale: Caricato correttamente");

    const lightButton = document.getElementById('theme-light');
    const darkButton = document.getElementById('theme-dark');
    const christmasButton = document.getElementById('theme-christmas');
    const themeClasses = ['theme-light', 'theme-dark', 'theme-christmas'];

    const getAudioPath = () => {
        const path = window.location.pathname;
        const s = path.split('/').filter(Boolean);
        console.log("Analisi percorso attuale:", path);

        if (path.includes('/Personale/') && s.length >= 4) return '../../../Audio/Natale.mp3';
        if (path.includes('/Medaglie/') || path.includes('/Personale/')) return '../../Audio/Natale.mp3';
        if (s.length >= 1 && !path.endsWith('index.html') && path.includes('/')) return '../Audio/Natale.mp3';
        return './Audio/Natale.mp3';
    };

    const audioPath = getAudioPath();
    console.log("Percorso audio scelto:", audioPath);
    const audio = new Audio(audioPath);
    audio.loop = true;
    audio.volume = 0.05;

    const savedTime = localStorage.getItem('christmasAudioTime');
    if (savedTime) audio.currentTime = parseFloat(savedTime);
    audio.muted = localStorage.getItem('christmasAudioMuted') === 'true';

    const muteBtn = document.createElement('div');
    muteBtn.id = 'christmas-mute-btn-new';
    Object.assign(muteBtn.style, {
        position: 'fixed', 
        bottom: '7px', 
        right: '20px', 
        width: '40px', 
        height: '40px',
        backgroundColor: '#cc0000', 
        borderRadius: '50%', 
        display: 'none',
        justifyContent: 'center', 
        alignItems: 'center', 
        cursor: 'pointer', 
        zIndex: '10000',
        border: '2px solid white',
        boxShadow: '0 0 10px rgba(0,0,0,0.5)',
        color: 'white',
        fontSize: '24px',
        fontWeight: 'bold'
    });
    muteBtn.innerHTML = '♪';
    document.body.appendChild(muteBtn);
    console.log("Pulsante mute creato nel DOM");

    const syncAudio = (theme) => {
        if (theme === 'theme-christmas') {
            muteBtn.style.display = 'flex';
            audio.play().then(() => {
                console.log("Riproduzione avviata con successo");
            }).catch(() => {
                console.log("Autoplay bloccato: clicca ovunque per attivare");
                const startOnInteraction = () => {
                    audio.play();
                    document.removeEventListener('click', startOnInteraction);
                };
                document.addEventListener('click', startOnInteraction);
            });
        } else {
            muteBtn.style.display = 'none';
            audio.pause();
        }
    };

    const applyTheme = (name) => {
        console.log("Applicazione tema:", name);
        document.body.classList.remove(...themeClasses);
        if (name && name !== 'theme-default') document.body.classList.add(name);
        localStorage.setItem('themePreference', name);
        syncAudio(name);
    };

    muteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        audio.muted = !audio.muted;
        localStorage.setItem('christmasAudioMuted', audio.muted);
        muteBtn.style.opacity = audio.muted ? '0.5' : '1';
        console.log("Mute cambiato:", audio.muted);
    });

    if (lightButton) lightButton.addEventListener('click', () => applyTheme('theme-light'));
    if (darkButton) darkButton.addEventListener('click', () => applyTheme('theme-dark'));
    if (christmasButton) christmasButton.addEventListener('click', () => applyTheme('theme-christmas'));

    const currentTheme = localStorage.getItem('themePreference') || 'theme-light';
    applyTheme(currentTheme);

    setInterval(() => {
        if (audio && !audio.paused) {
            localStorage.setItem('christmasAudioTime', audio.currentTime);
        }
    }, 0);
});