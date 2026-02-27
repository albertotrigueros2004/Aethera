let audioCtx;
let oscillator;
let sessionTimeout;
let startTime;

function enterApp() {
  document.getElementById("introScreen").classList.remove("active");
  document.getElementById("appScreen").classList.add("active");
}

function generateScript(goal) {
  return `
Respira profundamente...
Mientras tu cuerpo se relaja,
imagina que ya estás viviendo aquello que deseas.
${goal}.
Siente cómo ya forma parte de ti.
Yo ya soy capaz.
Yo ya estoy preparado.
Esto ya está en proceso.
Descansa.
  `;
}

function recommendFrequency(goal) {
  goal = goal.toLowerCase();
  if (goal.includes("dormir") || goal.includes("calma")) return 150;
  if (goal.includes("estudi") || goal.includes("examen")) return 432;
  if (goal.includes("confianza")) return 369;
  return 369;
}

function startSession() {
  const goal = document.getElementById("goalInput").value;
  const duration = document.getElementById("durationSlider").value;
  let freq = document.getElementById("freqSlider").value;

  const recommended = recommendFrequency(goal);
  document.getElementById("recommendation").innerText =
    "Frecuencia recomendada: " + recommended + " Hz";

  const script = generateScript(goal);

  const utterance = new SpeechSynthesisUtterance(script);
  utterance.rate = 0.8;
  utterance.pitch = 0.7;
  speechSynthesis.speak(utterance);

  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  oscillator = audioCtx.createOscillator();
  oscillator.frequency.value = freq;
  oscillator.connect(audioCtx.destination);
  oscillator.start();

  startTime = Date.now();

  sessionTimeout = setTimeout(() => {
    stopSession();
  }, duration * 60000);
}

function stopSession() {
  if (oscillator) oscillator.stop();
  speechSynthesis.cancel();

  const endTime = Date.now();
  const minutes = Math.round((endTime - startTime) / 60000);

  let stats = JSON.parse(localStorage.getItem("aetheraStats")) || [];
  stats.push({ date: new Date(), minutes: minutes });
  localStorage.setItem("aetheraStats", JSON.stringify(stats));
}

function showStats() {
  document.getElementById("appScreen").classList.remove("active");
  document.getElementById("statsScreen").classList.add("active");

  let stats = JSON.parse(localStorage.getItem("aetheraStats")) || [];
  let total = stats.reduce((acc, s) => acc + s.minutes, 0);

  document.getElementById("statsContent").innerHTML =
    "Sesiones: " + stats.length + "<br>Total minutos: " + total;
}

function backToApp() {
  document.getElementById("statsScreen").classList.remove("active");
  document.getElementById("appScreen").classList.add("active");
}
