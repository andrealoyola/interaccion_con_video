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
  "¿Te sientes orgulloso de la persona en la que te has convertido?",
];
let message =
  "Cada decisión que tomes hará crecer un árbol único. ¿Estás listo para comenzar?";

let decisionStep = 0;
let decisionMade = false;
let delayTime = 1000;
let lastActionTime = 0;
let confetti = []; // Array para las partículas de confeti
let customFont;
let escala = 0.5; // para escalar imágenes

function preload() {
  handPose = ml5.handPose();
  trunkImage = loadImage("tronco.png"); // Carga la imagen del tronco
  treeTopImage = loadImage("top_branch.png"); // Carga la imagen de la copa del árbol
  customFont = loadFont("fuente.ttf"); // Reemplaza con archivo fuente

  // Carga las imágenes de las ramas para "Sí"
  for (let i = 1; i <= 8; i++) {
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
  let canvas = createCanvas(windowWidth * 0.8, windowHeight * 0.8); // Ajusta el tamaño del canvas
  canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);
  video = createCapture(VIDEO);
  video.size(340, 280);
  video.hide();
  handPose.detectStart(video, gotHands);

  // Crear partículas de confeti
  for (let i = 0; i < 100; i++) {
    confetti.push({
      x: random(width),
      y: random(-400, 0),
      size: random(5, 10),
      color: color(random(255), random(255), random(255)),
      speed: random(1, 3),
    });
  }
}

function draw() {
  background(255);
  image(video, 10, 50, 340, 280); // Reduce el tamaño del video
  fill(237, 237, 254);
  rect(10, 350, 340, 220); // Ajusta la posición y tamaño del recuadro de texto

  fill(0); // Color del texto
  noStroke();
  textFont(customFont); // Cambia el texto a la fuente personalizada
  textSize(14); // Ajusta el tamaño del texto
  textAlign(LEFT, CENTER);
  text(
    "Reglas de la actividad: \nUsa movimientos de tus manos para responder \nlas preguntas de forma interactiva.\n \nPara responder SI \nLevanta el pulgar.\n \nPara responder NO \nCierra el puño, hacia el frente los nudillos.",
    20,
    460
  );

  // Muestra el texto en pantalla
  fill(64, 66, 64);
  noStroke();
  textSize(18);
  textAlign(LEFT);
  text(message, 20, 25);

  // Dibuja la imagen del tronco en la base del lienzo
  let trunkWidth = trunkImage.width * escala; // Tamaño del tronco ajustado por la escala
  let trunkHeight = trunkImage.height * escala; // Tamaño del tronco ajustado por la escala
  image(
    trunkImage,
    width / 2 - trunkWidth + 200 / 2, // Centrado horizontalmente
    height - trunkHeight, // Alineado con la base del lienzo, teniendo en cuenta la escala
    trunkWidth, // Ajuste de escala en el ancho
    trunkHeight // Ajuste de escala en el alto
  );
  // Dibuja las ramas
  for (let i = 0; i < tree.length; i++) {
    let branch = tree[i];
    image(
      branch.image,
      branch.x,
      branch.y,
      branch.image.width * escala,
      branch.image.height * escala
    );
  }

  // Dibuja la copa del árbol si el árbol está completo (después de la última pregunta)
  if (decisionStep >= messages.length) {
    let topWidth = treeTopImage.width * escala; // Ajusta el tamaño de la copa según la escala
    let topHeight = treeTopImage.height * escala;

    // Calcula la posición Y para que la copa aparezca justo después de las ramas
    let topY = height - trunkHeight - 130; // Coloca la copa encima del tronco

    // Calcula la posición X para que esté centrada
    let topX = width - 610 / 2 - topWidth;

    image(
      treeTopImage,
      topX,
      topY, // La copa del árbol aparece después del tronco
      topWidth,
      topHeight
    );

    fill(199, 0, 57); // Color de fondo del recuadro
    rect(270, 200, 500, 320); // Dibuja el recuadro con bordes redondeados

    fill(255); // Color del texto
    noStroke();
    textSize(20);
    textAlign(CENTER, CENTER);
    text(
      "Tu árbol refleja tus elecciones.\n \nEste es un momento para reflexionar sobre \nqué áreas necesitan atención y cómo puedes \ncomenzar a dar pequeños pasos hacia el \ncambio. Recuerda que cada día es una nueva \noportunidad para redescubrir tus valores, \nconectar con tus emociones y avanzar \nhacia una versión más plena de ti mismo. \nNo estás solo en este camino, y siempre \npuedes buscar apoyo cuando lo necesites.",
      520,
      350
    );

    // Animar el confeti
    for (let i = 0; i < confetti.length; i++) {
      let c = confetti[i];
      fill(c.color);
      noStroke();
      ellipse(c.x, c.y, c.size, c.size);
      c.y += c.speed;

      // Reaparecer confeti que sale de la pantalla
      if (c.y > height) {
        c.y = random(-100, 0);
        c.x = random(width);
      }
    }
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
    let yOffset = height - 90 - decisionStep * 40;
    tree.push({
      x: width / 2 + 80, // Fija la posición de X a la derecha
      y: yOffset,
      image: random(branchImagesYes),
    });
    nextQuestion();
  }
}

function handleNo() {
  if (decisionStep < messages.length) {
    let yOffset = height - 90 - decisionStep * 40;
    tree.push({
      x: width / 2 - 40, // Fija la posición de X a la izquierda
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

function windowResized() {
  resizeCanvas(windowWidth * 0.8, windowHeight * 0.8); // Ajusta el tamaño del canvas cuando se cambia el tamaño de la ventana
}
