//for visual setting;
let video;
let face;
let predictions = [];
let borderline = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];
let poly = [];

//for sound setting;
let rec;
let myChoice;

//for game state;
let startGame = false;
let virus = [];
let score = 0;
let lives = 19;
let gameState = 'start';


function setup() {
    createCanvas(960, 720);
    
    video = createCapture(VIDEO);
    video.hide();

    face = ml5.facemesh(video, modelLoaded);
    face.on("predict", results => {
        predictions = results;
    });
    

    rec = new p5.SpeechRec('en-US', parseResult); 

    rec.continuous = true; 
    rec.interimResults = false;

    rec.start(); 

    for (let i=0; i<10; i++) {
        virus[i] = new Virus();
    }
}


function draw() {
    print(gameState)
    if (gameState === 'start') {
        startMenu();
    }
    if (gameState === 'inGame') {
        inGame();
    }
    if (gameState === 'tips') {
        knowledge();
    }
    if (gameState === 'instruction') {
        instruction();
    }
    if (gameState === 'over') {
        sickScene();
    }

    
    print(score)

}


function startMenu() {
    background(140, 140, 255);

    fill(0);
    textAlign(CENTER);
    textSize(48);
    text('Say start to start game!', width/2, height/2);
}


function knowledge() {
    background(140, 140, 255);

    fill(0);
    textAlign(CENTER);
    textSize(48);
    text('What you should know before starting the game...', width/2, height/2);
}


function instruction() {
    background(140, 140, 255);

    fill(0);
    textAlign(CENTER);
    textSize(48);
    text('How to play this game?', width/2, height/2);
}


function inGame() {
    background(140, 140, 255);
    push();
    scale(1.5);
    drawSkeleton();
  
    for (let i=0; i<virus.length; i++) {
        virus[i].view();
    
        virus[i].collideFace();
        virus[i].reset();
//        print('x', virus[i].x);
//        print('y', virus[i].y)
    
        textSize(25);
        fill(255, 0, 0);
        textAlign(LEFT);
        text('Score: ' + score, 20, 50);
        text('Lives Left: ' + lives, 20, 100);
    }
    pop();
    
    if (lives <= 0) {
        gameState = 'over';
    }
}


function modelLoaded() {
    console.log('facemesh ready');
}


function drawSkeleton() {
    image(video, 0, 0);

    for (let i = 0; i < predictions.length; i += 1) {
        const keypoints = predictions[i].scaledMesh;

        for (let j = 0; j < borderline.length; j += 1) {
            let [x1, y1] = keypoints[borderline[j]];
            
            if (j<borderline.length - 1) {
                let [x2, y2] = keypoints[borderline[j+1]];
            }
      
            fill(0, 255, 0);
            ellipse(x1, y1, 5, 5);
            stroke(5);
      
            if (j < borderline.length-1) {
                line(x1, y1, keypoints[borderline[j+1]][0], keypoints[borderline[j+1]][1]);
                line(keypoints[borderline[borderline.length-1]][0], keypoints[borderline[borderline.length-1]][1], keypoints[borderline[0]][0], keypoints[borderline[0]][1]);
            }
        }
    }
}

function sickScene() {
    background(140, 140, 255);
  
    fill(0);
    textAlign(CENTER);
    textSize(48);
    text('You got sick', width/2, height/2);
}


class Virus {
    constructor() {
        this.x = random(0, 640);
        this.y = 0;
        this.size = random(15,30);
        this.color = color(0);
        this.speed = random(2, 5);
        this.hit = false; 
        this.in = false;
    }
  
    view() {
        noStroke();
        fill(this.color);
        circle(this.x, this.y, this.size);

        this.y += this.speed;
    }
  
  
    collideFace() {
        for (let i = 0; i < predictions.length; i += 1) {
            const keypoints = predictions[i].scaledMesh;

            for (let j = 0; j < borderline.length; j += 1) {
                poly[j] = createVector(keypoints[borderline[j]][0], keypoints[borderline[j]][1]);
            }
        }
    
        this.hit = collideCirclePoly(this.x, this.y, this.size, poly);

        if (!this.in) {
            if (this.hit) {
                this.x = random(0, 640);
                this.y = 0;
                this.size = random(15, 30);
                this.speed = random(2, 5); 
                this.in = true;
                lives -= 1;
//                print('hit');
            }
        }
    
        if (!this.hit) {
            this.in = false;
        }
    }
    
    
    reset() {
        if (this.y > height) {
            this.x = random(0, 640);
            this.y = 0;
            this.size = random(15, 30);
            this.color = color(0);
            this.speed = random(2, 5);
            this.hitLine = false;
            this.hitPoint = false;  
            score += 1;
        }
    }
}


function parseResult() {
    let myChoice = rec.resultString.split(' ');
    console.log(myChoice);

  
    for (let i=0; i<myChoice.length; i++) {
        if (gameState === 'start') {
            if (myChoice[i] === "tips") {  
                gameState = 'tips';
            } else if (myChoice[i] == "start") {
                gameState = 'inGame';
            } else if (myChoice[i] === "instruction") {
                gameState = 'instruction';
            }
        } 
        if (gameState === 'tips' || gameState === 'instruction') {
            if (myChoice[i] === "back") {
                gameState = 'start';
            }
        }

    // } else if (myChoice[i] == "no") {
    //   startGame = false;}
    }
} 