import { getPages, addPage, updatePage, deletePage } from "./storage.js";
import { createNotePage, openNotePage } from "./pages/note.js";
import { createChartPage, openChartPage } from "./pages/chart.js";

const app = document.querySelector("main");


function getPageIcon(type) {
    switch (type) {
        case "note": return "📝";
        case "todo": return "✅";
        case "chart": return "📊";
        case "calendar": return "📅";
        default: return "📄";
    }
}

/* 🏠 HOME */
function renderHome() {
    const pages = getPages();

    app.innerHTML = `<div id="pages"></div>`;

    const container = document.getElementById("pages");

    pages.forEach(p => {
        const div = document.createElement("div");
        div.className = "page-card";
        div.innerHTML = `
  <div class="card-content">
    <div class="card-icon">${getPageIcon(p.type)}</div>
    <div class="card-title">${p.title}</div>
  </div>
  <button class="delete-btn" onclick="deletePage('${p.id}'); event.stopPropagation();">🗑️</button>
`;

        div.onclick = () => openPage(p.id);

        container.appendChild(div);
    });
}

/* ➕ CRIAR PÁGINA */
window.createPage = function () {
    const type = prompt("Tipo de página (note/chart):", "note");
    if (type === "note") {
        createNotePage(addPage, renderHome);
    } else if (type === "chart") {
        createChartPage(addPage, renderHome);
    }
};

/* 🗑️ DELETAR PÁGINA */
window.deletePage = function (id) {
    deletePage(id);
    renderHome();
};

/* 📱 ABRIR PÁGINA (OVERLAY) */
window.openPage = function (id) {
    const pages = getPages();
    const page = pages.find(p => p.id === id);

    if (page.type === "note") {
        openNotePage(page, updatePage);
    } else if (page.type === "chart") {
        openChartPage(page, updatePage);
    }
    // Adicionar outros tipos aqui posteriormente
};

/* 🎨 BACKGROUND */
const bg = document.getElementById("bg");
let t = 0;

function animateBackground() {
    t += 0.005;

    const x1 = 25 + Math.sin(t) * 15;
    const y1 = 35 + Math.cos(t) * 15;

    const x2 = 75 + Math.cos(t * 1.2) * 15;
    const y2 = 65 + Math.sin(t * 1.2) * 15;

    const x3 = 50 + Math.sin(t * 0.8) * 15;
    const y3 = 15 + Math.cos(t * 0.8) * 15;

    bg.style.background = `
    radial-gradient(circle at ${x1}% ${y1}%, rgba(138,43,226,0.25), transparent 70%),
    radial-gradient(circle at ${x2}% ${y2}%, rgba(75,0,130,0.2), transparent 70%),
    radial-gradient(circle at ${x3}% ${y3}%, rgba(255,20,147,0.3), transparent 70%),
    #0f0f0f
  `;

    requestAnimationFrame(animateBackground);
}

/* 🚀 INIT */
window.addEventListener("load", () => {
    renderHome();
    animateBackground();

    // Adicionar partículas estelares
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 10 + 's';
        bg.appendChild(particle);
    }

    // Adicionar nuvens espaciais
    for (let i = 0; i < 3; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'space-cloud';
        cloud.style.left = Math.random() * 100 + '%';
        cloud.style.top = Math.random() * 100 + '%';
        bg.appendChild(cloud);
    }

    // Interatividade: afastar partículas e nuvens no clique
    bg.addEventListener('click', (e) => {
        const clickX = e.clientX;
        const clickY = e.clientY;
        const elements = document.querySelectorAll('.particle, .space-cloud');

        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const elX = rect.left + rect.width / 2;
            const elY = rect.top + rect.height / 2;
            const dx = elX - clickX;
            const dy = elY - clickY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 0) {
                const moveX = (dx / distance) * 100; // afastar 100px
                const moveY = (dy / distance) * 100;
                el.style.transform = `translate(${moveX}px, ${moveY}px)`;
                setTimeout(() => {
                    el.style.transform = '';
                }, 1500); // voltar após 1.5s
            }
        });
    });
});