/* ===== js/script.js - Lógica del blog con comentarios y login ===== */

/* --------------- CONFIGURACIÓN --------------- */
const PASSWORD = "1234"; // Contraseña fija (puedes cambiarla para la clase)
const STORAGE_KEY = "comentarios"; // Clave en localStorage donde guardamos los comentarios

/* Variable para guardar la imagen en base64 mientras el usuario la previsualiza */
let currentImageData = null;

/* --------------- FUNCIONES DE INICIALIZACIÓN Y LOGIN --------------- */

/* Espera a que el DOM esté listo */
document.addEventListener("DOMContentLoaded", function () {
  // Referencias a elementos importantes
  const loginModal = document.getElementById("loginModal"); // Modal de login
  const loginForm = document.getElementById("loginForm"); // Formulario de login
  const passwordInput = document.getElementById("passwordInput"); // Input de contraseña
  const loginError = document.getElementById("loginError"); // Parrafo para mostrar errores

  // Manejo del envío del formulario de login
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Evita recargar la página al enviar el formulario

    const clave = passwordInput.value; // Lee la contraseña ingresada

    if (clave === PASSWORD) { // Si la contraseña coincide
      loginModal.classList.add("hidden"); // Oculta el modal de login
      initApp(); // Inicializa la aplicación (carga comentarios, eventos, etc.)
    } else { // Si la contraseña es incorrecta
      loginError.textContent = "Contraseña incorrecta. Intenta de nuevo."; // Muestra mensaje de error
      passwordInput.value = ""; // Limpia el campo
    }
  });
});

/* --------------- INICIALIZACIÓN DE LA APP (DESPUÉS DEL LOGIN) --------------- */

/* Inicializa la aplicación: carga comentarios y añade listeners a botones e inputs */
function initApp() {
  // Cargar y mostrar comentarios guardados
  loadCommentsFromStorageAndRender();

  // Referencias a elementos del formulario
  const publicarBtn = document.getElementById("publicarBtn"); // Botón publicar
  const clearAllBtn = document.getElementById("clearAllBtn"); // Botón borrar todos
  const imagenInput = document.getElementById("imagen"); // Input de archivo
  const previewDiv = document.getElementById("preview"); // Contenedor de preview

  // Evento: vista previa de imagen al seleccionar un archivo
  imagenInput.addEventListener("change", function (e) {
    previewDiv.innerHTML = ""; // Limpia el preview anterior
    currentImageData = null; // Reinicia la imagen actual

    const file = e.target.files && e.target.files[0]; // Toma el primer archivo si existe
    if (!file) return; // Si no hay archivo, no hacer nada

    // Validación: tamaño máximo (ej. 2MB)
    const maxSizeBytes = 2 * 1024 * 1024; // 2 MB
    if (file.size > maxSizeBytes) {
      previewDiv.textContent = "La imagen es demasiado grande (máx 2 MB).";
      imagenInput.value = ""; // Limpia la selección
      return;
    }

    // Usar FileReader para convertir a base64 y mostrar preview
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = document.createElement("img"); // Crear elemento <img>
      img.src = event.target.result; // Asignar dataURL
      previewDiv.appendChild(img); // Mostrar en el preview
      currentImageData = event.target.result; // Guardar dataURL para usar al publicar
    };
    reader.readAsDataURL(file); // Inicia la lectura del archivo
  });

  // Evento: publicar comentario al hacer clic
  publicarBtn.addEventListener("click", function () {
    agregarComentario(); // Llamada a la función principal para crear comentarios
  });

  // Evento: borrar todos los comentarios
  clearAllBtn.addEventListener("click", function () {
    borrarComentarios(); // Llamada a la función que limpia localStorage y la UI
  });
}

/* --------------- FUNCIONES DE LOCALSTORAGE Y RENDER --------------- */

/* Carga los comentarios desde localStorage y los renderiza en pantalla */
function loadCommentsFromStorageAndRender() {
  const commentsList = document.getElementById("commentsList"); // Contenedor donde se agregan los comentarios
  commentsList.innerHTML = ""; // Limpia la lista antes de renderizar

  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; // Recupera array (o array vacío)
  // El array lo mantenemos de forma que el índice 0 sea el comentario más reciente (nuevo arriba)
  stored.forEach(comment => {
    renderComment(comment); // Renderiza cada comentario (append por orden)
  });
}

/* Guarda el array completo en localStorage */
function saveAllCommentsToStorage(array) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(array));
}

/* Obtiene el array de comentarios guardados en localStorage */
function getAllCommentsFromStorage() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

/* --------------- FUNCIONES PRINCIPALES: AGREGAR, RENDER, BORRAR, LIKE --------------- */

/* Agrega un comentario nuevo (toma nombre, mensaje e imagen previsualizada) */
function agregarComentario() {
  // Referencias a inputs y mensajes
  const nombreInput = document.getElementById("nombre");
  const mensajeInput = document.getElementById("mensaje");
  const formError = document.getElementById("formError");
  const previewDiv = document.getElementById("preview");

  formError.textContent = ""; // Limpiar mensajes de error previos

  const nombre = nombreInput.value.trim(); // Nombre sin espacios extra
  const mensaje = mensajeInput.value.trim(); // Mensaje sin espacios extra

  // Validaciones sencillas
  if (nombre.length < 3) {
    formError.textContent = "El nombre debe tener al menos 3 caracteres.";
    return;
  }

  if (mensaje.length === 0 || mensaje.length > 200) {
    formError.textContent = "El comentario no puede estar vacío ni superar los 200 caracteres.";
    return;
  }

  // Construir objeto comentario
  const nuevoComentario = {
    id: Date.now().toString(), // id único (timestamp)
    nombre: nombre, // nombre del autor
    mensaje: mensaje, // contenido
    fechaTexto: new Date().toLocaleString(), // fecha legible
    imagenData: currentImageData, // imagen en base64 (si la hay)
    likes: 0 // contador de likes inicial
  };

  // Guardar en localStorage: insertamos al inicio para que el más nuevo aparezca arriba
  const all = getAllCommentsFromStorage(); // obtener array
  all.unshift(nuevoComentario); // agregar al inicio
  saveAllCommentsToStorage(all); // persistir cambios

  // Renderizar el comentario nuevo (lo agregamos al comienzo de la lista en la UI)
  prependRenderComment(nuevoComentario);

  // Limpiar formulario y preview
  nombreInput.value = "";
  mensajeInput.value = "";
  document.getElementById("imagen").value = "";
  previewDiv.innerHTML = "";
  currentImageData = null;
}

/* Renderiza un comentario y lo agrega al final (para la carga inicial) */
function renderComment(comment) {
  const commentsList = document.getElementById("commentsList"); // contenedor
  const elemento = buildCommentElement(comment); // crear nodo DOM del comentario
  commentsList.appendChild(elemento); // agregar al final
}

/* Renderiza un comentario y lo agrega al principio (para comentarios nuevos) */
function prependRenderComment(comment) {
  const commentsList = document.getElementById("commentsList"); // contenedor
  const elemento = buildCommentElement(comment); // crear nodo DOM del comentario
  // Insertar antes del primer hijo (para que el nuevo quede arriba)
  commentsList.insertBefore(elemento, commentsList.firstChild);
}

/* Construye y devuelve el elemento DOM de un comentario (sin añadirlo aún) */
function buildCommentElement(comment) {
  // Crear contenedor principal
  const div = document.createElement("div");
  div.classList.add("comment"); // clase CSS
  div.dataset.id = comment.id; // atributo data-id para identificar

  // Nombre (negrita)
  const nombreEl = document.createElement("strong");
  nombreEl.textContent = comment.nombre;
  div.appendChild(nombreEl);

  // Mensaje (p)
  const mensajeEl = document.createElement("p");
  mensajeEl.textContent = comment.mensaje;
  div.appendChild(mensajeEl);

  // Fecha (small)
  const fechaEl = document.createElement("small");
  fechaEl.textContent = comment.fechaTexto;
  div.appendChild(fechaEl);

  // Imagen (si existe)
  if (comment.imagenData) {
    const img = document.createElement("img");
    img.src = comment.imagenData;
    img.alt = "Imagen subida por el usuario";
    div.appendChild(img);
  }

  // Contenedor de acciones (like, borrar)
  const actionsDiv = document.createElement("div");
  actionsDiv.classList.add("actions");

  // Botón like
  const likeBtn = document.createElement("button");
  likeBtn.classList.add("like");
  likeBtn.textContent = `👍 ${comment.likes}`; // texto con contador
  likeBtn.addEventListener("click", function () {
    // Incrementar likes en UI y storage
    comment.likes = Number(comment.likes) + 1; // actualizar contador del objeto
    likeBtn.textContent = `👍 ${comment.likes}`; // actualizar texto del botón
    updateCommentInStorage(comment.id, { likes: comment.likes }); // persistir cambio
  });
  actionsDiv.appendChild(likeBtn);

  // Botón borrar específico
  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete");
  deleteBtn.textContent = "Borrar";
  deleteBtn.addEventListener("click", function () {
    // Confirmación de borrado
    const ok = confirm("¿Quieres borrar este comentario?");
    if (!ok) return;
    // Eliminar del DOM
    div.remove();
    // Eliminar de storage
    deleteCommentFromStorage(comment.id);
  });
  actionsDiv.appendChild(deleteBtn);

  // Añadir acciones al contenedor principal
  div.appendChild(actionsDiv);

  return div; // retornar nodo DOM listo para insertar
}

/* Actualiza campos de un comentario específico en localStorage */
function updateCommentInStorage(id, updates) {
  const all = getAllCommentsFromStorage(); // obtener array completo
  const newArray = all.map(c => (c.id === id ? { ...c, ...updates } : c)); // actualizar el objeto coincidente
  saveAllCommentsToStorage(newArray); // guardar array actualizado
}

/* Elimina un comentario por id del localStorage */
function deleteCommentFromStorage(id) {
  const all = getAllCommentsFromStorage(); // obtener array
  const filtered = all.filter(c => c.id !== id); // quitar el que coincide
  saveAllCommentsToStorage(filtered); // persistir cambios
}

/* --------------- BORRAR TODOS LOS COMENTARIOS --------------- */

/* Borra todos los comentarios de la UI y de localStorage */
function borrarComentarios() {
  if (!confirm("¿Estás seguro de borrar todos los comentarios?")) return; // Confirmación
  localStorage.removeItem(STORAGE_KEY); // Eliminar clave entera
  document.getElementById("commentsList").innerHTML = ""; // Limpiar UI
}

