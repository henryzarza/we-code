// Hover effect
const imageContainer = document.querySelectorAll('.section__item-img');
Array.from(imageContainer).forEach(el => {
  const imgs = Array.from(el.querySelectorAll('img'));
  new hoverEffect({
    parent: el,
    intensity1: 0.2,
    angle2: Math.PI,
    easing: 'Circ.easeOut',
    speedOut: 0.6,
    speedIn: 0.6,
    image1: imgs[0].getAttribute('src'),
    image2: imgs[1].getAttribute('src'),
    displacementImage: el.dataset.displacement
  });
});

// fullpage scroll
new fullpage('#fullpage', {
  navigation: true,
  navigationPosition: 'left',
  verticalCentered: false,
  sectionSelector: '.page',
  navigationTooltips: [
    'Principal',
    'Speech detection',
    'Stacking context',
    'Teoría del color',
    'Countdown only with CSS',
    'Sombras en CSS',
    'Complex animations in 5 minutes of code',
    'Accesibilidad',
    'Speech synthesis',
    'Array methods',
    'Principios de animaciones',
    'Animaciones con SVG',
    'Face detection',
    'Intersection Observer'
  ]
});

// Canvas
const canvas = document.querySelector('.snow'),
  ctx = canvas.getContext('2d'),
  windowW = window.innerWidth,
  windowH = window.innerHeight,
  numFlakes = 150,
  flakes = [];

function Flake(x, y) {
  const maxWeight = 2,
    maxSpeed = 1;
  this.x = x;
  this.y = y;
  this.r = randomBetween(0, 1);
  this.a = randomBetween(0, Math.PI);
  this.aStep = 0.01;
  this.weight = randomBetween(1, maxWeight);
  this.alpha = (this.weight / maxWeight);
  this.speed = (this.weight / maxWeight) * maxSpeed;

  this.update = function () {
    this.x += Math.cos(this.a) * this.r;
    this.a += this.aStep;
    this.y += this.speed;
  }
}

function init() {
  let i = numFlakes,
    flake,
    x,
    y;
  while (i--) {
    x = randomBetween(0, windowW, true);
    y = randomBetween(0, windowH, true);
    flake = new Flake(x, y);
    flakes.push(flake);
  }
  scaleCanvas();
  loop();
}

function scaleCanvas() {
  canvas.width = windowW;
  canvas.height = windowH;
}

function loop() {
  let i = flakes.length,
    flakeA;

  // clear canvas
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, windowW, windowH);
  ctx.restore();

  while (i--) {
    flakeA = flakes[i];
    flakeA.update();
    ctx.beginPath();
    ctx.arc(flakeA.x, flakeA.y, flakeA.weight, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'rgba(255, 255, 255, ' + flakeA.alpha + ')';
    ctx.fill();
    if (flakeA.y >= windowH) {
      flakeA.y = -flakeA.weight;
    }
  }

  requestAnimationFrame(loop);
}

function randomBetween(min, max, round) {
  const num = Math.random() * (max - min + 1) + min;
  return round ? Math.floor(num) : num;
}

function distanceBetween(vector1, vector2) {
  const dx = vector2.x - vector1.x,
    dy = vector2.y - vector1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

init();
