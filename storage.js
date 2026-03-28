const KEY = "stm_data";

/* 🔹 pegar dados */
function getData() {
  return JSON.parse(localStorage.getItem(KEY)) || { pages: [] };
}

/* 🔹 salvar dados */
function saveData(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

/* 📄 pegar páginas */
export function getPages() {
  return getData().pages;
}

/* ➕ adicionar página */
export function addPage(page) {
  const data = getData();
  data.pages.push(page);
  saveData(data);
}

/* 💾 atualizar página */
export function updatePage(updatedPage) {
  const data = getData();

  data.pages = data.pages.map(p =>
    p.id === updatedPage.id ? updatedPage : p
  );

  saveData(data);
}