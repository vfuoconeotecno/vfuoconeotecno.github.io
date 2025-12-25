document.addEventListener('DOMContentLoaded', () => {
    const folder = "Aziende";
    const data = [
        { label: "Accademia Vdf", val: 2, col: "#3d1414" },
        { label: "Municipio", val: 11, col: "#995500" },
        { label: "Banca Centrale", val: 2, col: "#dac618ff" },
        { label: "Bottega Alfieri", val: 10, col: "#668800" },
        { label: "Caritas Chiesa", val: 5, col: "#229922" },
        { label: "Centro Univ. Sportivo", val: 2, col: "#229922" },
        { label: "Chiesa", val: 4, col: "#006666" },
        { label: "Euronyx", val: 9, col: "#004477" },
        { label: "Farmacia", val: 7, col: "#004477" },
        { label: "Galleria Baffoni", val: 1, col: "#440088" },
        { label: "Gioielleria", val: 7, col: "#440088" },
        { label: "Banca", val: 2, col: "#880044" },
        { label: "Ikea", val: 3, col: "#880044" },
        { label: "Universita'", val: 6, col: "#3d1414" },
        { label: "Magazzino", val: 5, col: "#995500" },
        { label: "Sushisen", val: 7, col: "#dac618ff" },
        { label: "Market", val: 4, col: "#668800" },
        { label: "Tecnodrive", val: 8, col: "#229922" },
        { label: "Officina", val: 7, col: "#229922" },
        { label: "Ospedale", val: 12, col: "#006666" },
        { label: "Tastyburger", val: 7, col: "#004477" },
        { label: "Pasticceria Sweet", val: 5, col: "#004477" },
        { label: "Posta", val: 11, col: "#440088" },
        { label: "Rifornimenti Magazzino", val: 5, col: "#440088" },
        { label: "Scuola", val: 4, col: "#880044" },
        { label: "Autoscuola", val: 8, col: "#880044" },
        { label: "Steakhouse", val: 3, col: "#3d1414" },
        { label: "Abitazioni", val: 11, col: "#995500" }
    ];

    const chart = document.getElementById('bar-chart');
    const maxVal = 12;

    data.forEach(item => {
        const h = (item.val / maxVal) * 100;
        const colLink = document.createElement('a');
        colLink.className = 'bar-column';
        
        const fileName = item.label.replace(/\s+/g, '').replace("'", "");
        colLink.href = `${folder}/${fileName}.html`;
        
        colLink.innerHTML = `
            <div class="bar-fill" style="height:${h}%; background-color:${item.col}">
                <span class="bar-num" style="color:${item.col}">${item.val}</span>
            </div>
            <span class="bar-name" style="color:${item.col}">${item.label}</span>
        `;
        chart.appendChild(colLink);
    });
});