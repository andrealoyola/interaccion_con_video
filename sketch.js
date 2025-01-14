let longText =
  "Este es un proyecto interactivo en el cual los usuarios deben tomar decisiones a través de gestos y movimientos corporales (ml5.js), pero estas decisiones afectan el crecimiento y la forma del árbol. Cada acción que el usuario toma genera nuevas ramas y hojas, se busca plantear un proyecto reflexivo, en el que se represente cómo las elecciones del usuario impactan su entorno. Las ramas cambian de forma, tamaño y color, dependiendo de las decisiones tomadas, creando un árbol único para cada experiencia.";

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(32); // tamaño de la fuente
  textAlign(LEFT, CENTER); // alineación del texto
  textLeading(20); // Establecer la distancia entre líneas
}

function draw() {
  background(220);
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
