//for visual setting;
let video;
let face;
let predictions = [];
let borderline = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];
let poly = [];
let faceReady = false;
let yellowVirus, redVirus, blueVirus, orangeVirus
let boundingRed, boundingBlue, boundingOrange, boundingYellow;

//for sound setting;
let rec;
let myChoice;

//Intro
let intro;
let exiting = false;

//for game state;
let startGame = false;
let virus = [];
let score = 0;
let lives = 19;
let gameState = 'start';


function preload() {
    yellowVirus = loadImage('virus/yellowVirus.png');
    blueVirus = loadImage('virus/blueVirus.png');
    redVirus = loadImage('virus/redVirus.png');
    orangeVirus = loadImage('virus/orangeVirus.png');
}


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

    intro = new Intro();
//    choicesSetting();
    
    boundingRed = new BoundingVirus();
    boundingYellow = new BoundingVirus();
    boundingOrange = new BoundingVirus();
    boundingBlue = new BoundingVirus();
    for (let i=0; i<10; i++) {
        virus[i] = new FallingVirus();
    }
}


function draw() {
    print(gameState);
    print(exiting)
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

    
//    print(score)

}


function startMenu() {
    background('#f8f8eb');
    
    boundingRed.view('red');
    boundingRed.move();
    
    boundingYellow.view('yellow');
    boundingYellow.move();
    
    boundingBlue.view('blue');
    boundingBlue.move();
    
    boundingOrange.view('orange');
    boundingOrange.move();

    fill(0);
    textAlign(CENTER);
    textFont('Bungee', 80);
    textStyle(BOLD);
    text('Game Name', width/2, height/3);
    textFont('Ubuntu Mono', 22);
    text('Instruction Page', 200, height * 0.8);
    text('Starting Playing', width/2, height * 0.8);
    text('Tips Page', width-200, height * 0.8);
    textStyle(NORMAL);
    textSize(18);
    text('instruction', 200, height * 0.65);
    text('start', width/2, height * 0.65);
    text('tips', width-200, height * 0.65);
    
    rectMode(CENTER);
    rect(200, height * 0.715, 70, 70); 
    rect(width/2, height * 0.715, 70, 70);
    rect(width-200, height * 0.715, 70, 70);
    fill(255);
    text('icon', 200, height * 0.72);
    text('icon', width/2, height * 0.72);
    text('icon', width-200, height * 0.72);
    
    intro.view();
    
    if (exiting) {
        intro.exit();
    }
}


class Intro {
    constructor () {
        this.x = width/2;
        this.y = height/3*2;
        this.width = width/2;
        this.height = height/2;
        this.color = color(240, 240, 240, 220);
        this.strokeColor = '#969897';
    }
    
    view() {
        rectMode(CENTER);
        fill(this.color, 50);
        stroke(this.strokeColor);
        strokeWeight(10);
        rect(this.x, this.y, this.width, this. height);
        fill(0);
        noStroke();
        rect(this.x, this.y+10, 80, 80);
        
        textAlign(CENTER);
        fill(0);
        noStroke();
        textSize(28);
        text('How to Play This Game', this.x, height/2);
        
        textFont('Ubuntu Mono', 18);
        text('Say the key word to enter the page of your choice.', this.x, this.y - 70);
        text('Example:', this.x - 189, this.y-25);
        text('If you want some tips before starting the game,', this.x, this.y+75);
        text('say "tips" to enter the tips page.', this.x, this.y+100);
        fill(255);
        text('image', this.x, this.y+15);
        fill('#0260ae');
        text('Now say EXIT to continue', this.x, this.y+155);
    }
    
    exit() {
        this.x -= 10;
        
        print(this.x);
        
        if (this.x < -this.width) {
            this.x = -this.width;
        }
    }
}

class BoundingVirus {
    constructor() {
        this.x = random(100, width-100);
        this.y = random(100, height-100);
        this.size = 200;
        this.xSpeed = random(2, 5);
        this.ySpeed = random(2, 5);
    }
    
    view(choice) {
        push();
        imageMode(CENTER);
        if (choice == 'red') {
            image(redVirus, this.x, this.y, this.size, this.size);
        } else if (choice == 'yellow') {
            image(yellowVirus, this.x, this.y, this.size, this.size);
        } else if (choice == 'orange') {
            image(orangeVirus, this.x, this.y, this.size, this.size);
        } else if (choice == 'blue') {
            image(blueVirus, this.x, this.y, this.size, this.size);
        }
        pop();
    }
    move() {
        this.x += this.xSpeed;
        this.y += this.ySpeed;
        
        this.x = constrain(this.x, 0+this.size/2, width-this.size/2);
        this.y = constrain(this.y, 0+this.size/2, height-this.size/2);
        
        if (this.x + this.size/2 >= width || this.x - this.size/2 <= 0) {
            this.xSpeed *= -1;      
        } 
  
        if (this.y + this.size/2 >= height || this.y - this.size/2 <= 0) {
            this.ySpeed *= -1;
        } 
    }
}


function knowledge() {
    background('#f8f8eb');

    fill(0);
    textAlign(CENTER);
    textSize(36);
    text('What you should know before starting the game...', width/2, height/2);
    textSize(24);
    text('say BACK to go back to the menu', width/2, height-200);
}


function instruction() {
    background('#f8f8eb');

    fill(0);
    textAlign(CENTER);
    textSize(48);
    text('How to play this game?', width/2, height/2);
    textSize(24);
    text('say BACK to go back to the menu', width/2, height-200);
}


function inGame() {
    background('#f8f8eb');
    if (faceReady) {
        push();
        scale(1.5);
        drawSkeleton();

        for (let i=0; i<virus.length; i++) {
            virus[i].view();

            virus[i].collideFace();
            virus[i].reset();
    //        print('x', virus[i].x);
    //        print('y', virus[i].y)

            fill('#2482A4');
            textAlign(LEFT);
            textFont('Ubuntu Mono', 25);
            text('Score: ' + score, 20, 50);
            text('Lives Left: ' + lives, 20, 100);
        }
        pop();

        if (lives <= 0) {
            gameState = 'over';
        }
    }
    
}


function modelLoaded() {
    console.log('facemesh ready');
    faceReady = true;
    
}


function drawSkeleton() {
    image(video, 0, 0);

    for (let i = 0; i < predictions.length; i += 1) {
        const keypoints = predictions[i].scaledMesh;

        for (let j = 0; j < borderline.length; j++) {
            let [x1, y1] = keypoints[borderline[j]];
            
            if (j<borderline.length - 1) {
                let [x2, y2] = keypoints[borderline[j+1]];
            }
      
            fill(0, 255, 0);
            ellipse(x1, y1, 3, 3);
            stroke(0);
            strokeWeight(1);
      
            if (j < borderline.length-1) {
                line(x1, y1, keypoints[borderline[j+1]][0], keypoints[borderline[j+1]][1]);
                line(keypoints[borderline[borderline.length-1]][0], keypoints[borderline[borderline.length-1]][1], keypoints[borderline[0]][0], keypoints[borderline[0]][1]);
            }
        }
    }
}


function sickScene() {
    background('#f8f8eb');
  
    fill(0);
    textAlign(CENTER);
    textSize(48);
    text('You got sick', width/2, height/2);
}


class FallingVirus {
    constructor() {
        this.x = random(0, 640);
        this.y = 0;
        this.size = random(15,30);
        this.color = color(0);
        this.speed = random(2, 5);
        this.hit = false; 
        this.in = false;
        this.type = round(random(0, 3));
    }
  
    
    view() {
        if (this.type === 0) {
            image(yellowVirus, this.x, this.y, this.size, this.size);
        } else if (this.type === 1) {
            image(blueVirus, this.x, this.y, this.size, this.size);
        } else if (this.type === 2) {
            image(redVirus, this.x, this.y, this.size, this.size);
        } else if (this.type === 3) {
            image(orangeVirus, this.x, this.y, this.size, this.size);
        }
        
        print(this.type)

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
            if (myChoice[i] === "exit") {
                exiting = true;
            }
            if (myChoice[i] === "tips" && exiting) {  
                gameState = 'tips';
            } else if (myChoice[i] == "start"  && exiting) {
                gameState = 'inGame';
            } else if (myChoice[i] === "instruction"  && exiting) {
                gameState = 'instruction';
            }
        } 
        if (gameState === 'tips' || gameState === 'instruction') {
            if (myChoice[i] === "back") {
                gameState = 'start';
            }
        }
    }
} 