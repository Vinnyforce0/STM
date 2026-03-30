import { getPages, addPage, updatePage } from "./storage.js";
import { createNotePage, openNotePage } from "./pages/note.js";

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
  <div class="card-icon">${getPageIcon(p.type)}</div>
  <div class="card-title">${p.title}</div>
`;

        div.onclick = () => openPage(p.id);

        container.appendChild(div);
    });
}

/* ➕ CRIAR PÁGINA */
window.createNotePage = function () {
    createNotePage(addPage, renderHome);
};

/* 📱 ABRIR PÁGINA (OVERLAY) */
window.openPage = function (id) {
    const pages = getPages();
    const page = pages.find(p => p.id === id);

    if (page.type === "note") {
        openNotePage(page, updatePage);
    }
    // Adicionar outros tipos aqui posteriormente
};

/* 🎨 BACKGROUND */
const bg = document.getElementById("bg");
let t = 0;

function animateBackground() {
    t += 0.005;

    const x1 = 30 + Math.sin(t) * 10;
    const y1 = 40 + Math.cos(t) * 10;

    const x2 = 70 + Math.cos(t * 1.2) * 10;
    const y2 = 70 + Math.sin(t * 1.2) * 10;

    const x3 = 50 + Math.sin(t * 0.8) * 10;
    const y3 = 20 + Math.cos(t * 0.8) * 10;

    bg.style.background = `
    radial-gradient(circle at ${x1}% ${y1}%, rgba(154,50,211,0.18), transparent 60%),
    radial-gradient(circle at ${x2}% ${y2}%, rgba(0,255,200,0.15), transparent 60%),
    radial-gradient(circle at ${x3}% ${y3}%, rgba(255,122,0,0.18), transparent 60%),
    #0f0f0f
  `;

    requestAnimationFrame(animateBackground);
}

/* 🚀 INIT */
window.addEventListener("load", () => {
    renderHome();
    animateBackground();
});