// --- LOGIN CON CONTRASEÑA ---
const loginDiv = document.getElementById("login");
const blogDiv = document.getElementById("blog");
const loginBtn = document.getElementById("loginBtn");
const passwordInput = document.getElementById("password");
const errorMsg = document.getElementById("errorMsg");

const PASSWORD = "WEB12679"; // Contraseña con letras y números

loginBtn.addEventListener("click", () => {
  if (passwordInput.value === PASSWORD) {
    loginDiv.classList.add("hidden");
    blogDiv.classList.remove("hidden");
  } else {
    errorMsg.textContent = "Contraseña incorrecta. Intenta de nuevo.";
  }
});

// --- COMENTARIOS ---
const form = document.getElementById("commentForm");
const comentariosDiv = document.getElementById("comentarios");
const imagenInput = document.getElementById("imagen");
const previewDiv = document.getElementById("preview");
const borrarTodosBtn = document.getElementById("borrarTodos");

// Cargar comentarios y likes desde localStorage
let comentarios = JSON.parse(localStorage.getItem("comentarios")) || [];

// Mostrar comentarios guardados
window.addEventListener("load", mostrarComentarios);

// --- Vista previa de imagen ---
imagenInput.addEventListener("change", () => {
  previewDiv.innerHTML = "";
  const file = imagenInput.files[0];
  if (file) {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    previewDiv.appendChild(img);
  }
});

// --- Validación y publicación ---
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value.trim();
  const mensaje = document.getElementById("mensaje").value.trim();

  if (nombre.length < 3) {
    alert("El nombre debe tener al menos 3 caracteres.");
    return;
  }
  if (mensaje.length > 200) {
    alert("El mensaje no puede superar los 200 caracteres.");
    return;
  }

  let imgURL = "";
  if (imagenInput.files[0]) {
    imgURL = URL.createObjectURL(imagenInput.files[0]);
  }

  const nuevoComentario = {
    id: Date.now(),
    nombre,
    mensaje,
    imgURL,
    likes: 0
  };

  comentarios.push(nuevoComentario);
  guardarYMostrar();
  form.reset();
  previewDiv.innerHTML = "";
});

// --- Mostrar comentarios ---
function mostrarComentarios() {
  comentariosDiv.innerHTML = "";
  comentarios.forEach(c => {
    const div = document.createElement("div");
    div.classList.add("comentario");
    div.innerHTML = `
      <strong>${c.nombre}</strong><p>${c.mensaje}</p>
      ${c.imgURL ? <img src="${c.imgURL}" alt="imagen"> : ""}
      <button onclick="borrarComentario(${c.id})">Borrar</button>
      <button onclick="likeComentario(${c.id})">❤ ${c.likes}</button>
    `;
    comentariosDiv.appendChild(div);
  });
}

// --- Borrar comentario ---
function borrarComentario(id) {
  comentarios = comentarios.filter(c => c.id !== id);
  guardarYMostrar();
}

// --- Borrar todos los comentarios ---
borrarTodosBtn.addEventListener("click", () => {
  if (confirm("¿Seguro que quieres borrar todos los comentarios?")) {
    comentarios = [];
    guardarYMostrar();
  }
});

// --- Like persistente ---
function likeComentario(id) {
  const c = comentarios.find(x => x.id === id);
  if (c) c.likes++;
  guardarYMostrar();
}

// --- Guardar en localStorage ---
function guardarYMostrar() {
  localStorage.setItem("comentarios", JSON.stringify(comentarios));
  mostrarComentarios();
}

// --- Comentarios iniciales random ---
if (comentarios.length === 0) {
  comentarios = [
    { id: 1, nombre: "Ana", mensaje: "¡Qué buen día para programar!", imgURL: "https://picsum.photos/100?1", likes: 2 },
    { id: 2, nombre: "Luis", mensaje: "Aprendiendo JavaScript con gusto 😎", imgURL: "https://picsum.photos/100?2", likes: 5 },
    { id: 3, nombre: "María", mensaje: "HTML + CSS = 💖", imgURL: "https://picsum.photos/100?3", likes: 3 }
  ];
  guardarYMostrar();
}
