let handPose;
let video;
let hands = [];
let branchImagesYes = []; // Imágenes para las ramas de "Sí"
let branchImagesNo = []; // Imágenes para las ramas de "No"
let trunkImage; // Imagen del tronco
let tree = [];
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
let delayTime = 1000;
let lastActionTime = 0;

function preload() {
  handPose = ml5.handPose();
  trunkImage = loadImage("tronco.png"); // Carga la imagen del tronco

  // Carga las imágenes de las ramas para "Sí"
  for (let i = 1; i <= 12; i++) {
    branchImagesYes.push(loadImage(`branch_yes_${i}.png`));
  }

  // Carga las imágenes de las ramas para "No"
  for (let i = 1; i <= 10; i++) {
    branchImagesNo.push(loadImage(`branch_no_${i}.png`));
  }
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
  let canvas = createCanvas(1200, 1000);
  canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  handPose.detectStart(video, gotHands);
}

function draw() {
  background(255);
  image(video, 0, 0, 500, 500);

  // Muestra el texto en pantalla
  fill(0);
  noStroke();
  textSize(16);
  textAlign(CENTER);
  text(message, width / 2, 30);

  // Dibuja la imagen del tronco en la base del lienzo
  let trunkWidth = trunkImage.width / 2; // Tamaño del tronco ajustado
  let trunkHeight = trunkImage.height;
  image(trunkImage, width - 900 / 2 - trunkWidth / 2, height - trunkHeight);

  // Dibuja las ramas
  for (let i = 0; i < tree.length; i++) {
    let branch = tree[i];
    image(branch.image, branch.x, branch.y);
  }
}

function processDecision(hand) {
  let keypoints = hand.keypoints;
  let indexFinger = keypoints[8];
  let thumb = keypoints[4];

  if (isThumbUp(thumb, indexFinger)) {
    handleYes();
  } else if (isFist(keypoints)) {
    handleNo();
  }
}

function isThumbUp(thumb, indexFinger) {
  return thumb.y < indexFinger.y;
}

function isFist(keypoints) {
  return keypoints[5].y > keypoints[9].y && keypoints[17].y > keypoints[13].y;
}

function handleYes() {
  if (decisionStep < messages.length) {
    let yOffset = height - decisionStep * 84;
    tree.push({
      x: width / 2 + 212, // Fija la posición de X a la derecha
      y: yOffset,
      image: random(branchImagesYes),
    });
    nextQuestion();
  }
}

function handleNo() {
  if (decisionStep < messages.length) {
    let yOffset = height - decisionStep * 84;
    tree.push({
      x: width / 2 + 50, // Fija la posición de X a la izquierda
      y: yOffset, // La Y cambia con cada decisión
      image: random(branchImagesNo),
    });
    nextQuestion();
  }
}

function nextQuestion() {
  decisionStep++;
  lastActionTime = millis();
  if (decisionStep < messages.length) {
    message = messages[decisionStep];
    decisionMade = false;
  } else {
    message = "El árbol está completo. ¡Gracias por participar!";
  }
}

function mousePressed() {
  decisionStep = 0;
  decisionMade = false;
  message =
    "Cada decisión que tomes hará crecer un árbol único. ¿Estás listo para comenzar?";
  tree = [];
}
