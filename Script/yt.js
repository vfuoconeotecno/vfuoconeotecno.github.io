document.addEventListener("DOMContentLoaded", function() {

    const modal = document.getElementById("videoModal");
    const modalIframe = document.getElementById("modalIframe");
    const closeBtn = document.querySelector(".close-btn");

    const youtubeOverlays = document.querySelectorAll('.yt-lazy-load');

    youtubeOverlays.forEach(overlay => {
        const videoId = overlay.getAttribute('data-id');
        
        if (videoId) {
            overlay.style.backgroundImage = `url('https://img.youtube.com/vi/${videoId}/maxresdefault.jpg')`;
        }

        overlay.addEventListener('click', function() {
            openModal(videoId);
        });
    });
    
    function openModal(videoId) {
        modalIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
        
        modal.classList.add("show");
    }

    function closeModal() {
        modal.classList.remove("show");
        
        setTimeout(() => {
            modalIframe.src = ""; 
        }, 300);
    }

    closeBtn.addEventListener("click", closeModal);

    window.addEventListener("click", function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    const filterButtons = document.querySelectorAll('.filter-btn');
    const videoCards = document.querySelectorAll('.video-card');

    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const filterValue = button.getAttribute('data-filter');
                
                videoCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    if (filterValue === 'all' || filterValue === cardCategory) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
});