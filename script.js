/* ===== js/script.js - Lógica del blog con comentarios y login ===== */

/* --------------- CONFIGURACIÓN --------------- */
const PASSWORD = "1234"; // Contraseña fija (puedes cambiarla para la clase)
const STORAGE_KEY = "comentarios"; // Clave en localStorage donde guardamos los comentarios

/* Variable para guardar la imagen en base64 mientras el usuario la previsualiza */
let currentImageData = null;

// Formulario de comentarios
const form = document.getElementById('comment-form');
const nameInput = document.getElementById('name');
const messageInput = document.getElementById('message');
const formError = document.getElementById('form-error');
const commentsContainer = document.getElementById('comments');
const deleteAllBtn = document.getElementById('delete-all');

let comments = JSON.parse(localStorage.getItem('comments')) || [];

// Comentarios aleatorios iniciales
if (comments.length === 0) {
  comments = [
    { name: "Ana", message: "Excelente contenido, muy útil.", likes: 0 },
    { name: "Luis", message: "Aprender con práctica es lo mejor.", likes: 0 },
    { name: "María", message: "Gracias por compartir tus conocimientos.", likes: 0 }
  ];
  saveComments();
}

function saveComments() {
  localStorage.setItem('comments', JSON.stringify(comments));
}

function loadComments() {
  commentsContainer.innerHTML = '';
  comments.forEach((c, i) => {
    const div = document.createElement('div');
    div.className = 'comment';
    div.innerHTML = `
      <h3>${c.name}</h3>
      <p>${c.message}</p>
      <button class="like-btn" onclick="likeComment(${i})">👍 Me gusta (${c.likes})</button>
      <button onclick="deleteComment(${i})">🗑 Borrar</button>
    `;
    commentsContainer.appendChild(div);
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const message = messageInput.value.trim();

  if (name.length < 3) {
    formError.textContent = "El nombre debe tener al menos 3 caracteres.";
    return;
  }

  if (message.length > 200) {
    formError.textContent = "El mensaje no puede superar las 200 palabras.";
    return;
  const reader = new FileReader();
  reader.onload = () => {
    const nuevoComentario = {
      nombre,
      mensaje,
      imagen: reader.result || "",
      likes: 0
    };
    mostrarComentario(nuevoComentario);
    guardarComentario(nuevoComentario);
  };

  if (imagen) reader.readAsDataURL(imagen);
  else reader.onload();  
  }

  comments.push({ name, message, likes: 0 });
  saveComments();
  loadComments();
  form.reset();
  formError.textContent = '';
});

function deleteComment(index) {
  comments.splice(index, 1);
  saveComments();
  loadComments();
}

deleteAllBtn.addEventListener('click', () => {
  comments = [];
  saveComments();
  loadComments();
});

window.likeComment = function(index) {
  comments[index].likes++;
  saveComments();
  loadComments();
};

loadComments();
