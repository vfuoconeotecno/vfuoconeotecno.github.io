document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('.medal-image');
    const titleElement = document.getElementById('medal-title-text');
    const descriptionSection = document.querySelector('.description-section'); 
    
    let currentIndex = 0;
    
    const intervalTime = 5000; 

    const colorClassMap = {
        'Oro': 'gold',
        'Argento': 'silver',
        'Bronzo': 'bronze'
    };
    
    const colorClasses = ['gold', 'silver', 'bronze'];
    const borderClasses = ['border-gold', 'border-silver', 'border-bronze'];

    function cycleImages() {
        images.forEach(img => img.classList.remove('active'));
        currentIndex = (currentIndex + 1) % images.length;
        const nextImage = images[currentIndex];
        nextImage.classList.add('active');

        const medalColor = nextImage.getAttribute('data-color'); 
        
        const cssClass = colorClassMap[medalColor];
        const borderClass = `border-${cssClass}`;

        titleElement.classList.remove(...colorClasses); 
        if (cssClass) {
            titleElement.classList.add(cssClass); 
        }

        descriptionSection.classList.remove(...borderClasses);
        if (borderClass) {
            descriptionSection.classList.add(borderClass);
        }
    }

    if (images.length > 0) {
        images[0].classList.add('active');
        const initialColorKey = images[0].getAttribute('data-color');
        const initialClass = colorClassMap[initialColorKey];
        
        if (initialClass) {
            titleElement.classList.add(initialClass);
        }

        const initialBorderClass = `border-${initialClass}`;
        if (initialBorderClass) {
            descriptionSection.classList.add(initialBorderClass);
        }
    }

    setInterval(cycleImages, intervalTime);
});