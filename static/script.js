const adjectives = [
  "Quick",
  "Silent",
  "Brave",
  "Wise",
  "Swift",
  "Clever",
  "Bold",
];
const nouns = ["Fox", "Wolf", "Eagle", "Bear", "Hawk", "Owl", "Tiger"];
let username = "";
let ws = null;

function generateUsername() {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adj}${noun}${Math.floor(Math.random() * 1000)}`;
}

async function initializeChat() {
  username = generateUsername();
  await fetch("/users/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  }).catch((err) => console.error("Error creating user:", err));

  // Initialize WebSocket connection
  ws = new WebSocket(`ws://${window.location.host}/ws`);
  ws.onopen = () => console.log("WebSocket connected");
  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    const chat = document.getElementById("chat");
    const div = document.createElement("div");
    div.classList.add("msg");
    div.classList.add(msg.username === username ? "me" : "other");
    div.innerHTML = `<div>${msg.username}: ${msg.content}</div>
                        <div class="time">${new Date().toLocaleTimeString()}</div>`;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
  };
  ws.onclose = () => console.log("WebSocket disconnected");
  ws.onerror = (err) => console.error("WebSocket error:", err);

  // Load initial messages
  loadMessages();
}

async function sendMessage() {
  const content = document.getElementById("message").value.trim();
  if (!content || !username || !ws || ws.readyState !== WebSocket.OPEN) return;
  ws.send(JSON.stringify({ username, content }));
  document.getElementById("message").value = "";
}

async function loadMessages() {
  const res = await fetch("/messages/");
  const msgs = await res.json();
  const chat = document.getElementById("chat");
  chat.innerHTML = "";
  msgs.reverse().forEach((m) => {
    const div = document.createElement("div");
    div.classList.add("msg");
    div.classList.add(m.username === username ? "me" : "other");
    div.innerHTML = `<div>${m.username}: ${m.content}</div>
                        <div class="time">${new Date(
                          m.created_at
                        ).toLocaleTimeString()}</div>`;
    chat.appendChild(div);
  });
  chat.scrollTop = chat.scrollHeight;
}

document.getElementById("send").onclick = sendMessage;
document.getElementById("message").addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

window.onload = initializeChat;
