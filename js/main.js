import { ui, personIcon } from "./ui.js";
import { getNoteIcon, formatDate, getStatus, statusObj } from "./helpers.js";
// Global degiskenler

const STATE = {
  map: null,
  layer: null,
  clickedCoords: null,
  notes: JSON.parse(localStorage.getItem("notes") || "[]"),
};

// kullanicinin konumuna göre haritayi yükle
window.navigator.geolocation.getCurrentPosition(
  (e) => loadMap([e.coords.latitude, e.coords.longitude]), //haritayi yükle
  () => loadMap([41.104187, 29.051014])
);

function loadMap(position) {
  //harita kurulumu
  STATE.map = L.map("map", { zoomControl: false }).setView(position, 11);

  //haritaya arayüz ekle
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
  }).addTo(STATE.map);

  // kontrolcüyü sağ alta taşı
  L.control.zoom({ position: "bottomright" }).addTo(STATE.map);

  // harita üzerinde bir layer oluştur
  STATE.layer = L.layerGroup().addTo(STATE.map);

  // ekrana marker bas
  const marker = L.marker(position, { icon: personIcon }).addTo(STATE.map);

  marker.bindPopup("<b>Buradasın</b>");

  STATE.map.on("click", onMapClick);

  renderNoteCards(STATE.notes);
  renderMarker(STATE.notes);
}

function onMapClick(e) {
  console.log(e);

  // Son tiklanan konumu al
  STATE.clickedCoords = [e.latlng.lat, e.latlng.lng];

  ui.aside.classList.add("add");

  ui.asideTitle.textContent = "Yeni Not";
}

ui.cancelButton.addEventListener("click", () => {
  ui.aside.classList.remove("add");

  ui.asideTitle.textContent = "Notlar";
});

ui.arrow.addEventListener("click", () => {
  ui.aside.classList.toggle("hide");
});

ui.form.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = e.target[0].value;
  const date = e.target[1].value;
  const status = e.target[2].value;

  if (!title || !date || !status) {
    return alert("alanlar bos olmaz");
  }

  const newNote = {
    id: new Date().getTime(),
    title,
    date,
    status,
    coords: STATE.clickedCoords,
  };

  STATE.notes.push(newNote);

  // localStorage a kaydet
  localStorage.setItem("notes", JSON.stringify(STATE.notes));

  // ekleme modunu kapat
  ui.aside.classList.remove("add");
  ui.asideTitle.textContent = "Notlar";

  //noktalari ekrana bas
  renderNoteCards(STATE.notes);
  renderMarker(STATE.notes);
});

function renderNoteCards(notes) {
  const notesHtml = notes
    .map(
      (note) => `
        <li>
          <div>
            <h3>${note.title}</h3>
            <p>${formatDate(note.date)}</p>
            <p class="status">${getStatus(note.status)}</p>
          </div>
          <div class="icons">
            <i data-id="${
              note.id
            }" id="fly-btn" class="bi bi-airplane-fill"></i>
            <i data-id="${note.id}" id="trash-btn" class="bi bi-trash"></i>
          </div>
        </li> `
    )
    .join(" ");

  // htmli ekle
  ui.noteList.innerHTML = notesHtml;

  document.querySelectorAll("#trash-btn").forEach((btn) => {
    const id = +btn.dataset.id;

    btn.addEventListener("click", () => deleteNote(id));
  });

  document.querySelectorAll("#fly-btn").forEach((btn) => {
    //id ye eris
    const id = +btn.dataset.id;

    //tiklanma ani
    btn.addEventListener("click", () => flyToNote(id));
  });
}
const deleteNote = (id) => {
  // Onay al
  if (!confirm("Silmek istedigine emin misin?")) return;
  //diziden kaldir
  STATE.notes = STATE.notes.filter((note) => note.id !== id);

  localStorage.setItem("notes", JSON.stringify(STATE.notes));

  //aryuzu guncelle
  renderMarker(STATE.notes);
  renderNoteCards(STATE.notes);
};

const flyToNote = (id) => {
  const note = STATE.notes.find((note) => note.id === id);

  STATE.map.flyTo(note.coords, 15);
};
function renderMarker(notes) {
  STATE.layer.clearLayers();
  // note dizisini dön her biri icin ekrana bas
  notes.forEach((note) => {
    // note iconunu al
    const icon = getNoteIcon(note.status);

    // marker oluştur
    const marker = L.marker(note.coords, { icon }).addTo(STATE.layer);

    // note'ların başlığını popup olarak marker'a ekle
    marker.bindPopup(`<p class="popup">${note.title}<p>`);
  });
}
