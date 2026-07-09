const socket = io();

const screens = document.querySelectorAll(".screen");

function showScreen(id) {
  screens.forEach((screen) => {
    screen.classList.add("hidden");
    screen.classList.remove("flex");
  });
  document.getElementById(id).classList.remove("hidden");
  document.getElementById(id).classList.add("flex");
}

const hostBtn = document.getElementById("host");
const joinBtn = document.getElementById("join");
const cancelBtn = document.getElementById("cancel");
const backBtn = document.getElementById("back");

hostBtn.addEventListener("click", () => {
  showScreen("host-screen");
  socket.emit("host");
});

joinBtn.addEventListener("click", () => {
  showScreen("join-screen");
});

cancelBtn.addEventListener("click", () => {
  showScreen("home-screen");
});

backBtn.addEventListener("click", () => {
  showScreen("home-screen");
});

socket.on("hostCode", (code) => {});

// const form = document.getElementById("form");
// const input = document.getElementById("input");
// const messages = document.getElementById("messages");
// form.addEventListener("submit", (e) => {
//   e.preventDefault();
//   if (input.value) {
//     socket.emit("play", input.value);
//     const item = document.createElement("li");
//     item.textContent = input.value;
//     item.classList.add("sender");
//     messages.appendChild(item);
//     window.scrollTo(0, document.body.scrollHeight);
//     input.value = "rock";
//   }
// });

// socket.on("result", (msg) => {
//   alert(msg);
//   /* const item = document.createElement("li");
//         item.textContent = msg;
//         item.classList.add("receiver");
//         messages.appendChild(item);
//         window.scrollTo(0, document.body.scrollHeight); */
// });
