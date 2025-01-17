let longText =
  "Este es un proyecto interactivo en el cual los usuarios deben tomar decisiones a través de gestos y movimientos corporales (ml5.js), pero estas decisiones afectan el crecimiento y la forma del árbol. Cada acción que el usuario toma genera nuevas ramas y hojas, se busca plantear un proyecto reflexivo, en el que se represente cómo las elecciones del usuario impactan su entorno. Las ramas cambian de forma, tamaño y color, dependiendo de las decisiones tomadas, creando un árbol único para cada experiencia.";

function setup() {
  let myCanvas = createCanvas(windowWidth, windowHeight);
  myCanvas.parent("#my-p5-sketch"); //esto es un id por eso se utiliza #
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(32); // tamaño de la fuente
  textAlign(LEFT, CENTER); // alineación del texto
  textLeading(20); // Establecer la distancia entre líneas
}

function draw() {
  background(149, 158, 204);
  fill(0); // Color de texto (negro)

  text("¡Bienvenido al Árbol de Decisiones!", width / 2, height / 3);

  let x = 50; // Posición horizontal
  let y = 500; // Posición vertical inicial
  let maxWidth = width - 500; // Ancho máximo permitido para el texto

  let words = split(longText, " ");
  let line = "";

  for (let i = 0; i < words.length; i++) {
    let testLine = line + words[i] + " ";
    let testWidth = textWidth(testLine);

    // Si la línea excede el ancho máximo, imprimirla y empezar una nueva línea
    if (testWidth > maxWidth) {
      text(line, x, y);
      line = words[i] + " "; // Iniciar nueva línea con la palabra actual
      y += 30; // Aumentar la posición vertical para la siguiente línea
    } else {
      line = testLine; // Continuar agregando palabras a la línea
    }
  }

  // Imprimir la última línea
  text(line, x, y);
}

//invertir o reflejar video
//push(); //aisla las transformaciones
//translate(width, 0);
//scale(-1, 1);
image(video, 0, 0, width, height);
//pop(); // restaura las transformaciones




// para los keypoints en las manos
function draw() {
  image(video, 0, 0, width, height);
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        for (let i = 0; i < hand.keypoints.length; i++) {
          let keypoint = hand.keypoints[i];
          if (hand.handedness == "Right") {
            // color mano izquierda
            fill(255, 0, 100);
          } else {
            fill(0, 255, 100); //color mano derecha
          }
          noStroke();
          circle(keypoint.x, keypoint.y, 16);
        ]

para indice y pulgar

function draw() {
  image(video, 0, 0, width, height);
  if (hands.length > 0) {
    let hand = hands[0];
    let index = hand.index_finger_tip;
    let thumb = hand.thumb_tip;
    fill(255, 0, 100);
    noStroke();
    circle(index.x, index.y, 16);
    circle(thumb.x, thumb.y, 16);
  }



  let tree = [];
let trunkHeight = 50; //altura del tronco
let trunkWidth = 20; //ancho del tronco
let branchLength = 100; //longitud de la rama
let branchAngle = 45; //ángulo de la rama