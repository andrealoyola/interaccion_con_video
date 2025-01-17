let handPose;
let video;
let hands = [];
let tree = [];
let trunkHeight = 150; // Altura del tronco
let trunkWidth = 20;
let branchLength = 50; // Longitud inicial de las ramas
let branchAngle = 45; // Ángulo base de las ramas
let messages = [
  "¿Te sientes optimista hoy?",
  "¿Prefieres trabajar solo?",
  "¿Tomarías un riesgo hoy?",
  "¿Crees que las cosas mejorarán con esfuerzo?",
  "¿Te gusta explorar nuevas ideas?",
  "¿Sueles adaptarte rápido a los cambios?",
  "¿Confías en tu intuición?",
  "¿Te atreverías a aprender algo completamente nuevo?",
  "¿Eres de tomar decisiones rápidas?",
  "¿Te sientes cómodo trabajando en equipo?",
  "¿Consideras importante la perseverancia?",
  "¿Crees en el poder de la reflexión?",
  "¿Estás dispuesto a cambiar tu perspectiva?",
  "¿Prefieres soluciones creativas?",
  "¿Te gustaría que el árbol crezca de forma única?",
];
let message =
  "Cada decisión que tomes hará crecer un árbol único. ¿Estás listo para comenzar?";
let decisionStep = 0;
let decisionMade = false;
let delayTime = 1000; // Retraso entre acciones (en milisegundos)
let lastActionTime = 0;

function preload() {
  handPose = ml5.handPose();
}

function gotHands(results) {
  hands = results;
  if (
    hands.length > 0 &&
    !decisionMade &&
    millis() - lastActionTime > delayTime
  ) {
    processDecision(hands[0]);
  }
}

function setup() {
  createCanvas(1280, 480);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  handPose.detectStart(video, gotHands);
}

function draw() {
  background(255);
  image(video, 0, 0, 640, 480);

  fill(0);
  textSize(16);
  textAlign(CENTER);
  text(message, width / 2, 30);

  // Dibujar el tronco
  fill(139, 69, 19);
  rect(960 - trunkWidth / 2, height - trunkHeight, trunkWidth, trunkHeight);

  // Dibujar las ramas
  for (let i = 0; i < tree.length; i++) {
    let branch = tree[i];
    drawBranch(branch.x, branch.y, branch.length, branch.angle, branch.color);
  }
}

function drawBranch(x, y, length, angle, color) {
  let endX = x + length * cos(radians(angle));
  let endY = y - length * sin(radians(angle));
  stroke(color);
  strokeWeight(2);
  line(x, y, endX, endY);

  if (length > 10) {
    let newLength = length * 0.7;
    drawBranch(endX, endY, newLength, angle + branchAngle, color);
    drawBranch(endX, endY, newLength, angle - branchAngle, color);
  }
}

function processDecision(hand) {
  let keypoints = hand.keypoints;
  let indexFinger = keypoints[8];
  let thumb = keypoints[4];

  // Verificar si el gesto es pulgar arriba con índice abajo (Sí)
  if (isThumbUp(thumb, indexFinger)) {
    handleYes();
  }
  // Verificar si el gesto es puño cerrado (No)
  else if (isFist(keypoints)) {
    handleNo();
  }
}

function isThumbUp(thumb, indexFinger) {
  return thumb.y < indexFinger.y; // Pulgar arriba con índice abajo
}

function isFist(keypoints) {
  return keypoints[5].y > keypoints[9].y && keypoints[17].y > keypoints[13].y; // Puño cerrado
}

function handleYes() {
  if (decisionStep < messages.length) {
    let yOffset = height - trunkHeight - decisionStep * 10; // Desplazar ramas a lo largo del tronco
    tree.push({
      x: 960,
      y: yOffset,
      length: branchLength,
      angle: random(30, 50), // Ángulo positivo hacia la derecha
      color: "#00cc44", // Verde claro
    });
    nextQuestion();
  }
}

function handleNo() {
  if (decisionStep < messages.length) {
    let yOffset = height - trunkHeight - decisionStep * 10; // Desplazar ramas a lo largo del tronco
    tree.push({
      x: 960,
      y: yOffset,
      length: branchLength,
      angle: random(-50, -30), // Ángulo negativo hacia la izquierda
      color: "#cc4444", // Rojo oscuro
    });
    nextQuestion();
  }
}

function nextQuestion() {
  decisionStep++;
  lastActionTime = millis(); // Actualizamos el tiempo del último gesto
  if (decisionStep < messages.length) {
    message = messages[decisionStep];
    decisionMade = false; // Ahora puede tomar otra decisión
  } else {
    message = "El árbol está completo. ¡Gracias por participar!";
  }
}

function mousePressed() {
  // Reset manual para pruebas
  decisionStep = 0;
  decisionMade = false;
  message =
    "Cada decisión que tomes hará crecer un árbol único. ¿Estás listo para comenzar?";
  tree = [];
}
