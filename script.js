// Contraseña
const PASSWORD = "67859";
const loginBtn = document.getElementById("login-btn");
const loginMsg = document.getElementById("login-msg");

loginBtn.onclick = () => {
  const pass = document.getElementById("password").value;
  if (pass === PASSWORD) {
    document.getElementById("login-section").classList.add("hidden");
    document.getElementById("blog").classList.remove("hidden");
  } else {
    loginMsg.textContent = "Contraseña incorrecta.";
    loginMsg.style.color = "red";
  }
};

// Variables
const form = document.getElementById("comment-form");
const comentariosDiv = document.getElementById("comentarios");
const borrarTodosBtn = document.getElementById("borrar-todos");
const previewDiv = document.getElementById("preview");

// Cargar comentarios guardados
window.onload = function() {
  const guardados = JSON.parse(localStorage.getItem("comentarios")) || [];
  guardados.forEach(c => mostrarComentario(c));
  agregarComentariosRandom();
};

// Validar formulario y agregar comentario
form.addEventListener("submit", e => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const mensaje = document.getElementById("mensaje").value.trim();
  const imagen = document.getElementById("imagen").files[0];

  if (nombre.length < 3) {
    alert("El nombre debe tener al menos 3 caracteres");
    return;
  }

  if (mensaje.length > 200) {
    alert("El mensaje no puede tener más de 200 caracteres");
    return;
  }

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
  
  form.reset();
  previewDiv.innerHTML = "";
});

// Vista previa de imagen
document.getElementById("imagen").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    previewDiv.innerHTML = <img src="${reader.result}" alt="Vista previa">;
  };
  reader.readAsDataURL(file);
});

// Mostrar comentario
function mostrarComentario(c) {
  const div = document.createElement("div");
  div.className = "comentario";
  div.innerHTML = `
    <h3>${c.nombre}</h3>
    <p>${c.mensaje}</p>
    ${c.imagen ? <img src="${c.imagen}" alt="imagen"> : ""}
    <button class="like ${c.liked ? "liked" : ""}">❤ ${c.likes || 0}</button>
    <button class="borrar">🗑 Borrar</button>
  `;
  
  // Botón Me gusta
  const likeBtn = div.querySelector(".like");
  likeBtn.onclick = () => {
    c.likes = (c.likes || 0) + 1;
    likeBtn.textContent = ❤ ${c.likes};
    likeBtn.classList.add("liked");
    actualizarLocalStorage();
  };

  // Borrar comentario
  div.querySelector(".borrar").onclick = () => {
    div.remove();
    eliminarComentario(c);
  };

  comentariosDiv.appendChild(div);
}

// Guardar comentario en localStorage
function guardarComentario(c) {
  const guardados = JSON.parse(localStorage.getItem("comentarios")) || [];
  guardados.push(c);
  localStorage.setItem("comentarios", JSON.stringify(guardados));
}

function eliminarComentario(c) {
  let guardados = JSON.parse(localStorage.getItem("comentarios")) || [];
  guardados = guardados.filter(x => x.mensaje !== c.mensaje);
  localStorage.setItem("comentarios", JSON.stringify(guardados));
}

function actualizarLocalStorage() {
  const todos = [];
  document.querySelectorAll(".comentario").forEach(div => {
    todos.push({
      nombre: div.querySelector("h3").textContent,
      mensaje: div.querySelector("p").textContent,
      imagen: div.querySelector("img") ? div.querySelector("img").src : "",
      likes: parseInt(div.querySelector(".like").textContent.replace("❤ ", ""))
    });
  });
  localStorage.setItem("comentarios", JSON.stringify(todos));
}

// Borrar todos los comentarios
borrarTodosBtn.onclick = () => {
  comentariosDiv.innerHTML = "";
  localStorage.removeItem("comentarios");
};

// Comentarios random iniciales
function agregarComentariosRandom() {
  if (localStorage.getItem("comentarios")) return;
  const randoms = [
    { nombre: "Ana", mensaje: "¡Qué bonito blog!", imagen: "https://picsum.photos/100", likes: 1 },
    { nombre: "Luis", mensaje: "Muy interesante el contenido.", imagen: "https://picsum.photos/101", likes: 3 },
    { nombre: "Marta", mensaje: "Me encanta este proyecto.", imagen: "https://picsum.photos/102", likes: 2 }
  ];
  randoms.forEach(c => mostrarComentario(c));
  localStorage.setItem("comentarios", JSON.stringify(randoms));
}
