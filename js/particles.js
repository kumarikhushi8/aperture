const canvas = document.querySelector('.particle-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createRainDrop() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    length: 10 + Math.random() * 15,
    speed: 4 + Math.random() * 4,
    opacity: 0.3 + Math.random() * 0.4
  };
}

let raindrops = [];

function initRain(count) {
  raindrops = [];
  for (let i = 0; i < count; i++) {
    raindrops.push(createRainDrop());
  }
}

function drawRain() {
  ctx.strokeStyle = 'rgba(174, 194, 224, 0.6)';
  ctx.lineWidth = 1.5;

  raindrops.forEach(drop => {
    ctx.globalAlpha = drop.opacity;
    ctx.beginPath();
    ctx.moveTo(drop.x, drop.y);
    ctx.lineTo(drop.x, drop.y + drop.length);
    ctx.stroke();

    drop.y += drop.speed;

    if (drop.y > canvas.height) {
      drop.y = -drop.length;
      drop.x = Math.random() * canvas.width;
    }
  });

  ctx.globalAlpha = 1; // reset so it doesn't affect other drawing later
}


function createSnowFlake() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: 1.5 + Math.random() * 2.5,
    speed: 1 + Math.random() * 1.5,
    drift: Math.random() * 2 - 1, // between -1 and 1, sideways sway direction/strength
    angle: Math.random() * Math.PI * 2 // starting point in a sine wave cycle
  };
}

let snowflakes = [];

function initSnow(count) {
  snowflakes = [];
  for (let i = 0; i < count; i++) {
    snowflakes.push(createSnowFlake());
  }
}

function drawSnow() {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';

  snowflakes.forEach(flake => {
    ctx.beginPath();
    ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
    ctx.fill();

    flake.y += flake.speed;
    flake.angle += 0.02;
    flake.x += Math.sin(flake.angle) * 0.5;

    if (flake.y > canvas.height) {
      flake.y = -flake.radius;
      flake.x = Math.random() * canvas.width;
    }
  });
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const sceneStage = document.querySelector('.scene-stage');
  const weather = sceneStage.dataset.weather;

  if (weather === 'rain' || weather === 'drizzle' || weather === 'thunderstorm') {
    drawRain();
  } else if (weather === 'snow') {
    drawSnow();
  }

  requestAnimationFrame(animateParticles);
}
initRain(150);
initSnow(120);
animateParticles();


let lightningTimeout = null;

function scheduleLightning() {
  const sceneStage = document.querySelector('.scene-stage');
  
  if (sceneStage.dataset.weather !== 'thunderstorm') {
    lightningTimeout = setTimeout(scheduleLightning, 3000);
    return;
  }

  const lightningOverlay = document.querySelector('.lightning-overlay');
  
  lightningOverlay.classList.add('flash');
  setTimeout(() => lightningOverlay.classList.remove('flash'), 150);

  if (Math.random() < 0.5) {
    sceneStage.classList.add('shake');
    setTimeout(() => sceneStage.classList.remove('shake'), 300);
  }

  const nextFlashDelay = 8000 + Math.random() * 12000; // 8-20 seconds
  lightningTimeout = setTimeout(scheduleLightning, nextFlashDelay);
}

scheduleLightning();