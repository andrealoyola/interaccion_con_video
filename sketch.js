let handPose;
let video;
let hands = [];
let nodes = [
  { x: 640, y: 380, radius: 20, color: [139, 69, 19], parent: null }, // Nodo inicial (tronco)
];
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

function preload() {
  handPose = ml5.handPose();
}

function gotHands(results) {
  hands = results;
  if (hands.length > 0 && !decisionMade) {
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

  // Dibujar los nodos (círculos) del árbol
  for (let node of nodes) {
    drawNode(node.x, node.y, node.radius, node.color);
  }
}

function drawNode(x, y, radius, color) {
  fill(color);
  noStroke();
  ellipse(x, y, radius * 2, radius * 2); // Dibuja un círculo
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
  return thumb.y < indexFinger.y; // Pulgar arriba
}

function isFist(keypoints) {
  return (
    dist(keypoints[8].x, keypoints[8].y, keypoints[0].x, keypoints[0].y) < 30 &&
    dist(keypoints[12].x, keypoints[12].y, keypoints[0].x, keypoints[0].y) <
      30 &&
    dist(keypoints[16].x, keypoints[16].y, keypoints[0].x, keypoints[0].y) <
      30 &&
    dist(keypoints[20].x, keypoints[20].y, keypoints[0].x, keypoints[0].y) < 30
  ); // Puño cerrado
}

function handleYes() {
  addNode(30, [0, 200, 0]); // Nodo hacia la derecha (positivo)
  nextQuestion();
}

function handleNo() {
  addNode(-30, [200, 0, 0]); // Nodo hacia la izquierda (negativo)
  nextQuestion();
}

function addNode(angleOffset, nodeColor) {
  let parentNode = nodes[nodes.length - 1];
  let newRadius = parentNode.radius * 0.7; // Los nodos se hacen más pequeños

  if (newRadius > 5) {
    // Evitar nodos demasiado pequeños
    let endX =
      parentNode.x + parentNode.radius * cos(radians(parentNode.angle));
    let endY =
      parentNode.y + parentNode.radius * sin(radians(parentNode.angle));

    // Agregar nuevo nodo a la lista del árbol
    nodes.push({
      x: endX,
      y: endY,
      radius: newRadius,
      angle: parentNode.angle + angleOffset, // Rotar el nodo según la respuesta
      color: nodeColor,
      parent: parentNode,
    });
  }
}

function nextQuestion() {
  decisionStep++;
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
  nodes = [
    { x: 640, y: 380, radius: 20, color: [139, 69, 19], parent: null }, // Reiniciar el tronco
  ];
}
