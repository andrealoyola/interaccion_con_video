let handPose;
let video;
let hands = [];
let branchImagesYes = []; // Imágenes para las ramas de "Sí"
let branchImagesNo = []; // Imágenes para las ramas de "No"
let trunkImage; // Imagen del tronco
let treeTopImage; // Imagen de la copa del árbol
let tree = [];
let messages = [
  "¿Te sientes en paz contigo mismo en este momento?",
  "¿Te permites expresar tus emociones libremente?",
  "¿Te sientes valorado por las personas cercanas a ti?",
  "¿Sientes que recibes el apoyo emocional que necesitas?",
  "¿Haces algo que disfrutes verdaderamente todos los días?",
  "¿Te entusiasma pensar en tu futuro?",
  "¿Sientes que estás aprovechando al máximo tus talentos?",
  "¿Te sientes agradecido por lo que tienes en la vida?",
  "¿Te has perdonado por errores pasados?",
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
  treeTopImage = loadImage("top_branch.png"); // Carga la imagen de la copa del árbol

  // Carga las imágenes de las ramas para "Sí"
  for (let i = 1; i <= 7; i++) {
    branchImagesYes.push(loadImage(`branch_yes_${i}.png`));
  }

  // Carga las imágenes de las ramas para "No"
  for (let i = 1; i <= 8; i++) {
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
  let canvas = createCanvas(1420, 1000);
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
  image(trunkImage, width - 850 / 2 - trunkWidth / 2, height - trunkHeight);

  // Dibuja las ramas
  for (let i = 0; i < tree.length; i++) {
    let branch = tree[i];
    image(branch.image, branch.x, branch.y);
  }

  // Dibuja la copa del árbol si el árbol está completo
  if (decisionStep >= messages.length) {
    let topWidth = treeTopImage.width - 750 / 2;
    let topHeight = treeTopImage.height;

    // Calcula la posición para que el borde superior de la copa toque el borde superior del canvas
    let topX = width / 2 - topWidth / 2;
    let topY = 0; // Borde superior del canvas

    image(treeTopImage, topX, topY);
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
    let yOffset = height - 200 - decisionStep * 80;
    tree.push({
      x: width / 2 + 222, // Fija la posición de X a la derecha
      y: yOffset,
      image: random(branchImagesYes),
    });
    nextQuestion();
  }
}

function handleNo() {
  if (decisionStep < messages.length) {
    let yOffset = height - 200 - decisionStep * 80;
    tree.push({
      x: width / 2 - 32, // Fija la posición de X a la izquierda
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
