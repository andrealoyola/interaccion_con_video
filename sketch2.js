let handPose;
let video;
let hands = [];

function preload() {
  handPose = ml5.handPose();
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  let canvas = createCanvas(640, 480);
  //crear el video con la webcam
  canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  handPose.detectStart(video, gotHands);
}

function draw() {
  image(video, 0, 0, width, height);
  if (hands.length > 0) {
    hand = hands[0];
    let index = hand.index_finger_tip;
    let thumb = hand.thumb_tip;

    if (thumb.y < index.y) {
      text("positivo", index.x, index.y);
    } else {
      text("negativo", index.x, index.y);
    }
    textSize(100);
    textAlign(CENTER, CENTER);
    fill(255, 0, 100);
    noStroke();
    circle(index.x, index.y, 16);
    circle(thumb.x, thumb.y, 16);
  }
}
