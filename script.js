
const levels = [
  {
    title: "Aprendemos a saludar",
    scene: "Llegas al salón y encuentras a tu compañero.",
    question: "¿Qué puedes decirle para comenzar una conversación?",
    answers: [
      "¡Hola! ¿Cómo estás?",
      "No quiero hablar contigo.",
      "¡Adiós!"
    ],
    correct: 0,
    success: "¡Muy bien! Saludar es una bonita manera de comenzar una conversación.",
    image: "imagenes/mision-1-saludar.png",
    alt: "Dos niños saludándose"
  },
  {
    title: "Aprendemos a preguntar",
    scene: "Tu compañero tiene un juguete muy bonito y quieres conocerlo.",
    question: "¿Qué puedes preguntarle?",
    answers: [
      "Dame tu juguete.",
      "¿Cómo se llama tu juguete?",
      "No me interesa."
    ],
    correct: 1,
    success: "¡Excelente! Hacer preguntas nos ayuda a conocer a los demás.",
    image: "imagenes/mision-2-preguntar.png",
    alt: "Un niño preguntando a su compañero por un juguete"
  },
  {
    title: "Expresamos emociones",
    scene: "Hoy jugaste con tus amigos y te sientes muy feliz.",
    question: "¿Cómo puedes expresar lo que sientes?",
    answers: [
      "Estoy feliz porque jugué con mis amigos.",
      "No quiero contar nada.",
      "No sé y no me importa."
    ],
    correct: 0,
    success: "¡Genial! Expresar nuestras emociones es importante.",
    image: "imagenes/mision-3-emociones.png",
    alt: "Un niño expresando felicidad"
  },
  {
    title: "Aprendemos a escuchar",
    scene: "Tu amiga quiere contarte algo que le sucedió.",
    question: "¿Qué debes hacer cuando alguien está hablando?",
    answers: [
      "Interrumpirla para hablar primero.",
      "Escucharla y esperar mi turno.",
      "Irme sin escuchar."
    ],
    correct: 1,
    success: "¡Muy bien! Escuchar demuestra respeto y cariño.",
    image: "imagenes/mision-4-escuchar.png",
    alt: "Una niña escuchando a su compañero"
  },
  {
    title: "Conversamos con respeto",
    scene: "Necesitas ayuda de un compañero para recoger los juguetes.",
    question: "¿Cómo puedes pedirle ayuda?",
    answers: [
      "¡Ayúdame, por favor!",
      "¡Hazlo ahora!",
      "¡Dámelo!"
    ],
    correct: 0,
    success: "¡Fantástico! Las palabras amables nos ayudan a convivir mejor.",
    image: "imagenes/mision-5-respeto.png",
    alt: "Dos niños ayudándose"
  }
];

let currentLevel = 0;
let totalStars = 0;
let player = "Pequeño conversador";
let answered = false;

const welcome = document.getElementById("welcome");
const game = document.getElementById("game");
const finish = document.getElementById("finish");

const playerName = document.getElementById("playerName");
const startBtn = document.getElementById("startBtn");
const homeBtn = document.getElementById("homeBtn");

const stars = document.getElementById("stars");
const levelLabel = document.getElementById("levelLabel");
const progressText = document.getElementById("progressText");
const progressBar = document.getElementById("progressBar");

const levelTitle = document.getElementById("levelTitle");
const missionImage = document.getElementById("missionImage");
const sceneText = document.getElementById("sceneText");

const sceneSoundBtn = document.getElementById("sceneSoundBtn");
const questionSoundBtn = document.getElementById("questionSoundBtn");
const questionText = document.getElementById("questionText");
const answers = document.getElementById("answers");

const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");
const soundBtn = document.getElementById("soundBtn");

const finishMessage = document.getElementById("finishMessage");
const finalStars = document.getElementById("finalStars");
const certificateName = document.getElementById("certificateName");

const printBtn = document.getElementById("printBtn");
const replayBtn = document.getElementById("replayBtn");

const backgroundMusic = document.getElementById("backgroundMusic");
backgroundMusic.volume = 0.15;

// VOZ MANUAL
function speak(text) {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-PE";
  utterance.rate = 0.88;
  utterance.pitch = 1.12;
  utterance.volume = 1;

  const voices = window.speechSynthesis.getVoices();

  const spanishVoice = voices.find(voice =>
    voice.lang.toLowerCase().includes("es-pe")
  ) || voices.find(voice =>
    voice.lang.toLowerCase().includes("es")
  );

  if (spanishVoice) {
    utterance.voice = spanishVoice;
  }

  window.speechSynthesis.speak(utterance);
}

// MÚSICA DE FONDO
function startMusic() {
  if (backgroundMusic.paused) {
    backgroundMusic.play().catch(error => {
      console.log("No se pudo reproducir la música:", error);
    });
  }
}

backgroundMusic.addEventListener("error", () => {
  console.log("No se encontró el archivo de música.");
});

// INICIAR JUEGO
function startGame() {
  player = playerName.value.trim() || "Pequeño conversador";

  currentLevel = 0;
  totalStars = 0;

  startMusic();

  welcome.classList.add("hidden");
  finish.classList.add("hidden");
  game.classList.remove("hidden");

  renderLevel();

  speak(
    "¡Hola " + player +
    "! Bienvenido a Mi mundo de conversaciones. ¡Vamos a aprender!"
  );
}

// MOSTRAR MISIÓN
function renderLevel() {
  const level = levels[currentLevel];

  answered = false;

  levelTitle.textContent = level.title;
  sceneText.textContent = level.scene;
  questionText.textContent = level.question;

  missionImage.src = level.image;
  missionImage.alt = level.alt;

  missionImage.onerror = () => {
    missionImage.alt = "Imagen de la misión no encontrada";
    console.log("No se encontró la imagen:", level.image);
  };

  levelLabel.textContent =
    `Misión ${currentLevel + 1} de ${levels.length}`;

  const progress = ((currentLevel + 1) / levels.length) * 100;

  progressText.textContent = Math.round(progress) + "%";
  progressBar.style.width = progress + "%";

  stars.textContent = totalStars;

  feedback.classList.add("hidden");
  nextBtn.classList.add("hidden");

  renderAnswers();
}

// CREAR RESPUESTAS CON BOCINAS SEPARADAS
function renderAnswers() {
  const level = levels[currentLevel];

  answers.innerHTML = "";

  level.answers.forEach((answer, index) => {

    const row = document.createElement("div");
    row.className = "answer-row";

    // BOCINA INDEPENDIENTE
    const speakButton = document.createElement("button");
    speakButton.className = "answer-speak";
    speakButton.type = "button";
    speakButton.textContent = "🔊";
    speakButton.setAttribute("aria-label", "Escuchar respuesta");

    speakButton.addEventListener("click", () => {
      speak(answer);
    });

    // BOTÓN DE RESPUESTA
    const answerButton = document.createElement("button");
    answerButton.className = "answer-btn";
    answerButton.type = "button";
    answerButton.textContent = answer;

    answerButton.addEventListener("click", () => {
      checkAnswer(index, answerButton);
    });

    row.appendChild(speakButton);
    row.appendChild(answerButton);

    answers.appendChild(row);
  });
}

// COMPROBAR RESPUESTA
function checkAnswer(index, selectedButton) {
  if (answered) return;

  const level = levels[currentLevel];

  if (index === level.correct) {

    answered = true;
    totalStars++;

    stars.textContent = totalStars;

    selectedButton.classList.add("correct");

    feedback.textContent = level.success;
    feedback.classList.remove("hidden");

    const buttons = answers.querySelectorAll(".answer-btn");

    buttons.forEach(button => {
      button.disabled = true;
    });

    const speakers = answers.querySelectorAll(".answer-speak");

    speakers.forEach(button => {
      button.disabled = true;
    });

    nextBtn.classList.remove("hidden");

    nextBtn.textContent =
      currentLevel === levels.length - 1
        ? "Ver mi diploma"
        : "Continuar";

    speak(level.success);

  } else {

    selectedButton.classList.add("incorrect");

    feedback.textContent = "¡Inténtalo otra vez! Tú puedes.";
    feedback.classList.remove("hidden");

    speak("¡Inténtalo otra vez! Tú puedes.");

    setTimeout(() => {
      selectedButton.classList.remove("incorrect");
    }, 1000);
  }
}

// ESCUCHAR SITUACIÓN
sceneSoundBtn.addEventListener("click", () => {
  speak(levels[currentLevel].scene);
});

// ESCUCHAR PREGUNTA
questionSoundBtn.addEventListener("click", () => {
  speak(levels[currentLevel].question);
});

// ESCUCHAR SITUACIÓN Y PREGUNTA
soundBtn.addEventListener("click", () => {
  const level = levels[currentLevel];

  speak(level.scene + " " + level.question);
});

// SIGUIENTE MISIÓN
nextBtn.addEventListener("click", () => {
  if (currentLevel < levels.length - 1) {

    currentLevel++;

    renderLevel();

    speak(levels[currentLevel].title);

  } else {
    showFinish();
  }
});

// MOSTRAR DIPLOMA
function showFinish() {
  game.classList.add("hidden");
  finish.classList.remove("hidden");

  certificateName.textContent = player;
  finalStars.textContent = totalStars;

  finishMessage.textContent =
    "¡Felicitaciones, " + player +
    "! Has completado las cinco misiones de conversación.";

  speak(
    "¡Felicitaciones " + player +
    "! Has terminado todas las misiones. ¡Eres un pequeño conversador!"
  );
}

// VOLVER AL INICIO
homeBtn.addEventListener("click", () => {
  window.speechSynthesis.cancel();

  game.classList.add("hidden");
  finish.classList.add("hidden");
  welcome.classList.remove("hidden");
});

// IMPRIMIR DIPLOMA
printBtn.addEventListener("click", () => {
  window.print();
});

// VOLVER A JUGAR
replayBtn.addEventListener("click", () => {
  currentLevel = 0;
  totalStars = 0;

  finish.classList.add("hidden");
  game.classList.remove("hidden");

  renderLevel();

  speak("¡Vamos a jugar otra vez!");
});

// CARGAR VOCES DEL NAVEGADOR
if ("speechSynthesis" in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}

// BOTÓN DE INICIO
startBtn.addEventListener("click", startGame);
