
window.addEventListener('load', function(){

const FOLDER_PATH = "./images/"; // Floder for the images


const maxFailed = 3
let failedCount = 0;
let isPaused = false;

//after 15 second the game changes 

setInterval(function() {
    togglePause();
}, 15000);


let canvas = document.getElementById("canvas2");
//const audio = document.getElementById("audio");
const eltRestart = document.getElementById("divRestart");
const ctx = canvas.getContext("2d");
ctx.font = '30px Impact';
canvas.width=window.innerWidth * 0.5;
canvas.height=900;
const pauseOverlayTower = document.getElementById("pauseOverlayTower");
pauseOverlayTower.style.width = canvas.width + "px";
pauseOverlayTower.style.height = canvas.height + "px";
//let mode = 'bounce';


/*
const enemies=10;
const enemiesArray=[];
const birds=10;
const birdsArray=[];
let gameFrame = 0;
*/

/*
let heartImg = new Image();
heartImg.src = "heart.png";
const heartWidth = heartImg.width;
const heartHeight = heartImg.height;
const zoomedHeartWidth = canvas.width * 0.08;
const zoomedHeartHeight = (heartHeight * zoomedHeartWidth) / heartHeight;


*/


 //class game that is the heart of the game



class Game{   constructor(width, height){
    this.width=width;
    this.height=height;
 //   this.block=new Block(this);
    this.background = new Background(this);
    this.speed=3;

}
update(){
    this.background.update();
    this.block.update();

}

draw(context){
    this.background.draw(context);
    this.block.draw(context);
}
}











//BLOCKS INPUT-------------------------------------------------


// Set background image
let backgroundImage = new Image();
backgroundImage.src = 'background.png';




// Ensure the background image is loaded before starting the animation
backgroundImage.onload = function () {
    // Start the animation loop after the background image is loaded
    restart();  // Start the game logic
    animate();  // Start the animation loop

};

let scrollCounter, cameraY, current, mode, xSpeed;

let ySpeed = 5;
let height = 40; // Adjust based on your image size
let blocks = [];
let ropes = [];





blocks[0] = {
    x: 300,
    y: 200,
    width: 200
};

let hook ={
    x: 0,
    y: 0,
    width: 200,
    height: 300
}


let scrap = {
    x: 0,
    width: 0
};

let towerImage = new Image();
towerImage.src = 'block.png'; // Image path

towerImage.onload = function () {
    console.log("tower Image loaded successfully");
};

towerImage.onerror = function () {
    console.error("Error loading the image");
};



let hookImage = new Image();
hookImage.src = 'hook.png'; // Image path

hookImage.onload = function () {
    console.log("hook Image loaded successfully");
};

hookImage.onerror = function () {
    console.error("Error loading the image");
};


let fps = 60;
let now;
let then = Date.now();
let interval = 500 / fps;
let delta;



function loop() {
    requestAnimationFrame(loop);
    if (!isPaused) {
        now = Date.now();
        delta = now - then;
        if (delta > interval) {
            then = now - (delta % interval);
            animate();
        }
    }
 }

 
 window.addEventListener('keyup', e => {
    if (e.key === 'q') togglePause();
});

 function togglePause() {
    isPaused = !isPaused;

    const pauseOverlay = document.getElementById('pauseOverlayTower');
    pauseOverlay.style.display = isPaused ? 'flex' : 'none';

    if (isPaused) {
        // Add any additional pause logic here
    //    audio.pause();
    } else {
        // Add any additional resume logic here
      //  audio.play();
        loop(); // Restart the animation loop after resuming
    }
}

function newBlocks() {
    blocks[current] = {
        x: 0,
        y: (current + 10) * height,
        width: blocks[current - 1].width
    };

    ropes[current] = {
        x: blocks[current].x + blocks[current].width / 2,
        y: 0,
        length: canvas.height - blocks[current].y  // Adjust the length of the rope
    };


}

function gameOver() {
    mode = 'gameOver';
    // ctx.font = 'fantasy';
    // ctx.fillStyle = 'red';
    ctx.fillText('Game over!', 0, 0);
   // audio.pause();
    eltRestart.style.display = 'block';

}


/*
//new
function showHeart() {
    const heartCount = 3; // Number of hearts to display

    for (let i = 0; i < heartCount; i++) {
        const x = canvas.width -80- i * (zoomedHeartWidth + 10);
        const y = 40;

        ctx.drawImage(
            heartImg,
            x,
            y,
            zoomedHeartWidth + 10,
            zoomedHeartHeight - 30
        );
    }
}


*/


//--------------------------------------------------------------
//function

//functi

function backgroundLinearGradient() {
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, '#FF9666'); // Adjust gradient colors as needed
    grad.addColorStop(1, '#8E5B54');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

//functi
function backgroundImg() {
    const bgWidth = backgroundImage.width;
    const bgHeight = backgroundImage.height;
    const zoomedHeight = (bgHeight * canvas.width) / bgWidth;
    let offsetHeight = canvas.height - zoomedHeight + cameraY;

    if (offsetHeight > canvas.height) {
        offsetHeight = canvas.height;
    }

    // Draw the moving background image
    ctx.drawImage(backgroundImage, 0, offsetHeight, canvas.width, zoomedHeight);
}







function animate() {

    ctx.clearRect(0,0,canvas.width, canvas.height);

    
    // Draw the background first
   backgroundLinearGradient();
    backgroundImg();

  

    if (mode != 'consolas') {
        ctx.font = '40px Impact';
        ctx.fillStyle = 'black'; // Set text color to white for visibility
        ctx.fillText('Score: ' + (current - 1).toString(), 60, 70);




        //new
        // showHeart();


        // Movement and collision logic

        if (mode == 'bounce') {
            blocks[current].x += xSpeed;
            ropes[current].x += xSpeed;


            if (xSpeed > 0 && blocks[current].x + blocks[current].width > canvas.width) {
                xSpeed = -xSpeed;
            }

            if (xSpeed < 0 && blocks[current].x < 0) {
                xSpeed = -xSpeed;
            }
        }

        if (mode == 'fall') {
            blocks[current].y -= ySpeed;
            ropes[current].y -= ySpeed;

            if (blocks[current].y <= blocks[current - 1].y + height) {
                mode = 'bounce';
                let difference = blocks[current].x - blocks[current - 1].x;

                if (Math.abs(difference) >= blocks[current].width) {
                    gameOver();
                }

                scrap = {
                    y: blocks[current].y,
                    width: difference
                };

                if (blocks[current].x > blocks[current - 1].x) {
                    blocks[current].width -= difference;
                    scrap.x = blocks[current].x + blocks[current].width;
                } else {
                    scrap.x = blocks[current].x - difference;
                    blocks[current].width += difference;
                    blocks[current].x = blocks[current - 1].x;
                }

                if (xSpeed > 0) {
                    xSpeed++;
                } else {
                    xSpeed--;
                }

                current++;
                scrollCounter = height;
                newBlocks();
            }
        }

        scrap.y -= ySpeed;

        if (scrollCounter) {
            cameraY++;
            scrollCounter--;
        }

        // Drawing the ropes from the ceiling to the blocks


        //new

        // set the x and y for the hook and rope
        hook.x = blocks[current].x+ blocks[current].width/2-hook.width/2;
        hook.y = blocks[current].y-current*40-535;


        // Drawing the blocks with the image
        for (let n = 0; n < blocks.length; n++) {
            let block = blocks[n];
            ctx.drawImage(towerImage, block.x, 600 - block.y + cameraY, block.width, height * 1.30);
        }

        // Drawing the scrap with the image (if needed)
        if (scrap.width > 0) {
            ctx.drawImage(towerImage, scrap.x, 600 - scrap.y + cameraY, scrap.width, height);
        }

        //TODO: hook and rope
        ctx.drawImage(hookImage,hook.x,hook.y,hook.width,hook.height);
        //ctx.drawImage(ropeImage,rope.x,rope.y,rope.width,rope.height); //set up a rope height
    }
}



function restart() {
    failedCount = maxFailed;
    blocks.splice(1, blocks.length - 1);
    ropes.splice(1, ropes.length - 1);
   // cloudTab.splice(1, cloudTab.length - 1);
    mode = 'bounce';
    cameraY = 0;
    scrollCounter = 0;
    xSpeed = 2;
    current = 1;
    newBlocks();
    scrap.y = 0;
  //  audio.volume = 0.2;

   // audio.pause();

    showHeart();
}



canvas.onpointerdown = function () {
    if (mode == 'gameOver') {
        restart();
    } else {
        if (mode == 'bounce') {
            mode = 'fall';
        }
    }
};

// start the animate loop

loop();
togglePause();



});