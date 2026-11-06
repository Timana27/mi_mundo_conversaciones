const levels = [
  {
    emoji: "👋", 
    title: "Aprendemos a saludar", 
    scene: "Llegas al salón y encuentras a tu compañero.", 
    image: "https://img.freepik.com/vector-gratis/ninos-pequeños-saludandose-escuela_29937-4856.jpg",
    question: "¿Qué puedes decirle?",
    answers: ["¡Hola! ¿Cómo estás?", "No quiero hablar contigo.", "Me voy sin saludar."],
    correct: 0, 
    explanation: "¡Muy bien! Saludar con amabilidad es una buena forma de comenzar una conversación."
  },
  {
    emoji: "❓", 
    title: "Aprendemos a preguntar", 
    scene: "Tu amiga tiene un juguete nuevo y quieres conocerlo.", 
    image: "https://img.freepik.com/vector-gratis/ninos-jugando-juguetes-juntos_29937-5120.jpg",
    question: "¿Qué podrías preguntarle?",
    answers: ["¡Dámelo ahora!", "¿Cómo se llama tu juguete?", "No me interesa."],
    correct: 1, 
    explanation: "¡Excelente! Hacer preguntas nos ayuda a conocer mejor a otras personas."
  },
  {
    emoji: "😊", 
    title: "Expresamos emociones", 
    scene: "Estás feliz porque jugaste con tus amigos.", 
    image: "https://img.freepik.com/vector-gratis/ninos-felices-jugando-pelota-parque_29937-5200.jpg",
    question: "¿Cómo puedes contarles cómo te sientes?",
    answers: ["Estoy feliz porque jugué con mis amigos.", "No voy a decir nada.", "Todos deben estar tristes."],
    correct: 0, 
    explanation: "¡Genial! Podemos compartir nuestros sentimientos usando palabras."
  },
  {
    emoji: "👂", 
    title: "Aprendemos a escuchar", 
    scene: "Tu compañero te está contando algo que le pasó.", 
    image: "https://img.freepik.com/vector-gratis/nino-explicando-algo-su-amiga_29937-4980.jpg",
    question: "¿Qué debes hacer mientras habla?",
    answers: ["Interrumpirlo todo el tiempo.", "Escucharlo y esperar mi turno.", "Ignorarlo y jugar."],
    correct: 1, 
    explanation: "¡Así se hace! Escuchar con atención y esperar nuestro turno demuestra respeto."
  },
  {
    emoji: "🤝", 
    title: "Conversamos con respeto", 
    scene: "No puedes abrir tu lonchera y necesitas ayuda.", 
    image: "https://img.freepik.com/vector-gratis/nina-pidiendo-ayuda-su-profesora_29937-5310.jpg",
    question: "¿Qué puedes decirle a tu profesora?",
    answers: ["¡Ayúdame, por favor!", "¡Hazlo ahora!", "Gritar y enojarme."],
    correct: 0, 
    explanation: "¡Muy bien! Pedir ayuda con respeto hace que podamos entendernos mejor."
  }
];

const $ = (id) => document.getElementById(id);
const welcome = $("welcome");
const game = $("game");
const finish = $("finish");
let currentLevel = 0;
let stars = 0;
let player = "Ana";
let answered = false;

function showScreen(screen) {
  [welcome, game, finish].forEach(s => s.classList.add("hidden"));
  screen.classList.remove("hidden");
}

function startGame() {
  player = $("playerName").value.trim() || "Ana";
  currentLevel = 0;
  stars = 0;
  $("stars").textContent = stars;
  showScreen(game);
  renderLevel();
}

function renderLevel() {
  const level = levels[currentLevel];
  answered = false;
  $("levelLabel").textContent = `Nivel ${currentLevel + 1} de ${levels.length}`;
  const progressPercent = Math.round((currentLevel / levels.length) * 100);
  $("progressText").textContent = `${progressPercent}%`;
  $("progressBar").style.width = `${progressPercent}%`;
  
  $("levelEmoji").textContent = level.emoji;
  $("levelTitle").textContent = level.title;
  $("sceneImg").src = level.image;
  $("sceneText").textContent = level.scene;
  $("questionText").textContent = level.question;
  
  $("feedback").className = "feedback hidden";
  $("feedback").textContent = "";
  $("nextBtn").classList.add("hidden");

  const answers = $("answers");
  answers.innerHTML = "";
  level.answers.forEach((answer, index) => {
    // Contenedor de la fila para separar el botón de respuesta y la bocina
    const row = document.createElement("div");
    row.className = "answer-row";

    const button = document.createElement("button");
    button.className = "answer-btn";
    button.type = "button";
    button.innerHTML = `
      <span class="answer-letter">${String.fromCharCode(65 + index)}</span>
      <span class="answer-text">${answer}</span>
    `;
    
    button.addEventListener("click", () => {
      chooseAnswer(index);
    });

    // Botón de bocina externo ubicado afuera al lado derecho
    const speakerBtn = document.createElement("button");
    speakerBtn.className = "external-speaker-btn";
    speakerBtn.type = "button";
    speakerBtn.title = "Escuchar opción";
    speakerBtn.innerHTML = "🔊";
    speakerBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      speakText(answer);
    });

    row.appendChild(button);
    row.appendChild(speakerBtn);
    answers.appendChild(row);
  });
}

function chooseAnswer(index) {
  if (answered) return;
  answered = true;
  const level = levels[currentLevel];
  
  const rows = [...$("answers").querySelectorAll(".answer-row")];
  rows.forEach((row, i) => {
    const btn = row.querySelector(".answer-btn");
    btn.disabled = true;
    if (i === level.correct) btn.classList.add("correct");
    else if (i === index) btn.classList.add("wrong");
  });

  const isCorrect = index === level.correct;
  if (isCorrect) {
    stars += 1;
    $("stars").textContent = stars;
  }
  const feedback = $("feedback");
  feedback.className = `feedback ${isCorrect ? "good" : ""}`;
  feedback.textContent = `${isCorrect ? "🌟 ¡Respuesta correcta! " : "💛 ¡Buen intento! "} ${level.explanation}`;
  $("nextBtn").textContent = currentLevel === levels.length - 1 ? "Ver mi diploma 🏆" : "Siguiente misión ➡️";
  $("nextBtn").classList.remove("hidden");
}

function nextLevel() {
  if (!answered) return;
  if (currentLevel < levels.length - 1) {
    currentLevel += 1;
    renderLevel();
  } else {
    showFinish();
  }
}

function showFinish() {
  $("progressText").textContent = "100%";
  $("progressBar").style.width = "100%";
  $("stars").textContent = stars;
  $("finalStars").textContent = stars;
  $("finishMessage").textContent = `¡${player}, has terminado las cinco misiones! Sigue practicando tus conversaciones cada día.`;
  $("certificateName").textContent = player;
  showScreen(finish);
}

function speakText(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-PE";
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}

function speakQuestion() {
  const level = levels[currentLevel];
  const text = `${level.scene}. ${level.question}`;
  speakText(text);
}

// Event Listeners
$("startBtn").addEventListener("click", startGame);
$("playerName").addEventListener("keypress", (e) => {
  if (e.key === "Enter") startGame();
});
$("nextBtn").addEventListener("click", nextLevel);
$("soundBtn").addEventListener("click", speakQuestion);
$("questionSoundBtn").addEventListener("click", speakQuestion);

$("homeBtn").addEventListener("click", () => {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  showScreen(welcome);
});

$("replayBtn").addEventListener("click", () => {
  $("playerName").value = player === "" ? "" : player;
  showScreen(welcome);
});
