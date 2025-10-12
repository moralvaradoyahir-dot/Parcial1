// --- CONTRASEÑA DE ACCESO -- 
const PASSWORD "13245"
const contraseñaCorrecta = "13245";
const loginBtn = document.getElementById("login-btn");
const loginMsg = document.getElementById("login-msg");

loginBtn.onclick = () => {
  const pass = document.getElementById("password").value;
  if (pass === PASSWORD) {
    document.getElementById("login-section").classList.add("hidden");
    document.getElementById("blog-section").classList.remove("hidden");
    cargarComentarios();
  } else {
    loginMsg.textContent = "Contraseña incorrecta.";
  }
};

// --- VARIABLES ---
const form = document.getElementById("commentForm");
const lista = document.getElementById("lista-comentarios");
const borrarTodosBtn = document.getElementById("borrar-todos");
const preview = document.getElementById("preview");

// --- VISTA PREVIA DE IMAGEN ---
document.getElementById("imagen").addEventListener("change", function() {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      preview.innerHTML = <img src="${e.target.result}" alt="Vista previa">;
    };
    reader.readAsDataURL(file);
  } else {
    preview.innerHTML = "";
  }
});

// --- PUBLICAR COMENTARIO ---
form.addEventListener("submit", e => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value.trim();
  const mensaje = document.getElementById("mensaje").value.trim();
  const img = document.getElementById("imagen").files[0];

  if (nombre.length < 3) return alert("El nombre debe tener al menos 3 caracteres.");
  if (mensaje.length > 200) return alert("El mensaje no puede tener más de 200 caracteres.");

  const lector = new FileReader();
  lector.onloadend = () => {
    const nuevo = {
      id: Date.now(),
      nombre,
      mensaje,
      imagen: lector.result || "",
      likes: 0
    };
    guardarComentario(nuevo);
    mostrarComentario(nuevo);
    form.reset();
    preview.innerHTML = "";
  };
  if (img) lector.readAsDataURL(img);
  else lector.onloadend();
});

// --- MOSTRAR COMENTARIO ---
function mostrarComentario(c) {
  const div = document.createElement("div");
  div.classList.add("comentario");
  div.innerHTML = `
    <strong>${c.nombre}</strong>
    <p>${c.mensaje}</p>
    ${c.imagen ? <img src="${c.imagen}"> : ""}
    <button class="like-btn ${c.liked ? "liked" : ""}">❤ ${c.likes}</button>
    <button class="boton-borrar">Borrar</button>
  `;

  div.querySelector(".boton-borrar").onclick = () => borrarComentario(c.id);
  const likeBtn = div.querySelector(".like-btn");
  likeBtn.onclick = () => {
    c.likes++;
    likeBtn.textContent = ❤ ${c.likes};
    likeBtn.classList.add("liked");
    actualizarComentario(c);
  };

  if (c.esEspecial) div.classList.add("ultimo-post");

  lista.appendChild(div);
}

// --- LOCAL STORAGE ---
function guardarComentario(c) {
  const comentarios = JSON.parse(localStorage.getItem("comentarios")) || [];
  comentarios.push(c);
  localStorage.setItem("comentarios", JSON.stringify(comentarios));
}

function cargarComentarios() {
  const comentarios = JSON.parse(localStorage.getItem("comentarios")) || [];
  lista.innerHTML = "";
  comentarios.forEach(mostrarComentario);
}

function borrarComentario(id) {
  let comentarios = JSON.parse(localStorage.getItem("comentarios")) || [];
  comentarios = comentarios.filter(c => c.id !== id);
  localStorage.setItem("comentarios", JSON.stringify(comentarios));
  cargarComentarios();
}

borrarTodosBtn.onclick = () => {
  localStorage.removeItem("comentarios");
  lista.innerHTML = "";
};

// --- ACTUALIZAR "ME GUSTA" ---
function actualizarComentario(c) {
  const comentarios = JSON.parse(localStorage.getItem("comentarios")) || [];
  const i = comentarios.findIndex(x => x.id === c.id);
  if (i !== -1) comentarios[i] = c;
  localStorage.setItem("comentarios", JSON.stringify(comentarios));
}

// --- COMENTARIOS INICIALES ---
window.onload = () => {
  if (!localStorage.getItem("comentarios")) {
    const randoms = [
      { id: 1, nombre: "Ana", mensaje: "¡Qué bonito paisaje!", imagen: "https://picsum.photos/seed/paisaje1/100", likes: 2 },
      { id: 2, nombre: "Luis", mensaje: "Me encanta la naturaleza.", imagen: "https://picsum.photos/seed/paisaje2/100", likes: 1 },
      { id: 3, nombre: "Marta", mensaje: "Un lugar increíble para relajarse 🌿", imagen: "https://picsum.photos/seed/paisaje3/100", likes: 4 },
      {
        id: 4,
        nombre: "Autor",
        mensaje:
          "Realizar un examen práctico es esencial para consolidar los conocimientos adquiridos en programación web y fortalecer tu formación como ingeniero en sistemas computacionales.",
        imagen: "",
        likes: 0,
        esEspecial: true
      }
    ];
    localStorage.setItem("comentarios", JSON.stringify(randoms));
  }
};
