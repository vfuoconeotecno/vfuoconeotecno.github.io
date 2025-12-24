function handleSkinClick(clickedElement) {
    const row = clickedElement.closest('.player-row');
    row.classList.toggle('active');

    const layout = document.querySelector('.main-layout');
    const anyActive = document.querySelector('.player-row.active');
    
    if (anyActive) {
        layout.classList.add('layout-active');
    } else {
        layout.classList.remove('layout-active');
    }
}