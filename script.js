// Extend the base functionality of JavaScript
Array.prototype.last = function () {
  return this[this.length - 1];
};

const imageurl = localStorage.getItem("GameLevel");
  // const backgroundImage = new Image();
  // backgroundImage.src = `assets/${imageurl}png`

  // Function to change the background image URL based on the level
function changeBackgroundImageForLevel(level) {
  const body = document.getElementById("clouds");
  let imageUrl;

  // Set the body's background image
  body.style.background = `url(assets/${imageurl}.png)`;
  body.style.backgroundImage = `url(assets/${imageurl}.png)`;
  body.style.backgroundSize = 'cover';
  body.style.backgroundRepeat = 'no-repeat';
  body.style.backgroundPosition = 'center';
}

// Example usage:
const currentLevel = 1; // Replace this with the current level
changeBackgroundImageForLevel(currentLevel);


// A sinus function that accepts degrees instead of radians
Math.sinus = function (degree) {
  return Math.sin((degree / 180) * Math.PI);
};

// Game data
let phase = "waiting"; // waiting | stretching | turning | walking | transitioning | falling
let lastTimestamp; // The timestamp of the previous requestAnimationFrame cycle

let characterX; // Changes when moving forward
let characterY; // Only changes when falling
let sceneOffset; // Moves the whole game

let blocks = [];
let bridges = [];

let score = 0;

// Create an audio element
const audio = new Audio();


// Function to create an audio element and play the audio
function playAudio() {

  // Set the source (URL) for the audio
  const audioUrl = 'audio/bgmusic.mp3'; // Replace 'YOUR_AUDIO_URL' with the actual URL of the audio file
  audio.src = audioUrl;

  // Set the audio to loop
  audio.loop = true;

  // Play the audio
  audio.play();
}

// Add an event listener to the document for user interaction
document.addEventListener('click', function() {
  playAudio(); // This will start audio playback when the user clicks anywhere on the document
});


// Configuration
const canvasWidth = 375;
const canvasHeight = 375;
const blocksHeight = 100;
const characterDistanceFromEdge = 10; // While waiting
const paddingX = 100; // The waiting position of the character in from the original canvas size
const perfectAreaSize = 10;

const stretchingSpeed = 4; // Milliseconds it takes to draw a pixel
const turningSpeed = 4; // Milliseconds it takes to turn a degree
const walkingSpeed = 4;
const transitioningSpeed = 2;
const fallingSpeed = 2;

const characterWidth = 17; // 24
const characterHeight = 30; // 40

const canvas = document.getElementById("game");
canvas.width = window.innerWidth; // Make the Canvas full screen
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

const introductionElement = document.getElementById("introduction");
const perfectElement = document.getElementById("perfect");
const restartButton = document.getElementById("restart");
const scoreElement = document.getElementById("score");

// Initialize layout
resetGame();

// Resets game variables and layouts but does not start the game (game starts on keypress)
function resetGame() {
  phase = "waiting";
  lastTimestamp = undefined;
  sceneOffset = 0;
  score = 0;

  introductionElement.style.opacity = 1;
  perfectElement.style.opacity = 0;
  restartButton.style.display = "none";
  scoreElement.innerText = score;

  blockss = [{ x: 50, w: 50 }];
  generateblocks();
  generateblocks();
  generateblocks();
  generateblocks();

  bridges = [{ x: blockss[0].x + blockss[0].w, length: 0, rotation: 0 }];

  characterX = blockss[0].x + blockss[0].w - characterDistanceFromEdge;
  characterY = 0;

  draw();
}

function generateblocks() {
  const level = localStorage.getItem("GameLevel");
  let minimumGap, maximumGap, minimumWidth, maximumWidth;
  if (level == 1) {
    minimumGap = 60;
    maximumGap = 100;
    minimumWidth = 40;
    maximumWidth = 120;
  } else if (level == 2) {
    minimumGap = 50;
    maximumGap = 150;
    minimumWidth = 30;
    maximumWidth = 100;
  } else if (level == 3) {
    minimumGap = 80;
    maximumGap = 200;
    minimumWidth = 20;
    maximumWidth = 80;
  } else {
    minimumGap = 80;
    maximumGap = 200;
    minimumWidth = 20;
    maximumWidth = 80;
  }

  const lastblocks = blockss[blockss.length - 1];
  let furthestX = lastblocks.x + lastblocks.w;
  const x =
    furthestX +
    minimumGap +
    Math.floor(Math.random() * (maximumGap - minimumGap));
  const w =
    minimumWidth + Math.floor(Math.random() * (maximumWidth - minimumWidth));

  blockss.push({ x, w });
}

window.addEventListener("keydown", function (event) {
  if (event.key == " ") {
    event.preventDefault();
    resetGame();
    return;
  }
});
window.addEventListener("touchstart", function (event) {

  if (phase == "waiting") {
    lastTimestamp = undefined;
    introductionElement.style.opacity = 0;
    console.log(event,"eventmobile")
    phase = "stretching";
    window.requestAnimationFrame(animate);
  }
})
window.addEventListener("mousedown", function (event) {
  if (phase == "waiting") {
    lastTimestamp = undefined;
    introductionElement.style.opacity = 0;
    console.log(event,"event")
    phase = "stretching";
    window.requestAnimationFrame(animate);
  }
});

window.addEventListener("mouseup", function (event) {

  if (phase == "stretching") {
    phase = "turning";
  }
});

window.addEventListener("resize", function (event) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  draw();
});

window.requestAnimationFrame(animate);

let prevCase;
function playSoundForState(state) {
  let audioUrl;

  // Pause the current audio and then play the new sound
  audio.pause();
  audio.onpause = function () {
    switch (state) {
      case "waiting":
        audioUrl = "audio/bgmusic.mp3";
        audio.src = audioUrl;
        prevCase = "waiting"
        audio.play();
        return; // Stop the loop or do other actions
      case "stretching":
        audioUrl = "audio/stretching.mp3";
        prevCase = "stretching";
        break;
      case "falling":
        audioUrl = "audio/fall.mp3";
        prevCase = "falling";
        break;
      case "turning":
        audioUrl = "audio/success.wav";
        prevCase = "turning";
        break;
        // Add other cases here as needed
      default:
        break;
    }

    // Set the source (URL) for the audio
    audio.src = audioUrl;
    // Play the audio
    audio.play();
  };
}

// The main game loop
function animate(timestamp) {
  if (!lastTimestamp) {
    lastTimestamp = timestamp;
    window.requestAnimationFrame(animate);
    return;
  }

  switch (phase) {
    case "waiting":
      if (prevCase != "waiting") {
        playSoundForState("waiting");
      }
      return; // Stop the loop
    case "stretching": {
      if (prevCase != "stretching") {
        playSoundForState("stretching");
      }
      bridges.last().length += (timestamp - lastTimestamp) / stretchingSpeed;
      break;
    }
    case "turning": {
      if (prevCase != "turning") {
        playSoundForState("turning");
      }
      bridges.last().rotation += (timestamp - lastTimestamp) / turningSpeed;

      if (bridges.last().rotation > 90) {
        bridges.last().rotation = 90;

        const [nextblocks, perfectHit] = theblocksTheBridgeHits();
        if (nextblocks) {
          // Increase score
          score += perfectHit ? 2 : 1;
          scoreElement.innerText = score;

          if (perfectHit) {

            perfectElement.style.opacity = 1;
            setTimeout(() => (perfectElement.style.opacity = 0), 1000);

          }
          localStorage.setItem("score", score);
          if (score >= 15) {
            localStorage.setItem("score", score.toString()); // Store the score in localStorage
            window.location.href = "success.html"; // Redirect to the success page
          }
          generateblocks();
        }

        phase = "walking";
      }
      break;
    }
    case "walking": {
      characterX += (timestamp - lastTimestamp) / walkingSpeed;

      const [nextblocks] = theblocksTheBridgeHits();
      if (nextblocks) {
        // If character will reach another blocks then limit it's position at it's edge
        const maxcharacterX =
          nextblocks.x + nextblocks.w - characterDistanceFromEdge;
        if (characterX > maxcharacterX) {
          characterX = maxcharacterX;
          phase = "transitioning";
        }
      } else {
        // If character won't reach another blocks then limit it's position at the end of the pole
        const maxcharacterX =
          bridges.last().x + bridges.last().length + characterWidth;
        if (characterX > maxcharacterX) {
          characterX = maxcharacterX;
          phase = "falling";
        }
      }
      break;
    }
    case "transitioning": {
      sceneOffset += (timestamp - lastTimestamp) / transitioningSpeed;

      const [nextblocks] = theblocksTheBridgeHits();
      if (sceneOffset > nextblocks.x + nextblocks.w - paddingX) {
        // Add the next step
        bridges.push({
          x: nextblocks.x + nextblocks.w,
          length: 0,
          rotation: 0,
        });
        phase = "waiting";
      }
      break;
    }
    case "falling": {
      if (prevCase != "falling") {
        playSoundForState("falling");
      }
      setTimeout(()=>{
        playSoundForState("waiting");
      },2000)
      if (bridges.last().rotation < 180)
        bridges.last().rotation += (timestamp - lastTimestamp) / turningSpeed;

      characterY += (timestamp - lastTimestamp) / fallingSpeed;
      const maxcharacterY =
        blocksHeight + 100 + (window.innerHeight - canvasHeight) / 2;
      if (characterY > maxcharacterY) {
        if (score < 15) {
          window.location.href = "levelfailed.html";
        }
        restartButton.style.display = "block";
        return;
      }
      break;
    }
    default:
      break;
  }

  draw();
  window.requestAnimationFrame(animate);

  lastTimestamp = timestamp;
}

function theblocksTheBridgeHits() {
  if (bridges.last().rotation != 90)
    throw Error(`Stick is ${bridges.last().rotation}°`);
  const stickFarX = bridges.last().x + bridges.last().length;

  const blocksTheStickHits = blockss.find(
    (blocks) => blocks.x < stickFarX && stickFarX < blocks.x + blocks.w
  );

  // If the stick hits the perfect area
  if (
    blocksTheStickHits &&
    blocksTheStickHits.x + blocksTheStickHits.w / 2 - perfectAreaSize / 2 <
      stickFarX &&
    stickFarX <
      blocksTheStickHits.x + blocksTheStickHits.w / 2 + perfectAreaSize / 2
  )
    return [blocksTheStickHits, true];

  return [blocksTheStickHits, false];
}





function draw() {
  drawBackground();
  ctx.save();
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);


  ctx.translate(
    (window.innerWidth - canvasWidth) / 2 - sceneOffset,
    (window.innerHeight - canvasHeight) / 2
  );

  drawblockss();
  drawcharacter();
  drawSticks();

  ctx.restore();
}

restartButton.addEventListener("click", function (event) {
  event.preventDefault();
  resetGame();
  restartButton.style.display = "none";
});

// Drawing functions for blockss, character, and sticks (existing logic)
function drawblockss() {

  const primaryColors = ["red", "green", "blue"]; // Array of primary colors
  let colorIndex = 0; // To cycle through the colors

  blockss.forEach(({ x, w }) => {
    // Draw blocks with a primary color, cycling through the array
    ctx.fillStyle = primaryColors[colorIndex % primaryColors.length];
    ctx.fillRect(
      x,
      canvasHeight - blocksHeight,
      w,
      blocksHeight + (window.innerHeight - canvasHeight) / 2
    );

    // Increment color index for the next blocks
    colorIndex++;

    // Draw perfect area only if character did not yet reach the blocks
    if (bridges.last().x < x) {
      ctx.fillStyle = ""; // Keeping the perfect area red
      ctx.fillRect(
        x + w / 2 - perfectAreaSize / 2,
        canvasHeight - blocksHeight,
        perfectAreaSize,
        perfectAreaSize
      );
    }
  });
}

function drawcharacter() {
  ctx.save();

  // Customize the body color
  ctx.fillStyle = "blue"; // Change to your desired body color

  ctx.translate(
    characterX - characterWidth / 2,
    characterY + canvasHeight - blocksHeight - characterHeight / 2
  );

  // Body
  drawRoundedRect(
    -characterWidth / 2,
    -characterHeight / 2,
    characterWidth,
    characterHeight - 4,
    5
  );

  // Customize the leg color
  ctx.fillStyle = "green"; // Change to your desired leg color

  const legDistance = 8; // Adjust the leg distance for the larger character
  ctx.beginPath();
  ctx.arc(legDistance, 16, 5, 0, Math.PI * 2, false); // Adjust the leg parameters
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-legDistance, 16, 5, 0, Math.PI * 2, false); // Adjust the leg parameters
  ctx.fill();

  // Customize the eye color
  ctx.fillStyle = "white"; // Change to your desired eye color

  // Eye
  ctx.beginPath();
  ctx.arc(8, -12, 6, 0, Math.PI * 2, false); // Adjust the eye parameters
  ctx.fill();

  // Customize the band color
  ctx.fillStyle = "purple"; // Change to your desired band color

  // Band
  ctx.fillRect(-characterWidth / 2 - 1, -14, characterWidth + 2, 6); // Adjust the band parameters
  ctx.beginPath();
  ctx.moveTo(-12, -18); // Adjust the band parameters
  ctx.lineTo(-24, -24); // Adjust the band parameters
  ctx.lineTo(-18, -10); // Adjust the band parameters
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-14, -12); // Adjust the band parameters
  ctx.lineTo(-20, -6); // Adjust the band parameters
  ctx.lineTo(-8, -8); // Adjust the band parameters
  ctx.fill();

  ctx.restore();
}

function drawRoundedRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x, y + radius);
  ctx.lineTo(x, y + height - radius);
  ctx.arcTo(x, y + height, x + radius, y + height, radius);
  ctx.lineTo(x + width - radius, y + height);
  ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
  ctx.lineTo(x + width, y + radius);
  ctx.arcTo(x + width, y, x + width - radius, y, radius);
  ctx.lineTo(x + radius, y);
  ctx.arcTo(x, y, x, y + radius, radius);
  ctx.fill();
}

function drawSticks() {

  bridges.forEach((stick) => {
    ctx.save();

    // Move the anchor point to the start of the stick and rotate
    ctx.translate(stick.x, canvasHeight - blocksHeight);
    ctx.rotate((Math.PI / 180) * stick.rotation);

    // Increase the line thickness for the stick
    ctx.lineWidth = 4; // Adjust the line thickness as needed

    // Draw stick
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -stick.length);
    ctx.stroke();

    // Restore transformations
    ctx.restore();
  });
}

function drawBackground() {
  // Draw sky
  // Add the background image here
  const imageurl = localStorage.getItem("GameLevel");
  const backgroundImage = new Image();
  backgroundImage.src = `assets/${imageurl}png`; // Replace 'path_to_your_image.jpg' with the actual path to your image

  // Ensure the image is loaded before drawing it onto the canvas
  backgroundImage.onload = function () {

    drawSticks();

    // Restore transformation
    ctx.restore();
  };
}




