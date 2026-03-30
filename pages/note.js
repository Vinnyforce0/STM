import { addPage, updatePage } from "../storage.js";

export function createNotePage(addPageCallback, renderHomeCallback) {
    const title = prompt("Nome da página:");

    if (!title) return;

    const newPage = {
        id: Date.now().toString(),
        title,
        type: "note",
        content: ""
    };

    addPageCallback(newPage);
    renderHomeCallback();
}

export function openNotePage(page, updatePageCallback) {
    const overlay = document.createElement("div");
    overlay.className = "page-overlay";

    overlay.innerHTML = `
  <div class="page-header">
    <span class="page-title">${page.title}</span>
    <button class="close-btn">✕</button>
  </div>

  <div class="page-content">
    <textarea id="noteArea">${page.content}</textarea>
  </div>
`;

    document.body.appendChild(overlay);

    /* ❌ fechar */
    overlay.querySelector(".close-btn").onclick = () => {
        overlay.remove();
    };

    /* 💾 auto-save */
    const textarea = overlay.querySelector("#noteArea");
    textarea.focus();

    textarea.addEventListener("input", (e) => {
        page.content = e.target.value;
        updatePageCallback(page);
    });
}