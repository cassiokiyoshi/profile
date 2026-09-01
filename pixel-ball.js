const canvas = document.querySelector("#hero-canvas");
const context = canvas.getContext("2d");

const BALL_SCALE = 2;
const PIXEL_SIZE = 8 * BALL_SCALE;
const NORMAL_RADIUS = 20 * BALL_SCALE;
const GLITCH_RADIUS = 37 * BALL_SCALE;

const NORMAL_SPEED = 240;
const INTERACTION_RADIUS = 140;
const GLITCH_DURATION = 0.22;
const BOOST_MULTIPLIER = 1.7;

const ballPattern = [
  "01110",
  "11111",
  "11111",
  "11111",
  "01110",
];

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  velocityX: 190,
  velocityY: 145,
  glitchTimer: 0,
};

const pointer = {
  x: 0,
  y: 0,
  active: false,
};

let previousTime = 0;

function getRowOffset(rowIndex) {
  if (ball.glitchTimer <= 0) {
    return 0;
  }

  const phase = Math.floor(
    ball.glitchTimer * 60,
  );

  const direction = phase % 2 === 0 ? -1 : 1;

  if (rowIndex === 0) {
    return 12 * BALL_SCALE * direction;
  }

  if (rowIndex === ballPattern.length - 1) {
    return -12 * BALL_SCALE * direction;
  }

  const band = (rowIndex + phase) % 3;

  if (band === 0) {
    return -10 * BALL_SCALE;
  }

  if (band === 1) {
    return 6 * BALL_SCALE;
  }

  return 12 * BALL_SCALE;
}

function drawBallLayer(color, channelOffset = 0) {
  context.fillStyle = color;

  const patternWidth =
    ballPattern[0].length * PIXEL_SIZE;

  const patternHeight =
    ballPattern.length * PIXEL_SIZE;

  const startingX = Math.round(
    ball.x - patternWidth / 2,
  );

  const startingY = Math.round(
    ball.y - patternHeight / 2,
  );

  ballPattern.forEach((row, rowIndex) => {
    const rowOffset = getRowOffset(rowIndex);

    [...row].forEach((pixel, columnIndex) => {
      if (pixel !== "1") {
        return;
      }

      context.fillRect(
        startingX +
          columnIndex * PIXEL_SIZE +
          rowOffset +
          channelOffset,
        startingY + rowIndex * PIXEL_SIZE,
        PIXEL_SIZE,
        PIXEL_SIZE,
      );
    });
  });
}

function drawBall() {
  context.clearRect(
    0,
    0,
    canvas.width,
    canvas.height,
  );

  if (ball.glitchTimer > 0) {
    drawBallLayer(
      "rgba(0, 255, 255, 0.75)",
      -5 * BALL_SCALE,
    );

    drawBallLayer(
      "rgba(255, 0, 170, 0.75)",
      5 * BALL_SCALE,
    );
  }

  drawBallLayer("#f2f0e9");
}

function updatePointerPosition(event) {
  const bounds = canvas.getBoundingClientRect();

  pointer.x =
    (event.clientX - bounds.left) *
    (canvas.width / bounds.width);

  pointer.y =
    (event.clientY - bounds.top) *
    (canvas.height / bounds.height);

  pointer.active = true;
}

function repelFromPointer() {
  if (!pointer.active) {
    return;
  }

  const differenceX = ball.x - pointer.x;
  const differenceY = ball.y - pointer.y;

  const distance = Math.hypot(
    differenceX,
    differenceY,
  );

  if (
    distance <= 0 ||
    distance >= INTERACTION_RADIUS
  ) {
    return;
  }

  const normalX = differenceX / distance;
  const normalY = differenceY / distance;

  const speed = Math.hypot(
    ball.velocityX,
    ball.velocityY,
  );

  const strength =
    1 - distance / INTERACTION_RADIUS;

  ball.velocityX =
    ball.velocityX * (1 - strength) +
    normalX * speed * strength;

  ball.velocityY =
    ball.velocityY * (1 - strength) +
    normalY * speed * strength;

  const redirectedSpeed = Math.hypot(
    ball.velocityX,
    ball.velocityY,
  );

  if (redirectedSpeed > 0) {
    ball.velocityX =
      (ball.velocityX / redirectedSpeed) * speed;

    ball.velocityY =
      (ball.velocityY / redirectedSpeed) * speed;
  }
}

function triggerGlitch(event) {
  updatePointerPosition(event);

  let differenceX = ball.x - pointer.x;
  let differenceY = ball.y - pointer.y;

  let distance = Math.hypot(
    differenceX,
    differenceY,
  );

  if (distance < 1) {
    differenceX = -ball.velocityY;
    differenceY = ball.velocityX;
    distance = NORMAL_SPEED;
  }

  const directionX = differenceX / distance;
  const directionY = differenceY / distance;

  const boostedSpeed =
    NORMAL_SPEED * BOOST_MULTIPLIER;

  ball.velocityX = directionX * boostedSpeed;
  ball.velocityY = directionY * boostedSpeed;
  ball.glitchTimer = GLITCH_DURATION;
}

function settleSpeed(deltaTime) {
  const currentSpeed = Math.hypot(
    ball.velocityX,
    ball.velocityY,
  );

  if (currentSpeed <= NORMAL_SPEED) {
    return;
  }

  const settledSpeed = Math.max(
    NORMAL_SPEED,
    currentSpeed - 300 * deltaTime,
  );

  ball.velocityX =
    (ball.velocityX / currentSpeed) *
    settledSpeed;

  ball.velocityY =
    (ball.velocityY / currentSpeed) *
    settledSpeed;
}

function updateBall(deltaTime) {
  ball.x += ball.velocityX * deltaTime;
  ball.y += ball.velocityY * deltaTime;

  const radius =
    ball.glitchTimer > 0
      ? GLITCH_RADIUS
      : NORMAL_RADIUS;

  const minimum = radius;
  const maximumX = canvas.width - radius;
  const maximumY = canvas.height - radius;

  if (ball.x <= minimum) {
    ball.x = minimum;
    ball.velocityX = Math.abs(ball.velocityX);
  } else if (ball.x >= maximumX) {
    ball.x = maximumX;
    ball.velocityX = -Math.abs(ball.velocityX);
  }

  if (ball.y <= minimum) {
    ball.y = minimum;
    ball.velocityY = Math.abs(ball.velocityY);
  } else if (ball.y >= maximumY) {
    ball.y = maximumY;
    ball.velocityY = -Math.abs(ball.velocityY);
  }

  repelFromPointer();

  if (ball.glitchTimer > 0) {
    ball.glitchTimer = Math.max(
      0,
      ball.glitchTimer - deltaTime,
    );
  } else {
    settleSpeed(deltaTime);
  }
}

function animate(currentTime) {
  if (previousTime === 0) {
    previousTime = currentTime;
  }

  const deltaTime = Math.min(
    (currentTime - previousTime) / 1000,
    0.033,
  );

  previousTime = currentTime;

  updateBall(deltaTime);
  drawBall();

  requestAnimationFrame(animate);
}

canvas.addEventListener(
  "pointermove",
  updatePointerPosition,
);

canvas.addEventListener(
  "pointerdown",
  triggerGlitch,
);

canvas.addEventListener("pointerleave", () => {
  pointer.active = false;
});

requestAnimationFrame(animate);
