// Clima, Poder y Futuro - Objeto Virtual de Aprendizaje (OVA)
// Lógica interactiva, accesibilidad y gamificación

// --- 1. WEB AUDIO API SOUND EFFECTS ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(freq, type, duration, delay = 0) {
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);
    gain.gain.setValueAtTime(0.12, audioCtx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + delay + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(audioCtx.currentTime + delay);
    osc.stop(audioCtx.currentTime + delay + duration);
  } catch (e) {
    // Audio context may require user interaction
  }
}

function sfxSuccess() {
  playTone(523.25, 'sine', 0.12, 0);       // C5
  playTone(659.25, 'sine', 0.12, 0.08);    // E5
  playTone(783.99, 'sine', 0.22, 0.16);    // G5
  playTone(1046.50, 'sine', 0.35, 0.24);   // C6
}

function sfxError() {
  playTone(320, 'triangle', 0.15, 0);
  playTone(240, 'triangle', 0.25, 0.12);
}

function sfxTurn() {
  playTone(400, 'sine', 0.08, 0);
}

function sfxVictory() {
  const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
  notes.forEach((f, i) => playTone(f, 'triangle', 0.25, i * 0.1));
}

// --- 2. TEXT TO SPEECH (NARRADOR POR VOZ) ---
let isSpeaking = false;
function toggleSpeech(textElementId) {
  if (!('speechSynthesis' in window)) {
    alert("Tu navegador no soporta síntesis de voz.");
    return;
  }
  
  if (isSpeaking) {
    window.speechSynthesis.cancel();
    isSpeaking = false;
    document.querySelectorAll('.btn-tts').forEach(b => b.innerHTML = '🔊 Escuchar lectura');
    return;
  }

  const el = document.getElementById(textElementId);
  if (!el) return;
  const text = el.innerText;
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'es-ES';
  utterance.rate = 1.0;
  
  utterance.onend = () => {
    isSpeaking = false;
    document.querySelectorAll('.btn-tts').forEach(b => b.innerHTML = '🔊 Escuchar lectura');
  };
  
  utterance.onerror = () => {
    isSpeaking = false;
    document.querySelectorAll('.btn-tts').forEach(b => b.innerHTML = '🔊 Escuchar lectura');
  };

  window.speechSynthesis.speak(utterance);
  isSpeaking = true;
  document.querySelectorAll('.btn-tts').forEach(b => b.innerHTML = '⏹ Detener audio');
}

// --- 3. STATE & NAVIGATION ---
const TOTAL_PAGES = 15;
let currentPage = 1;
let userScore = parseInt(localStorage.getItem('ova_clim_score') || '0');

function updateScore(points) {
  userScore += points;
  localStorage.setItem('ova_clim_score', userScore);
  const scoreBadge = document.getElementById('score-display');
  if (scoreBadge) scoreBadge.innerText = `${userScore} pts`;
  
  const certScore = document.getElementById('cert-score-display');
  if (certScore) certScore.innerText = `${userScore} puntos de aprendizaje`;
}

function goToPage(page) {
  if (page < 1 || page > TOTAL_PAGES) return;
  
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
    isSpeaking = false;
    document.querySelectorAll('.btn-tts').forEach(b => b.innerHTML = '🔊 Escuchar lectura');
  }

  const prev = document.querySelector('.book-page.active');
  if (prev) prev.classList.remove('active');

  currentPage = page;
  const next = document.getElementById(`page-${page}`);
  if (next) next.classList.add('active');

  // Update controls
  const progressFill = document.getElementById('progress-fill');
  if (progressFill) progressFill.style.width = `${(page / TOTAL_PAGES) * 100}%`;

  const pageNum = document.getElementById('page-num');
  if (pageNum) pageNum.innerText = `Página ${page} de ${TOTAL_PAGES}`;

  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  if (btnPrev) btnPrev.disabled = (page === 1);
  if (btnNext) btnNext.disabled = (page === TOTAL_PAGES);

  sfxTurn();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function nextPage() { goToPage(currentPage + 1); }
function prevPage() { goToPage(currentPage - 1); }

// Keyboard navigation
window.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
  if (e.key === 'ArrowRight') nextPage();
  if (e.key === 'ArrowLeft') prevPage();
});

// --- 4. ACTIVIDAD 1: MATRIZ DE ACTORES (EMPAREJAMIENTO) ---
let selectedActor = null;
let matchedActors = 0;

const actorPairs = {
  'act-usa': 'resp-usa',
  'act-chn': 'resp-chn',
  'act-petro': 'resp-petro',
  'act-corps': 'resp-corps',
  'act-south': 'resp-south'
};

function selectActor(el) {
  if (el.classList.contains('matched')) return;
  document.querySelectorAll('.match-item[data-type="actor"]').forEach(item => item.classList.remove('selected'));
  el.classList.add('selected');
  selectedActor = el.getAttribute('data-id');
}

function selectResp(el) {
  if (el.classList.contains('matched') || !selectedActor) return;
  const respId = el.getAttribute('data-id');
  
  if (actorPairs[selectedActor] === respId) {
    // Correct Match
    sfxSuccess();
    const actorEl = document.querySelector(`.match-item[data-id="${selectedActor}"]`);
    actorEl.classList.remove('selected');
    actorEl.classList.add('matched');
    el.classList.add('matched');
    actorEl.innerHTML += ' ✅';
    el.innerHTML += ' ✅';
    
    updateScore(15);
    matchedActors++;
    selectedActor = null;
    
    if (matchedActors === 5) {
      document.getElementById('act1-feedback').style.display = 'block';
      sfxVictory();
    }
  } else {
    // Error
    sfxError();
    el.style.borderColor = 'var(--coral)';
    setTimeout(() => {
      el.style.borderColor = 'var(--line)';
    }, 700);
  }
}

// --- 5. ACTIVIDAD 2: DETECTIVES DEL CLIMA (FACT-CHECKING) ---
let factChecked = 0;
function checkFact(caseNum, choice, btn) {
  const card = document.getElementById(`case-${caseNum}`);
  const feedback = card.querySelector('.case-feedback');
  const correctChoice = card.getAttribute('data-correct');

  card.querySelectorAll('.btn-choice').forEach(b => b.disabled = true);

  if (choice === correctChoice) {
    sfxSuccess();
    btn.classList.add('correct');
    feedback.style.display = 'block';
    feedback.style.background = 'var(--forest-soft)';
    feedback.style.color = 'var(--forest)';
    feedback.innerHTML = `<strong>¡Dictamen Certero! (+20 pts)</strong> ${card.getAttribute('data-explanation')}`;
    updateScore(20);
  } else {
    sfxError();
    btn.classList.add('incorrect');
    feedback.style.display = 'block';
    feedback.style.background = 'var(--coral-soft)';
    feedback.style.color = 'var(--coral)';
    feedback.innerHTML = `<strong>Veredicto no coincidente:</strong> ${card.getAttribute('data-explanation')}`;
  }

  factChecked++;
  if (factChecked === 3) {
    document.getElementById('act2-summary').style.display = 'block';
  }
}

// --- 6. ACTIVIDAD 3: CLASIFICADOR DE MEDIDAS (TRANSICIÓN ENERGÉTICA) ---
let classifiedCount = 0;
function classifyMeasure(measureId, category, btn) {
  const correctCat = btn.getAttribute('data-correct');
  const feedback = document.getElementById('act3-feedback');

  if (category === correctCat) {
    sfxSuccess();
    btn.classList.add('correct');
    btn.disabled = true;
    updateScore(10);
    classifiedCount++;
    if (classifiedCount === 6) {
      feedback.style.display = 'block';
      sfxVictory();
    }
  } else {
    sfxError();
    btn.classList.add('incorrect');
    setTimeout(() => btn.classList.remove('incorrect'), 800);
  }
}

// --- 7. ACTIVIDAD 4: SOPA DE LETRAS GEOPOLÍTICA ---
const wordSearchWords = ['DESCARBONIZAR', 'MITIGACION', 'FOSILES', 'RENOVABLES', 'EQUIDAD'];
let selectedCells = [];
let foundWordsCount = 0;

function toggleWsCell(cell) {
  if (cell.classList.contains('found')) return;
  
  if (cell.classList.contains('selected')) {
    cell.classList.remove('selected');
    selectedCells = selectedCells.filter(c => c !== cell);
  } else {
    cell.classList.add('selected');
    selectedCells.push(cell);
  }

  // Check word
  const currentWord = selectedCells.map(c => c.innerText).join('');
  const reverseWord = selectedCells.map(c => c.innerText).reverse().join('');

  wordSearchWords.forEach(w => {
    if ((currentWord === w || reverseWord === w) && !document.getElementById(`word-${w}`).classList.contains('found')) {
      sfxSuccess();
      selectedCells.forEach(c => {
        c.classList.remove('selected');
        c.classList.add('found');
      });
      document.getElementById(`word-${w}`).classList.add('found');
      selectedCells = [];
      foundWordsCount++;
      updateScore(25);

      if (foundWordsCount === wordSearchWords.length) {
        document.getElementById('ws-complete-msg').style.display = 'block';
        sfxVictory();
      }
    }
  });
}

function clearWsSelection() {
  selectedCells.forEach(c => c.classList.remove('selected'));
  selectedCells = [];
}

// --- 8. ACTIVIDAD 5: SIMULADOR DE LA CUMBRE CLIMÁTICA (COP) ---
let simRound = 1;
let simTemp = 2.8;   // Initial warming forecast °C
let simEquity = 40;  // Initial social equity %

function simDecide(round, tempDelta, equityDelta, feedbackText) {
  simTemp += tempDelta;
  simEquity += equityDelta;

  document.getElementById('sim-temp-val').innerText = `${simTemp.toFixed(1)}°C`;
  document.getElementById('sim-equity-val').innerText = `${simEquity}%`;
  
  // Progress bar widths
  const tempPct = Math.max(10, Math.min(100, ((simTemp - 1.0) / 2.5) * 100));
  document.getElementById('sim-temp-bar').style.width = `${tempPct}%`;
  document.getElementById('sim-equity-bar').style.width = `${Math.max(10, Math.min(100, simEquity))}%`;

  sfxSuccess();
  updateScore(25);

  const card = document.getElementById(`sim-round-${round}`);
  card.style.display = 'none';

  simRound++;
  const nextCard = document.getElementById(`sim-round-${simRound}`);
  if (nextCard) {
    nextCard.style.display = 'block';
  } else {
    // Finished simulation
    const finalCard = document.getElementById('sim-final');
    finalCard.style.display = 'block';
    const verdict = document.getElementById('sim-verdict');
    if (simTemp <= 1.8 && simEquity >= 70) {
      verdict.innerHTML = `🏆 <strong>¡Pacto de Transición Justa Exitoso!</strong> Lograste contener la temperatura en ${simTemp.toFixed(1)}°C con un índice de equidad del ${simEquity}%. Has protegido a las poblaciones más vulnerables sin ceder a la presión fósil.`;
    } else if (simTemp > 2.2) {
      verdict.innerHTML = `⚠️ <strong>Alerta Climática:</strong> La temperatura alcanzó ${simTemp.toFixed(1)}°C. Las concesiones a la industria fósil evitaron el colapso financiero a corto plazo, pero condenan los ecosistemas andinos y costeros.`;
    } else {
      verdict.innerHTML = `⚖️ <strong>Acuerdo de Transición Gradual:</strong> Temperatura en ${simTemp.toFixed(1)}°C y equidad en ${simEquity}%. Se lograron avances significativos aunque persiste la disputa geopolítica.`;
    }
    sfxVictory();
  }
}

// --- 9. ACTIVIDAD 6: TRIBUNAL CIUDADANO (CONSTRUCTOR DE ARGUMENTOS) ---
function updateArgumentSpeech() {
  const actor = document.getElementById('arg-actor').value;
  const tesis = document.getElementById('arg-tesis').value;
  const evidencia = document.getElementById('arg-evidencia').value;
  const propuesta = document.getElementById('arg-propuesta').value;

  const preview = document.getElementById('arg-compiled-speech');
  preview.innerHTML = `
    "Ante este Tribunal Ciudadano, comparecemos en representación de <strong>${actor}</strong> para sostener que <strong>${tesis}</strong>. 
    Fundamentamos nuestra posición en la evidencia científica y geopolítica que demuestra que <strong>${evidencia}</strong>. 
    Por consiguiente, rechazamos los discursos evasivos y exigimos la implementación de: <strong>${propuesta}</strong> como garantía de supervivencia y justicia intergeneracional para nuestra comunidad de Ipiales y el planeta."
  `;
}

function copySpeech() {
  const speechText = document.getElementById('arg-compiled-speech').innerText;
  navigator.clipboard.writeText(speechText).then(() => {
    alert("¡Alegato argumentativo copiado al portapapeles con éxito!");
    updateScore(30);
    sfxSuccess();
  });
}

// --- 10. ACTIVIDAD 7: MEMORIA DE CONCEPTOS CLAVE ---
let flippedCards = [];
let memoryMatched = 0;

function flipMemoryCard(card) {
  if (card.classList.contains('flipped') || card.classList.contains('matched') || flippedCards.length >= 2) return;

  card.classList.add('flipped');
  flippedCards.push(card);
  sfxTurn();

  if (flippedCards.length === 2) {
    const pair1 = flippedCards[0].getAttribute('data-pair');
    const pair2 = flippedCards[1].getAttribute('data-pair');

    if (pair1 === pair2) {
      // Match
      sfxSuccess();
      flippedCards[0].classList.add('matched');
      flippedCards[1].classList.add('matched');
      flippedCards = [];
      memoryMatched++;
      updateScore(20);

      if (memoryMatched === 4) {
        document.getElementById('memory-success-msg').style.display = 'block';
        sfxVictory();
      }
    } else {
      // No match
      sfxError();
      setTimeout(() => {
        flippedCards.forEach(c => c.classList.remove('flipped'));
        flippedCards = [];
      }, 900);
    }
  }
}

// --- 11. ACTIVIDAD 8: EVALUACIÓN SABER 11 ---
function submitQuizOption(btn, isCorrect, explanationId) {
  const parent = btn.closest('.quiz-question');
  parent.querySelectorAll('.btn-choice').forEach(b => b.disabled = true);
  const exp = document.getElementById(explanationId);

  if (isCorrect) {
    sfxSuccess();
    btn.classList.add('correct');
    exp.style.display = 'block';
    exp.style.background = 'var(--forest-soft)';
    exp.style.color = 'var(--forest)';
    updateScore(25);
  } else {
    sfxError();
    btn.classList.add('incorrect');
    exp.style.display = 'block';
    exp.style.background = 'var(--coral-soft)';
    exp.style.color = 'var(--coral)';
  }
}

// --- 12. CERTIFICADO FINAL (PÁGINA 15) ---
function syncCertName(input) {
  const nameDisplay = document.getElementById('cert-student-name');
  if (nameDisplay) {
    nameDisplay.innerText = input.value.trim() || 'Nombre del Estudiante';
  }
}

function printCertificate() {
  window.print();
}

function resetOva() {
  if (confirm("¿Deseas reiniciar tu progreso y volver a la portada?")) {
    localStorage.removeItem('ova_clim_score');
    userScore = 0;
    updateScore(0);
    goToPage(1);
    location.reload();
  }
}

// INITIALIZATION
window.addEventListener('DOMContentLoaded', () => {
  const scoreDisplay = document.getElementById('score-display');
  if (scoreDisplay) scoreDisplay.innerText = `${userScore} pts`;

  const dateEl = document.getElementById('cert-date');
  if (dateEl) {
    const today = new Date();
    dateEl.innerText = today.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  // Populate initial argument speech
  updateArgumentSpeech();
});
