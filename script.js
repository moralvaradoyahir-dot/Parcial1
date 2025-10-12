// Contraseña
const PASSWORD = "13245";
const loginBtn = document.getElementById("login-btn");
const loginMsg = document.getElementById("login-msg");
const loginSection = document.getElementById("login-section");
const blogSection = document.getElementById("blog-section");

loginBtn.onclick = () => {
  const pass = document.getElementById("password").value;
  if(pass === PASSWORD){
    loginSection.classList.add("hidden");
    blogSection.classList.remove("hidden");
  } else {
    loginMsg.textContent = "Contraseña incorrecta";
  }
}

// Comentarios
const form = document.getElementById("comment-form");
const commentsDiv = document.getElementById("comments");
const nameInput = document.getElementById("name");
const messageInput = document.getElementById("message");
const imageInput = document.getElementById("image-input");
const preview = document.getElementById("preview");

// Cargar likes guardados
let comments = JSON.parse(localStorage.getItem("comments")) || [];
comments.forEach(c => showComment(c));

imageInput.onchange = () => {
  const file = imageInput.files[0];
  if(file){
    preview.src = URL.createObjectURL(file);
    preview.classList.remove("hidden");
  }
};

form.onsubmit = (e) => {
  e.preventDefault();
  
  const name = nameInput.value.trim();
  const message = messageInput.value.trim();
  
  if(name.length < 3) { alert("Nombre mínimo 3 letras"); return; }
  if(message.length > 200) { alert("Mensaje máximo 200 caracteres"); return; }
  
  const reader = new FileReader();
  reader.onload = function() {
    const comment = {
      name, 
      message, 
      image: reader.result,
      likes: 0
    };
    comments.push(comment);
    localStorage.setItem("comments", JSON.stringify(comments));
    showComment(comment);
    form.reset();
    preview.classList.add("hidden");
  }
  if(imageInput.files[0]){
    reader.readAsDataURL(imageInput.files[0]);
  } else {
    reader.onload();
  }
};

function showComment(comment){
  const div = document.createElement("div");
  div.classList.add("comment");
  div.innerHTML = `
    <strong>${comment.name}</strong>
    <p>${comment.message}</p>
    ${comment.image ? <img src="${comment.image}" style="max-width:100%"> : ""}
    <button class="like-btn">Me gusta (${comment.likes})</button>
  `;
  const likeBtn = div.querySelector(".like-btn");
  likeBtn.onclick = () => {
    comment.likes++;
    localStorage.setItem("comments", JSON.stringify(comments));
    likeBtn.textContent = Me gusta (${comment.likes});
  };
  commentsDiv.appendChild(div);
}
