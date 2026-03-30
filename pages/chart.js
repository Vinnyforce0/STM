import { addPage, updatePage } from "../storage.js";

export function createChartPage(addPageCallback, renderHomeCallback) {
    const title = prompt("Nome da página:");

    if (!title) return;

    const newPage = {
        id: Date.now().toString(),
        title,
        type: "chart",
        content: JSON.stringify([]) // array de {label, value, color}
    };

    addPageCallback(newPage);
    renderHomeCallback();
}

export function openChartPage(page, updatePageCallback) {
    let elements = JSON.parse(page.content || "[]");

    const overlay = document.createElement("div");
    overlay.className = "page-overlay";

    overlay.innerHTML = `
  <div class="page-header">
    <span class="page-title">${page.title}</span>
    <button class="close-btn">✕</button>
  </div>

  <div class="page-content">
    <div class="chart-container">
      <canvas id="chartCanvas" width="300" height="300"></canvas>
      <div class="chart-controls">
        <input type="text" id="labelInput" placeholder="Rótulo">
        <input type="number" id="valueInput" placeholder="Valor">
        <button id="addBtn">Adicionar</button>
      </div>
      <div id="elementsList"></div>
    </div>
  </div>
`;

    document.body.appendChild(overlay);

    const canvas = overlay.querySelector("#chartCanvas");
    const ctx = canvas.getContext("2d");
    const labelInput = overlay.querySelector("#labelInput");
    const valueInput = overlay.querySelector("#valueInput");
    const addBtn = overlay.querySelector("#addBtn");
    const elementsList = overlay.querySelector("#elementsList");

    function drawChart() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (elements.length === 0) return;

        const total = elements.reduce((sum, el) => sum + el.value, 0);
        let startAngle = 0;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 100;

        elements.forEach(el => {
            const sliceAngle = (el.value / total) * 2 * Math.PI;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
            ctx.closePath();
            ctx.fillStyle = el.color;
            ctx.fill();
            startAngle += sliceAngle;
        });
    }

    function updateElementsList() {
        elementsList.innerHTML = "";
        elements.forEach((el, index) => {
            const div = document.createElement("div");
            div.className = "element-item";
            div.innerHTML = `
                <span>${el.label}: ${el.value}</span>
                <button class="remove-btn" data-index="${index}">Remover</button>
            `;
            elementsList.appendChild(div);
        });
    }

    function save() {
        page.content = JSON.stringify(elements);
        updatePageCallback(page);
    }

    addBtn.addEventListener("click", () => {
        const label = labelInput.value.trim();
        const value = parseFloat(valueInput.value);
        if (label && !isNaN(value) && value > 0) {
            const colors = ["#ff6384", "#36a2eb", "#cc65fe", "#ffce56", "#ff9f40"];
            elements.push({ label, value, color: colors[elements.length % colors.length] });
            labelInput.value = "";
            valueInput.value = "";
            updateElementsList();
            drawChart();
            save();
        }
    });

    elementsList.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-btn")) {
            const index = parseInt(e.target.dataset.index);
            elements.splice(index, 1);
            updateElementsList();
            drawChart();
            save();
        }
    });

    /* ❌ fechar */
    overlay.querySelector(".close-btn").onclick = () => {
        overlay.remove();
    };

    updateElementsList();
    drawChart();
}