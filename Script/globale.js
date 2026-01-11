function syncLoader() {
    const speed = 0.006;
    const waveOffset = 1.5;
    const height = 18;
    
    const now = Date.now() * speed;
    const spans = document.querySelectorAll('.loader span');
    
    spans.forEach((span, index) => {
        let y = Math.sin(now - (index * waveOffset)) * height;
        if (y > 0) y = 0; 
        span.style.transform = `translateY(${y}px)`;
    });
    
    requestAnimationFrame(syncLoader);
}

syncLoader();

window.addEventListener('load', () => {
    setTimeout(() => {
        document.body.classList.add('page-loaded');
    }, 500);
});

document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'IMG') e.preventDefault();
}, false);

document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'IMG') e.preventDefault();
}, false);

document.addEventListener('DOMContentLoaded', () => {
    const menuIcon = document.querySelector('.menu');
    const navContainer = document.querySelector('.main-nav-desktop'); 
    const body = document.body;
    
    if (menuIcon) {
        menuIcon.addEventListener('click', (event) => {
            event.stopPropagation();
            
            body.classList.toggle('menu-open');
            
            if (body.classList.contains('menu-open')) {
                body.style.overflowY = 'hidden';
            } else {
                body.style.overflowY = 'scroll';
            }
        });
    }
    
    document.addEventListener('click', (event) => {
        if (body.classList.contains('menu-open')) {
            
            if (navContainer && !navContainer.contains(event.target)) {
                
                body.classList.remove('menu-open');
                body.style.overflowY = 'scroll';
            }
        }
    });
    
    const navLinks = document.querySelectorAll('.main-nav-desktop a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (body.classList.contains('menu-open')) {
                body.classList.remove('menu-open');
                body.style.overflowY = 'scroll';
            }
        });
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const lightButton = document.getElementById('theme-light');
    const darkButton = document.getElementById('theme-dark');
    const christmasButton = document.getElementById('theme-christmas');
    const themeClasses = ['theme-light', 'theme-dark', 'theme-christmas'];
    const CHRISTMAS_MODE_PREFERENCE = 'christmasModeEnabled';

    let metaThemeColor = document.querySelector("meta[name='theme-color']");
    if (!metaThemeColor) {
        metaThemeColor = document.createElement("meta");
        metaThemeColor.name = "theme-color";
        document.head.appendChild(metaThemeColor);
    }

    const updateMetaColor = (theme) => {
        if (theme === 'theme-christmas') {
            metaThemeColor.setAttribute("content", "#963E49");
        } else if (theme === 'theme-light') {
            metaThemeColor.setAttribute("content", "#E7E7E7");
        } else {
            metaThemeColor.setAttribute("content", "#0A0A0A");
        }
    };

    const getAudioPath = () => {
        const path = window.location.pathname;
        const s = path.split('/').filter(Boolean);

        if (path.includes('/Aziende/')) return '../../Audio/Natale.mp3';
        if (path.includes('/Personale/') && s.length >= 4) return '../../../Audio/Natale.mp3';
        if (path.includes('/Medaglie/') || path.includes('/Personale/')) return '../../Audio/Natale.mp3';
        if (s.length >= 1 && !path.endsWith('index.html') && path.includes('/')) return '../Audio/Natale.mp3';
        return './Audio/Natale.mp3';
    };

    const audioPath = getAudioPath();
    const audio = new Audio(audioPath);
    audio.loop = true;
    audio.volume = 0.05;

    const savedTime = localStorage.getItem('christmasAudioTime');
    if (savedTime) audio.currentTime = parseFloat(savedTime);
    audio.muted = localStorage.getItem('christmasAudioMuted') === 'true';

    const muteBtn = document.createElement('div');
    muteBtn.id = 'christmas-mute-btn-new';
    Object.assign(muteBtn.style, {
        position: 'fixed', bottom: '7px', right: '20px', width: '40px', height: '40px',
        backgroundColor: '#cc0000', borderRadius: '50%', display: 'none',
        justifyContent: 'center', alignItems: 'center', cursor: 'pointer', zIndex: '10000',
        border: '2px solid white', boxShadow: '0 0 10px rgba(0,0,0,0.5)',
        color: 'white', fontSize: '24px', fontWeight: 'bold'
    });
    muteBtn.innerHTML = '♪';
    document.body.appendChild(muteBtn);

    const syncAudio = (theme) => {
        if (theme === 'theme-christmas') {
            muteBtn.style.display = 'flex';
            audio.play().catch(() => {
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

    const updateButtonsVisibility = (activeTheme) => {
        const isChristmasEnabled = localStorage.getItem(CHRISTMAS_MODE_PREFERENCE) !== 'false';

        if (!isChristmasEnabled) {
            if (christmasButton) christmasButton.style.display = 'none';

            if (activeTheme === 'theme-light') {
                if (lightButton) lightButton.style.display = 'none';
                if (darkButton) darkButton.style.display = '';
            } else {
                if (darkButton) darkButton.style.display = 'none';
                if (lightButton) lightButton.style.display = ''; 
            }
        } else {
            if (christmasButton) christmasButton.style.display = '';
            if (lightButton) lightButton.style.display = '';
            if (darkButton) darkButton.style.display = '';
        }
    };

    const applyTheme = (name) => {
        document.body.classList.remove(...themeClasses);
        if (name && name !== 'theme-default') document.body.classList.add(name);
        
        localStorage.setItem('themePreference', name);
        
        syncAudio(name);
        updateButtonsVisibility(name);
        
        updateMetaColor(name);
    };

    const toggleChristmasMode = (enable) => {
        const newState = enable.toString();
        localStorage.setItem(CHRISTMAS_MODE_PREFERENCE, newState);
        
        if (!enable) {
            const currentTheme = localStorage.getItem('themePreference');
            if (currentTheme === 'theme-christmas') {
                applyTheme('theme-light');
            } else {
                updateButtonsVisibility(currentTheme);
            }
        } else {
            const currentTheme = localStorage.getItem('themePreference') || 'theme-light';
            updateButtonsVisibility(currentTheme);
        }
    };

    /* NATALE */
    toggleChristmasMode(false); 
    /* NATALE */

    muteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        audio.muted = !audio.muted;
        localStorage.setItem('christmasAudioMuted', audio.muted);
        muteBtn.style.opacity = audio.muted ? '0.5' : '1';
    });

    if (lightButton) lightButton.addEventListener('click', () => applyTheme('theme-light'));
    if (darkButton) darkButton.addEventListener('click', () => applyTheme('theme-dark'));
    
    if (christmasButton) {
        christmasButton.addEventListener('click', () => {
            const isEnabled = localStorage.getItem(CHRISTMAS_MODE_PREFERENCE) !== 'false';
            if (isEnabled) {
                applyTheme('theme-christmas');
            }
        });
    }

    const currentTheme = localStorage.getItem('themePreference') || 'theme-light';
    applyTheme(currentTheme);

    setInterval(() => {
        if (audio && !audio.paused) {
            localStorage.setItem('christmasAudioTime', audio.currentTime);
        }
    }, 0);
});

function createSnowfall() {
    if (document.querySelectorAll('.snowflake').length > 0) {
        return; 
    }
    
    const targetElement = document.body;
    const numberOfSnowflakes = 100;
    
    for (let i = 0; i < numberOfSnowflakes; i++) {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        snowflake.innerHTML = '&#10052;';

        const startX = Math.random() * 100;
        snowflake.style.left = `${startX}vw`;

        const startY = Math.random() * 100; 
        snowflake.style.top = `-${startY}vh`; 

        const duration = (Math.random() * 10) + 5; 
        
        const delay = (Math.random() * duration) * -1; 
        
        snowflake.style.animationDuration = `${duration}s`;
        snowflake.style.animationDelay = `${delay}s`;

        const size = (Math.random() * 0.8) + 0.6;
        snowflake.style.fontSize = `${size}em`;
        
        targetElement.appendChild(snowflake);
    }
}

function removeSnowfall() {
    const snowflakes = document.querySelectorAll('.snowflake');
    snowflakes.forEach(flake => {
        flake.remove(); 
    });
}

function applyTheme(newTheme) {
    const body = document.body;
    
    body.classList.remove('theme-light', 'theme-dark', 'theme-christmas');
    body.classList.add(newTheme);
    
    if (newTheme === 'theme-christmas') {
        createSnowfall(); 
    } else {
        setTimeout(() => {
            removeSnowfall(); 
        }, 350); 
    }
}

document.addEventListener('DOMContentLoaded', function() {

    if (document.body.classList.contains('theme-christmas')) {
        createSnowfall();
    }
});

    const currentYear = new Date().getFullYear(); 
    
    const yearElement = document.getElementById('current-year');
    
    if (yearElement) {
        yearElement.textContent = currentYear;
    }

document.addEventListener('DOMContentLoaded', () => {

    const existingHeader = document.querySelector('header.main-header');
    
    const updateCopyrightYear = () => {
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear(); 
        }
    };
});