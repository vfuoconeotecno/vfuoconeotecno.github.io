document.addEventListener('DOMContentLoaded', () => {
    const folder = "Aziende";
    const data = [
        { label: "Accademia Vdf", val: 2, col: "#9e0000" },
        { label: "Municipio", val: 6, col: "#f1f1f1" },
        { label: "Banca Centrale", val: 2, col: "#9e0000" },
        { label: "Bottega Alfieri", val: 7, col: "#f1f1f1" },
        { label: "Caritas Chiesa", val: 8, col: "#9e0000" },
        { label: "Centro Univ. Sportivo", val: 2, col: "#f1f1f1" },
        { label: "Chiesa", val: 4, col: "#9e0000" },
        { label: "Euronyx", val: 10, col: "#f1f1f1" },
        { label: "Farmacia", val: 6, col: "#9e0000" },
        { label: "Galleria Baffoni", val: 2, col: "#f1f1f1" },
        { label: "Gioielleria", val: 6, col: "#9e0000" },
        { label: "Banca", val: 14, col: "#f1f1f1" },
        { label: "Ikea", val: 9, col: "#9e0000" },
        { label: "Universita'", val: 4, col: "#f1f1f1" },
        { label: "Magazzino", val: 4, col: "#9e0000" },
        { label: "Sushisen", val: 5, col: "#f1f1f1" },
        { label: "Market", val: 6, col: "#9e0000" },
        { label: "Tecnodrive", val: 6, col: "#f1f1f1" },
        { label: "Officina", val: 4, col: "#9e0000" },
        { label: "Ospedale", val: 13, col: "#f1f1f1" },
        { label: "Tastyburger", val: 4, col: "#9e0000" },
        { label: "Pasticceria Sweet", val: 6, col: "#f1f1f1" },
        { label: "Posta", val: 11, col: "#9e0000" },
        { label: "Rifornimenti Magazzino", val: 4, col: "#f1f1f1" },
        { label: "Scuola", val: 5, col: "#9e0000" },
        { label: "Autoscuola", val: 8, col: "#f1f1f1" },
        { label: "Steakhouse", val: 5, col: "#9e0000" },
        { label: "Fattoria", val: 13, col: "#f1f1f1" },
        { label: "Abitazioni", val: 5, col: "#9e0000" }
    ];

    const chart = document.getElementById('bar-chart');
    const maxVal = 12;

    data.forEach(item => {
        const h = (item.val / maxVal) * 100;
        const colLink = document.createElement('a');
        colLink.className = 'bar-column';
        
        const fileName = item.label.replace(/\s+/g, '').replace("'", "");
        colLink.href = `${folder}/${fileName}.html`;
        
        const integerValue = Math.floor(item.val);
        
        colLink.innerHTML = `
            <div class="bar-fill" style="height:${h}%; background-color:${item.col}">
                <span class="bar-num" style="color:${item.col}">${integerValue}</span>
            </div>
            <span class="bar-name" style="color:${item.col}">${item.label}</span>
        `;
        
        chart.appendChild(colLink);
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const slider = document.querySelector('.chart-scroll-wrapper');
    
    if (!slider) return;

    let isDown = false;
    let startX;
    let scrollLeft;


    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.style.cursor = 'grabbing';
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.style.cursor = 'grab';
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.style.cursor = 'grab';
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
    });

    slider.addEventListener('wheel', (evt) => {
        if (slider.scrollWidth > slider.clientWidth) {
            evt.preventDefault();
            slider.scrollLeft += evt.deltaY;
        }
    });
});