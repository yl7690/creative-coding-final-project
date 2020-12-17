//for visual setting;
let video;
let face;
let predictions = [];
let borderline = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];
let poly = [];
let faceReady = false;
let yellowVirus, redVirus, blueVirus, orangeVirus
let boundingRed, boundingBlue, boundingOrange, boundingYellow;
let colors = {
    bg: '#f8f8eb',
    red: '#b94228',
    yellow: '#f7ba4d',
    blue: '#2482a4',
    pink: '#e85d60',
    darkBlue: '#3b5a9d',
    green: '#229a90'
}
let tipsPage, insPage;
let shop, street, shopBG, path, sick, board1, board2, board3, pausePage, mic, cam, tipsIcon, playIcon, insIcon, pauseIcon, continueIcon, backIcon, state1, state2, state3, micOn, micOff;
let beginSec = 0;
let nowTime = 0;
let loading = true;


//for sound setting;
let rec, myChoice, bgMusic, boop, gameOver, yay;
let speaking = false;

//Intro
let intro;
let exiting = false;

//for game state;
let virus = [];
let lastTrigger = 0;
let score = 0;
let lives = 19;
let gameState = 'start';
let options;
let shopTimer, sickTimer;
let pause = false;



function preload() {
    yellowVirus = loadImage('virus/yellowVirus.png');
    blueVirus = loadImage('virus/blueVirus.png');
    redVirus = loadImage('virus/redVirus.png');
    orangeVirus = loadImage('virus/orangeVirus.png');
    shopBG = loadImage('pics/shop.png');
    street = loadImage('pics/street.png');
    path = loadImage('pics/choiceMap.png');
    board1 = loadImage('pics/board1.png');
    board2 = loadImage('pics/board2.png');
    board3 = loadImage('pics/board3.png');
    mic = loadImage('pics/micSign.png');
    cam = loadImage('pics/camSign.png');
    tipsIcon = loadImage('pics/tips.png');
    insIcon = loadImage('pics/instruction.png');
    playIcon = loadImage('pics/start.png');
    backIcon = loadImage('pics/back.png');
    continueIcon = loadImage('pics/continue.png');
    pauseIcon = loadImage('pics/pause.png');
    state1 = loadImage('pics/state1.png');
    state2 = loadImage('pics/state2.png');
    state3 = loadImage('pics/state3.png');
    micOn = loadImage('pics/micOn.png');
    micOff = loadImage('pics/micOff.png');
    
    
    bgMusic = loadSound('sound/backgroundmusic.mp3');
    boop = loadSound('sound/boop.mp3');
    gameOver = loadSound('sound/gameOver.mp3');
    yay = loadSound('sound/yay.mp3');
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
    rec.onEnd = restart;
//    rec.onResult = words();

    intro = new Intro();
    tipsPage = new TipsPage();
    insPage = new Instruction();
    
    shop = new Shop();
    shopTimer = new Timer();
    
    sick = new Sick();
    sickTimer = new Timer();
    
    pausePage = new PausePage();
    
    boundingRed = new BoundingVirus();
    boundingYellow = new BoundingVirus();
    boundingOrange = new BoundingVirus();
    boundingBlue = new BoundingVirus();
    
    
    for (let i=0; i<10; i++) {
        virus[i] = new FallingVirus();
    }
    
//    playSound();
}


function restart() {
    rec.start();
}


function draw() {

//    print(shop.hit)

//    print(gameState);
//    print(exiting);
//    print(virus.length);
    
    if (gameState === 'start') {
        startMenu();
    }
    if (gameState === 'inGame' && !pause) {
        inGame();
    }
    if (gameState === 'tips') {
        knowledge();
    }
    if (gameState === 'instruction') {
        instruction();
    }
    if (gameState === 'inGame') {
        if (pause) {
            pausePage.view();
        }
        if (lives <= 0) {
            gameState = 'sick';
        }
        
        if (score > 60) {
            gameState = 'challenge';
        }
    }

    if (gameState === 'challenge') {
        socialDistancing(); 
    }
    
    if (gameState === 'sick') {
        sickScene();
    }
    
    if (gameState === 'winLose') {
        endMenu();
    }
    
    if (gameState === 'winWin') {
        winMenu();
    }
    
    if (gameState === 'loseMildWin') {
        mildWMenu();
    } 
    
    if (gameState === 'loseMildLose') {
        mildLMenu();
    }
    
    if (gameState === 'loseSevereLose') {
        seriousLMenu();
    }
    
    if (gameState === 'loseSevereWin') {
        seriousWMenu();
    }
//    print('score', score);
//    print('lives', lives);

    if (loading) {
        drawLoading();
    } 
    
    if (speaking) {
        image(micOn, 10, height - 70, 60, 60);
    } else if (!speaking) {
        image(micOff, 10, height - 70, 60, 60);
    }
    
//    playSound();
}


function drawLoading() {
    background(colors.bg);

  
    textAlign(CENTER);
    noStroke();
    fill(0);
    textFont('Ubuntu Mono', 60);
    text('Loading', width * 0.45, height * 0.31);

    let nowTime = floor(millis()/1000);
    print(nowTime);

    
    if (nowTime > 4) {
        textSize(30);
        textAlign(CENTER);
        text('Make sure you give access to your microphone and camera before starting the game!', width * 0.5, height * 0.85, width*0.75, height*0.3);
        push();
        imageMode(CENTER);
        image(mic, width/3, height* 0.6, mic.width*0.15, mic.height*0.15);
        image(cam, width/3*2, height* 0.6, cam.width*0.18, cam.height*0.22)
        pop();
    }

    fill(0);
    
    if (millis() - beginSec > 0 && millis() - beginSec <1000 ) {
        noStroke();
        circle(width * 0.58, height * 0.3, 10);
    }
    
    if (millis() - beginSec >= 1000 && millis() - beginSec <2000){
        noStroke();
        circle(width * 0.58, height * 0.3, 10);
        circle(width * 0.62, height * 0.3, 10);
        circle(width * 0.66, height * 0.3, 10);
    }
    
    if (millis() - beginSec >= 2000 && millis() - beginSec <3000){
        noStroke();
        circle(width * 0.58, height * 0.3, 10);
        circle(width * 0.62, height * 0.3, 10);
        circle(width * 0.66, height * 0.3, 10);
    }
    
    if (millis() - beginSec > 3000) {
        beginSec = millis();
    }
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
    text('DodgeVirus', width/2, height/3);
    textFont('Ubuntu Mono', 22);
    text('Instruction', 200, height * 0.8);
    text('Play', width/2, height * 0.8);
    text('Tips', width-200, height * 0.8);
    
    push();
    imageMode(CENTER);
    image(insIcon, 200, height * 0.715, 70, 70); 
    image(playIcon, width/2, height * 0.715, 70, 70);
    image(tipsIcon, width - 200, height * 0.715, 60, 70);
    pop();
    
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
        image(tipsIcon, this.x - 25, this.y - 50, 50, 70);
        
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
        fill(0);
        text('Tips', this.x, this.y+40);
        fill('#0260ae');
        text('Now say EXIT to continue', this.x, this.y+155);
    }
    
    exit() {
        this.x -= 10;
        
//        print(this.x);
        
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
    background(colors.bg);

    fill(0);
    textAlign(CENTER);
    textFont('Bungee', 36);
    text('Things to Know', width/2 - 100, 50);
    text('Before Game Starts', width/2 + 100, 100);
    textSize(20);
    image(backIcon, 15, 10, 50, 50);
    text('BACK', 43, 85);
    
    tipsPage.view();

    
//    print(gameState);
    
}


class TipsPage {
    constructor() {
        this.alpha = 150;
        this.x = 100;
        this.y = 140;
        this.triY1 = 395;
        this.triY2 = 370;
        this.triY3 = 420;
        this.triXL = 60;
        this.triXR = width - 60;
        this.page = 1;
        this.x2 = this.x + width;
        this.x3 = this.x + width*2;
        this.height = 265;
        this.width = 380;
    }
    
    view() {
        rectMode(CORNER);
        noStroke();
    

        let timePassed = floor(millis()/500);
    
        if (timePassed % 2 === 0) {
            this.triXL = 55;
            this.triXR = width - 55;
        } else if (timePassed % 2 === 1) {
            this.triXL = 60            
            this.triXR = width - 60;
        }
        
            
        if (this.page === 1) {
            triangle(this.triXR, this.triY2, this.triXR, this.triY3, this.triXR + 35, this.triY1);
            
            fill(36, 130, 164, this.alpha);
            rect(this.x, this.y, this.width, this.height);

            fill(185, 66, 40, this.alpha);
            rect(this.x, this.y + this.height, this.width, this.height);

            fill(247, 186, 77, this.alpha);
            rect(this.x + this.width, this.y, this.width, this.height);

            fill(232, 93, 96, this.alpha);
            rect(this.x + this.width, this.y + this.height, this.width, this.height);
            
            textFont('Ubuntu Mono', 16);
            fill(0);
            textAlign(LEFT);
            text('The virus that causes COVID-19 most commonly spreads between people who are in close contact with one another (within about 6 feet, or 2 arm lengths).', 130, 225, 330, 450);
            text('Avoid touching your eyes, nose, and mouth with unwashed hands.', 510, 225, 330, 450);
            text('Wash your hands often with soap and water for at least 20 seconds especially after you have been in a public place, or after blowing your nose, coughing, or sneezing. If soap and water are not readily available, use a hand sanitizer that contains at least 60% alcohol. ', 130, 225 + this.height, 330, 450);
            text('Always cover your mouth and nose with a tissue when you cough or sneeze or use the inside of your elbow and do not spit. Throw used tissues in the trash.', 510, 225 +this.height, 330, 450);
            text('next', this.triXR, this.triY3+ 20);
            
        } else if (this.page === 2) {
            triangle(this.triXL, this.triY2, this.triXL, this.triY3, this.triXL - 35, this.triY1);
            triangle(this.triXR, this.triY2, this.triXR, this.triY3, this.triXR + 35, this.triY1);
            
            fill(36, 130, 164, this.alpha);
            rect(this.x, this.y, this.width, this.height);

            fill(185, 66, 40, this.alpha);
            rect(this.x, this.y + this.height, this.width, this.height);

            fill(247, 186, 77, this.alpha);
            rect(this.x + this.width, this.y, this.width, this.height);

            fill(232, 93, 96, this.alpha);
            rect(this.x + this.width, this.y + this.height, this.width, this.height);
            
        
            textFont('Ubuntu Mono', 16);
            fill(0);
            textAlign(LEFT);
            text('Be alert for symptoms. Watch for fever, cough, shortness of breath, or other symptoms of COVID-19.', 130, 225, 330, 450);
            text('Stay home when you are sick, except to get medical care. Use a separate room and bathroom for sick household members (if possible).', 510, 225, 330, 450);
            text('If you need emergency help, call 911,  or if someone is showing any of these signs, seek emergency medical care immediately: Trouble breathing, Persistent pain or pressure in the chest, New confusion, Inability to wake or stay awake, and Bluish lips or face.', 130, 225 +this.height, 330, 450);
            text('Most pets that have gotten sick from the virus that causes COVID-19 were infected after close contact with a person with COVID-19. Talk to your veterinarian about any health concerns you have about your pets.', 510, 225 + this.height, 330, 450);
            text('next', this.triXR, this.triY3+ 20);
            text('previous', this.triXL - 35, this.triY3+ 20);
        } else if (this.page === 3) {
            triangle(this.triXL, this.triY2, this.triXL, this.triY3, this.triXL - 35, this.triY1);
            
            text('go get a flu vaccine!', width/2, height/2);
            textFont('Ubuntu Mono', 16);
            fill(0);
            textAlign(LEFT);
            text('Getting a flu vaccine during 2020-2021 is more important than ever. While getting a flu vaccine will not protect against COVID-19, Flu vaccines have been shown to reduce the risk of flu illness, hospitalization, and death.', 290, 405, this.width, this.height);
            text('previous', this.triXL - 35, this.triY3+ 20);
        }
    }
}


function instruction() {
    background(colors.bg);
    push();

    fill(0);
    textAlign(CENTER);
    textFont('Bungee', 48);
    text('How to Play', width/2, 100);
    textSize(20);
    image(backIcon, 15, 10, 50, 50);
    text('BACK', 43, 85);

    insPage.view();
    pop();
}


class Instruction {
    constructor() {
        this.triY1 = 395;
        this.triY2 = 370;
        this.triY3 = 420;
        this.triXL = 60;
        this.triXR = width - 60;
        this.page = 1;
    }
    
    view() {
        rectMode(CORNER);
        noStroke();
    

        let timePassed = floor(millis()/500);
    
        if (timePassed % 2 === 0) {
            this.triXL = 55;
            this.triXR = width - 55;
        } else if (timePassed % 2 === 1) {
            this.triXL = 60            
            this.triXR = width - 60;
        }
        
        textFont('Ubuntu Mono', 16);
        textAlign(LEFT);
        if (this.page === 1) {
            triangle(this.triXR, this.triY2, this.triXR, this.triY3, this.triXR + 35, this.triY1);
            text('next', this.triXR, this.triY3+ 20);
            

            textFont('Ubuntu Mono', 16);
            fill(0);
            textAlign(LEFT);
            text('This game is about motion and your knowledge about COVID-19. If you don’t feel confident, reading the tips page is strongly recommended.', 240, 260, width/2, height*0.2);
            text('Make sure you give access to your microphone and camera. Make sure your surrounding is quite enough. This game is controlled by voice and motion. NO KEYBOARD OR MOUSE INTERACTION. When choosing between different pages or game states, read the name of the chosen page. (ex.: BACK, TIPS PAGE, START PLAYING, CONTINUE, etc)', 240, 530, width/2, height/3);
            
            push();
            imageMode(CENTER);
            image(mic, width/3 + 50, height* 0.6, mic.width*0.15, mic.height*0.15);
            image(cam, width/3*2 - 50, height* 0.6, cam.width*0.18, cam.height*0.22)
            pop();
            
        } else if (this.page === 2) {
            triangle(this.triXL, this.triY2, this.triXL, this.triY3, this.triXL - 35, this.triY1);
            triangle(this.triXR, this.triY2, this.triXR, this.triY3, this.triXR + 35, this.triY1);
            text('next', this.triXR, this.triY3+ 20);
            text('previous', this.triXL - 35, this.triY3+ 20);
            
            push();
            imageMode(CENTER);
            image(state1, width/2, height/2 - 50, state1.width*0.3, state1.height*0.3);
            text('When in this game state, you use your face to control the position of the character. Your goal is to dodge the viruses until the progress bar gets full or you have no lives left. Notice that the size of the figure gets bigger when you are closer to the screen.', 245, 530, width/2, height/3);
            
            pop();

        } else if (this.page === 3) {
            triangle(this.triXL, this.triY2, this.triXL, this.triY3, this.triXL - 35, this.triY1);
            triangle(this.triXR, this.triY2, this.triXR, this.triY3, this.triXR + 35, this.triY1);
            text('next', this.triXR, this.triY3+ 20);
            text('previous', this.triXL - 35, this.triY3+ 20);
            
            push();
            imageMode(CENTER);
            image(state2, width/2, height/2 - 50, state1.width*0.3, state1.height*0.3);
            text('Here in this scene, as you can see, demonstrate your social distancing skills! Be as precise as possible! The position is still controlled by your motion.', 245, 530, width/2, height/3);
            
            pop();

        }else if (this.page === 4) {
            triangle(this.triXL, this.triY2, this.triXL, this.triY3, this.triXL - 35, this.triY1);
            text('previous', this.triXL - 35, this.triY3+ 20);
            
            push();
            imageMode(CENTER);
            image(state3, width/2, height/2 - 50, state1.width*0.3, state1.height*0.3);
            text('Do you know about the symptoms of COVID-19? Depending on your symptoms, decide whether to go to the hospital or go home! This scene is still motion-controlled.', 245, 530, width/2, height/3);
            
            pop();

        }
    }
}


function inGame() {
    background(colors.bg);
//    playSound();
    bgMusic.stop();
    
    let newVirus = new FallingVirus();
    if (millis() - lastTrigger >= 2000) {
        virus.push(newVirus);
        lastTrigger = millis();
    }
    
    if (faceReady) {
        image(street, 0, 0);
        
        drawSkeleton();

        for (let i=0; i<virus.length; i++) {
            virus[i].view();
            virus[i].fall();

            virus[i].collideFace();
            virus[i].reset();
    //        print('x', virus[i].x);
    //        print('y', virus[i].y)
        }
        
        noStroke();
        fill('#2482A4');
        textAlign(LEFT);
        textFont('Ubuntu Mono', 24);
        text('progress', 123.5, 70);
        text('Lives Left', width - 145, 70);
        
        rectMode(CORNER);
        fill(colors.bg);
        rect(123.5, 21.5, 293, 23);
        fill(colors.green);
        rect(123.5, 21.5, score/60*293, 23);
        rect(width - 216.5, 21.5, 193, 23, 40);
        fill(colors.bg);
        rect(width - 216.5, 21.5, (19 - lives)/19*200, 23);
        stroke(colors.darkBlue);
        noFill();
        strokeWeight(7);
        rect(120, 18, 300, 30, 40);
        rect(width - 220, 18, 200, 30, 40);
//        print(lives);
        
        image(pauseIcon, 25, 10, 60, 60);
        fill(0);
        noStroke();
        text('Pause', 27, 90);
    }
    
}


class PausePage {
    constructor() {
        this.x = width/2;
        this.y = height/2;
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
        
        textAlign(CENTER);
        fill(0);
        noStroke();
        textFont('Ubuntu Mono', 28);
        push();
        imageMode(CENTER);
        image(continueIcon, this.x, this.y, 60, 60);
        pop();
        text('The game is paused.', this.x, this.y - 70);
        text('Say CONTINUE to continue', this.x, this.y + 70);
    }
}


function socialDistancing() {
    background(colors.bg);
    
    shop.bgView();
    shop.character();
    
//    if (!shop.in) {
        if (shop.hit) {
            gameState = 'winWin';
            shop.in = true;
            winSound();
//        }
    } else if (shop.lose) {
        gameState = 'winLose';
    }
}


class Timer {
    constructor() {
        this.start = false;
        this.time = 0;
        
    }
    count(ms) {
        if(this.start == false) {
            this.time = millis()
            this.start = true;
        }
        else {
            if(millis() - this.time > ms) {
                return true;
            }
            else {
                return false;
            }
        }  
    }
}


class Shop {
    constructor() {
        this.bgx = 960;
        this.bgy = 0;
        this.bgw = 960;
        this.bgh = 720;
        this.state = 1;
        this.characterX = 0;
        this.characterY = 490;
        this.dotSize = 38;
        this.dotY = 444;
        this.hit = false;
        this.tryAgain = false;
        this.checked = false;
        this.lose = false;
    }
    
    bgView() {
        image(shopBG, 0, 0, width, height, this.bgx, this.bgy, this.bgw, this.bgh);
        
        textFont('Ubuntu Mono', 20);
//        print(this.hit)
        noStroke();
        fill(0);
        if (this.state === 1) {
            if (shopTimer.count(1000)) {
                text('You have reached your destination, the grocery shop.', 50, 50);
            } 
            
            if (shopTimer.count(4000)) {
                text('There seems to be a long line. Get in there right now!', 50, 100);
            } 
            
            if (shopTimer.count(7000)) {
                text('Say CONTINUE to get to the end of the line', 50, 150)
            }
        }
        
        if (this.state === 2) {
            if (this.bgx > 0) {
                this.bgx-=10;
            } 
        }
    }
    
    character() {
        if (this.bgx === 0) {
//            strokeWeight(4);
//            stroke(0);
//            point(467, this.dotY);
            for (let i = 0; i < predictions.length; i += 1) {
                const keypoints = predictions[i].scaledMesh;
                
                if (predictions[i].faceInViewConfidence > 0.9) {
                    fill(colors.red);
                    noStroke();
                    print(this.characterX);

                    let fakeX = map(keypoints[4][0], 0, 640, 340, 920);

    //                this.characterX = map(keypoints[4][0], 0, 640, 0, 400);
                    this.characterX = width - fakeX;
    //                    print(this.characterX);
                    ellipse(this.characterX, this.characterY, 60, 100);
    //                    print(keypoints[4][0]);
                }

                textFont('Ubuntu Mono', 24);
                fill(0);

                if (this.characterX > 470) {
                    text('Warning! Warning! You are getting to close!!',50, 50)
                }
                 if (this.tryAgain) {
                    text('A 6-feet distance is enough.', 50, 100);
                    text('Please leave some spaca for other people.', 50, 150);
                    text('Try again!', 50, 200);
                 }

                if (!this.checked) {
                    text('Say CHECK to check your position.', 50, 100);
                }
            }
        }
    }
    
    collide() {
        this.checked = true;
        this.hit = collidePointEllipse(467, this.dotY, this.characterX, this.characterY, 60, 100);
        
        print('collide working');
        
        if (!this.hit && this.characterX < 467) {
            this.tryAgain = true;
        }
        
        if (!this.hit && this.characterX > 467) {
            this.lose = true;
            gameOverSound();
        }
    }
    
    reset() {
        this.bgx = 960;
        this.bgy = 0;
        this.bgw = 960;
        this.bgh = 720;
        this.state = 1;
        this.characterX = 0;
        this.characterY = 490;
        this.dotSize = 38;
        this.dotY = 444;
        this.hit = false;
        this.tryAgain = false;
        this.checked = false;
        this.lose = false;
    }
}


function modelLoaded() {
    console.log('facemesh ready');
    faceReady = true;
    loading = false;
}


function pX(x) {
    return width - map(x, 0, 640, 0, 960);
}


function pY(y) {
    return map(y, 0, 480, 0, 720);
}


function drawSkeleton() {
//    image(video, 0, 0);

    for (let i = 0; i < predictions.length; i += 1) {
        const keypoints = predictions[i].scaledMesh;

        for (let j = 0; j < borderline.length; j++) {
            
            fill(colors.red);
            noStroke();
            
            beginShape();
            curveVertex(pX(keypoints[borderline[0]][0]), pY(keypoints[borderline[0]][1])); 
            curveVertex(pX(keypoints[borderline[1]][0]), pY(keypoints[borderline[1]][1])); 
            curveVertex(pX(keypoints[borderline[2]][0]), pY(keypoints[borderline[2]][1])); 
            curveVertex(pX(keypoints[borderline[3]][0]), pY(keypoints[borderline[3]][1])); 
            curveVertex(pX(keypoints[borderline[4]][0]), pY(keypoints[borderline[4]][1])); 
            curveVertex(pX(keypoints[borderline[5]][0]), pY(keypoints[borderline[5]][1])); 
            curveVertex(pX(keypoints[borderline[6]][0]), pY(keypoints[borderline[6]][1])); 
            curveVertex(pX(keypoints[borderline[7]][0]), pY(keypoints[borderline[7]][1])); 
            curveVertex(pX(keypoints[borderline[8]][0]), pY(keypoints[borderline[8]][1])); 
            curveVertex(pX(keypoints[borderline[9]][0]), pY(keypoints[borderline[9]][1])); 
            curveVertex(pX(keypoints[borderline[10]][0]), pY(keypoints[borderline[10]][1])); 
            curveVertex(pX(keypoints[borderline[11]][0]), pY(keypoints[borderline[11]][1])); 
            curveVertex(pX(keypoints[borderline[12]][0]), pY(keypoints[borderline[12]][1])); 
            curveVertex(pX(keypoints[borderline[13]][0]), pY(keypoints[borderline[13]][1])); 
            curveVertex(pX(keypoints[borderline[14]][0]), pY(keypoints[borderline[14]][1])); 
            curveVertex(pX(keypoints[borderline[15]][0]), pY(keypoints[borderline[15]][1])); 
            curveVertex(pX(keypoints[borderline[16]][0]), pY(keypoints[borderline[16]][1])); 
            curveVertex(pX(keypoints[borderline[17]][0]), pY(keypoints[borderline[17]][1])); 
            curveVertex(pX(keypoints[borderline[18]][0]), pY(keypoints[borderline[18]][1])); 
            curveVertex(pX(keypoints[borderline[19]][0]), pY(keypoints[borderline[19]][1])); 
            curveVertex(pX(keypoints[borderline[20]][0]), pY(keypoints[borderline[20]][1])); 
            curveVertex(pX(keypoints[borderline[21]][0]), pY(keypoints[borderline[21]][1])); 
            curveVertex(pX(keypoints[borderline[22]][0]), pY(keypoints[borderline[22]][1])); 
            curveVertex(pX(keypoints[borderline[23]][0]), pY(keypoints[borderline[23]][1])); 
            curveVertex(pX(keypoints[borderline[24]][0]), pY(keypoints[borderline[24]][1])); 
            curveVertex(pX(keypoints[borderline[25]][0]), pY(keypoints[borderline[25]][1])); 
            curveVertex(pX(keypoints[borderline[26]][0]), pY(keypoints[borderline[26]][1])); 
            curveVertex(pX(keypoints[borderline[27]][0]), pY(keypoints[borderline[27]][1])); 
            curveVertex(pX(keypoints[borderline[28]][0]), pY(keypoints[borderline[28]][1])); 
            curveVertex(pX(keypoints[borderline[29]][0]), pY(keypoints[borderline[29]][1])); 
            curveVertex(pX(keypoints[borderline[30]][0]), pY(keypoints[borderline[30]][1])); 
            curveVertex(pX(keypoints[borderline[31]][0]), pY(keypoints[borderline[31]][1])); 
            curveVertex(pX(keypoints[borderline[32]][0]), pY(keypoints[borderline[32]][1])); 
            curveVertex(pX(keypoints[borderline[33]][0]), pY(keypoints[borderline[33]][1])); 
            curveVertex(pX(keypoints[borderline[34]][0]), pY(keypoints[borderline[34]][1])); 
            curveVertex(pX(keypoints[borderline[35]][0]), pY(keypoints[borderline[35]][1])); 
        
            endShape(CLOSE);
            
            
            fill(255);
            let eyeWidthL = dist(pX(keypoints[130][0]), pY(keypoints[130][1]), pX(keypoints[133][0]), pY(keypoints[133][1]));
            let eyeWidthR = dist(pX(keypoints[362][0]), pY(keypoints[362][1]), pX(keypoints[359][0]), pY(keypoints[359][1]));
            ellipse(pX(keypoints[28][0]), pY(keypoints[28][1]), eyeWidthL, eyeWidthL);
            ellipse(pX(keypoints[258][0]), pY(keypoints[258][1]), eyeWidthR, eyeWidthR);
            
            fill(0);
            ellipse(pX(keypoints[56][0]), pY(keypoints[56][1]), eyeWidthL*0.3, eyeWidthL*0.3);
            ellipse(pX(keypoints[286][0]), pY(keypoints[286][1]), eyeWidthR*0.3, eyeWidthR*0.3);
            
            strokeWeight(10);
            stroke(colors.red);
            line(pX(keypoints[140][0]), pY(keypoints[140][1]), pX(keypoints[140][0]), pY(keypoints[140][1] + 30));
            line(pX(keypoints[378][0]), pY(keypoints[378][1]), pX(keypoints[378][0]), pY(keypoints[378][1] + 30));
            line(pX(keypoints[93][0]), pY(keypoints[93][1]), pX(keypoints[93][0] - 20), pY(keypoints[93][1] + 20));
            line(pX(keypoints[323][0]), pY(keypoints[323][1]), pX(keypoints[323][0] + 20), pY(keypoints[323][1] + 20));

            if (predictions[i].faceInViewConfidence < 0.9) {
                pause = true;
            }
        
      
//            if (j < borderline.length-1) {
//                line(x1, y1, keypoints[borderline[j+1]][0], keypoints[borderline[j+1]][1]);
//                line(keypoints[borderline[borderline.length-1]][0], keypoints[borderline[borderline.length-1]][1], keypoints[borderline[0]][0], keypoints[borderline[0]][1]);
//            }
        }
    }
}


function sickScene() {
    background(colors.bg);
  
    sick.transit();
    
    if (sick.continue) {
        sick.bgView();
        sick.symptoms();
    }
    
    
    if (sick.scalingPic){
        sick.character(); 
        sick.collide();
    }
}


class Sick {
    constructor() {
        this.bgx = 0;
        this.bgy = 0;
        this.bgw = 960;
        this.bgh = 720;
        this.characterX = 0;
        this.characterY = 300;
        this.hitHome = false;
        this.hitHospital = false;
        this.type = floor(random(3));
        this.pictureW = 648.75;
        this.pictureH = 720;
        this.pictureX = width/2;
        this.pictureY = height + this.pictureH/2;
        this.continue = false;
        this.scalingPic = false;
    }
    
    transit() {
        fill(0);
        textAlign(CENTER);
        textFont('Ubuntu Mono', 30);
        noStroke();
        
        if (sickTimer.count(1000)) {
            text('OH NO! You got sick!', width*0.15, height/2 - 150, width*0.7, 50);
        } 

        if (sickTimer.count(4000)) {
            text('Here is a list of your symptoms.', width*0.15, height/2 - 100, width*0.7, 50);
        } 

        if (sickTimer.count(7000)) {
            text('Depending on your symptoms, decide whether you want to go home or to the hospital!', width*0.15, height/2 - 50, width*0.7, 100);
        }
        
        if (sickTimer.count(9000)) {
            text('Say CONTINUE to continue', width*0.15, height - 100, width*0.7, 50);
        }
    }
    
    bgView() {
        image(path, 0, 0, width, height, this.bgx, this.bgy, this.bgw, this.bgh);
    }
    
    symptoms() {
        push();
        imageMode(CENTER);
        
        print('y', this.pictureY);
        print('H', this.pictureH)

        if (this.type === 0) {
            image(board1, this.pictureX, this.pictureY, this.pictureW, this.pictureH);
        } else if (this.type === 1) {
            image(board2, this.pictureX, this.pictureY, this.pictureW, this.pictureH);
        } else if (this.type === 2) {
            image(board3, this.pictureX, this.pictureY, this.pictureW, this.pictureH);
        }

        
        if (this.continue && !this.scalingPic) {
            if (this.pictureY > this.pictureH/2) {
                this.pictureY-=10;
            }
        }
        
        if (this.pictureY === 360 && this.pictureH === 720) {
            fill(0);
            textAlign(CENTER);
            textFont('Ubuntu Mono', 30);
            noStroke();
            text('Say CONTINUE to continue', width*0.15, height - 50, width*0.7, 50);
        }

        if (this.scalingPic && this.pictureW > 350){
            this.pictureW -= 69.2;
            this.pictureH -= 76.8;
        }
        
        if (this.pictureW < 310 && this.pictureY > this.pictureH/2 + 10) {
            this.pictureY -= 10;
        }
        pop();
    }
    
    character() {
            strokeWeight(4);
            stroke(0);
        
//        print('x', this.characterX);
//        print('y', this.characterY);

            for (let i = 0; i < predictions.length; i += 1) {
    
                if (predictions[i].faceInViewConfidence > 0.9) {
                    const keypoints = predictions[i].scaledMesh;
                    fill(colors.red);
                    noStroke();

                    this.characterX = width - map(keypoints[4][0], 0, 640, 190, 780);
                
                    if (this.characterX < 480) {
                        this.characterY = 0.55 * this.characterX + 216;
                    } else if (this.characterX > 480) {
                        this.characterY = -0.63 * this.characterX + 782;
                    } else if (this.characterX = 480) {
                        this.characterY = 480;
                    }
                    ellipse(this.characterX, this.characterY, 60, 100);
                }
            }            
    }
    
    collide() {
        this.hitHome = collidePointEllipse(174, 279, this.characterX, this.characterY, 60, 100);
        
        this.hitHospital = collidePointEllipse(750, 306, this.characterX, this.characterY, 60, 100);
        
        if (this.hitHome) {
            if (this.type === 0) {
                gameState = 'loseMildWin';
                winSound();
            } else if (this.type === 1 || this.type === 2) {
                gameState = 'loseSevereLose';
                gameOverSound();
            }
        } else if (this.hitHospital) {
            if (this.type === 0) {
                gameState = 'loseMildLose';
                gameOverSound();
            } else if (this.type === 1 || this.type === 2) {
                gameState = 'loseSevereWin';
                winSound();
            }
        }
        
    }
    
    reset() {
        this.bgx = 0;
        this.bgy = 0;
        this.bgw = 960;
        this.bgh = 720;
        this.characterX = 0;
        this.characterY = 300;
        this.hitHome = false;
        this.hitHospital = false;
        this.type = floor(random(3));
        this.pictureW = 648.75;
        this.pictureH = 720;
        this.pictureX = width/2;
        this.pictureY = height + this.pictureH/2;
        this.continue = false;
        this.scalingPic = false;
    }
}


function seriousWMenu() {
    background(colors.bg);
    image(street, 0, 0);
  
    fill(0);
    textAlign(CENTER);
    textFont('Ubuntu Mono', 48);
    noStroke();
    text('It looks like you got the right treatment and recovered pretty fast!', width*0.15, height/4, width*0.7, height/2);
    textSize(24);
    text('say RESTART to restart game', width/2, height-200);
}


function seriousLMenu() {
    background(colors.bg);
    image(street, 0, 0);
  
    fill(0);
    textAlign(CENTER);
    textFont('Ubuntu Mono', 48);
    noStroke();
    text('You went to the wrong place and failed to get the proper treatment in time.', width*0.15, height/4 - 20, width*0.7, height/2);
    text('R. I. P.', width* 0.15, height/2 + 30, width*0.7, height/3);
    textSize(24);
    text('say RESTART to restart game', width/2, height-160);
}


function mildWMenu() {
    background(colors.bg);
    image(street, 0, 0);
  
    fill(0);
    textAlign(CENTER);
    textFont('Ubuntu Mono', 48);
    noStroke();
    text('Great! You recovered well at home!', width*0.15, height/2 - 100, width*0.7, height/2);
    textSize(24);
    text('say RESTART to restart game', width/2, height-160);
}


function mildLMenu() {
    background(colors.bg);
    image(street, 0, 0);
  
    fill(0);
    textAlign(CENTER);
    textFont('Ubuntu Mono', 48);
    noStroke();
    text('You went to the wrong place and wasted a chance for a severe patient to get the treatment in time...', width*0.15, height/4, width*0.7, height/2);
    textSize(24);
    text('say RESTART to restart game', width/2, height-160);
}


function endMenu() {
    background(colors.bg);
    image(street, 0, 0);
  
    fill(0);
    textAlign(CENTER);
    textFont('Ubuntu Mono', 48);
    noStroke();
    text('It seems like you are not yet prepared to fight against the virus.', width*0.15, height/4, width* 0.7, height/2);
    textSize(24);
    text('say RESTART to restart game', width/2, height-200);
}


function winMenu() {
    background(colors.bg);
    image(street, 0, 0);
  
    fill(0);
    textAlign(CENTER);
    textFont('Ubuntu Mono', 48);
    noStroke();
    text('Wow! You are really a precise COVID-19 fighter!', width*0.15, height/4, width*0.7, height/2);
    textSize(24);
    text('say RESTART to restart game', width/2, height-200);
}


class FallingVirus {
    constructor() {
        this.x = random(0, 960);
        this.y = 0;
        this.size = random(25, 30);
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
    }
        
    
    fall() {
        this.y += this.speed;
    }


    collideFace() {
        for (let i = 0; i < predictions.length; i += 1) {
            const keypoints = predictions[i].scaledMesh;

            for (let j = 0; j < borderline.length; j += 1) {
                poly[j] = createVector(pX(keypoints[borderline[j]][0]), pY(keypoints[borderline[j]][1]));
            }
        }
    
        this.hit = collideCirclePoly(this.x, this.y, this.size, poly);

        if (!this.in) {
            if (this.hit) {
                this.x = random(0, 960);
                this.y = 0;
                this.size = random(25, 40);
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
            this.x = random(0, 960);
            this.y = 0;
            this.size = random(25, 40);
            this.color = color(0);
            this.speed = random(2, 5);
            this.hitLine = false;
            this.hitPoint = false;  
            this.type = round(random(0, 3));
            score += 1;
        }
    }
}


function playSound() {
    if (bgMusic.isLooping()) {
        bgMusic.stop();
    } else {
        bgMusic.loop();
        bgMusic.setVolume(0.2);
    }
    print('sound');
}


function transitSound() {
  if (!boop.isPlaying()) {
      boop.play();
//    gua.setVolume(0.4)
    }
}


function gameOverSound() {
  if (!gameOver.isPlaying()) {
      gameOver.play();
      gameOver.setLoop(false);
    }
}


function winSound() {
  if (!yay.isPlaying()) {
      yay.play();
      yay.setLoop(false);
    }
}


function parseResult() {
    myChoice = rec.resultString.split(' ');
    console.log(myChoice);
    
  
    for (let i=0; i<myChoice.length; i++) {
        if (myChoice.length > 0) {
            speaking = true;
        } else if (myChoice.length === 0) {
            speaking = false;
        }
        
        if (gameState === 'start') {
            if (myChoice[i] === "exit") {
                exiting = true;
                transitSound();
            }
            if (myChoice[i] === "tips" && exiting) {  
                gameState = 'tips';
                transitSound();
            } else if (myChoice[i] == "play"  && exiting) {
                gameState = 'inGame';
                transitSound();
            } else if (myChoice[i] === "instruction"  && exiting) {
                gameState = 'instruction';
                transitSound();
            }
        } 
        if (gameState === 'tips' || gameState === 'instruction') {
            if (myChoice[i] === "back") {
                gameState = 'start';
                transitSound();
            } else if (myChoice[i] === "next") {
                if (tipsPage.page === 1) {
                    tipsPage.page = 2;
                    transitSound();
                } else if (tipsPage.page === 2) {
                    tipsPage.page = 3;
                    transitSound();
                }
                
                if (insPage.page === 1) {
                    insPage.page = 2;
                    transitSound();
                } else if (insPage.page === 2) {
                    insPage.page = 3;
                    transitSound();
                } else if (insPage.page === 3) {
                    insPage.page = 4;
                    transitSound();
                }
            } else if (myChoice[i] === "previous") {
                if (tipsPage.page === 3) {
                    tipsPage.page = 2;
                    transitSound();
                } else if (tipsPage.page === 2) {
                    tipsPage.page = 1;
                    transitSound();
                }
                
                if (insPage.page === 4) {
                    insPage.page = 3;
                    transitSound();
                } else if (insPage.page === 3) {
                    insPage.page = 2;
                    transitSound();
                } else if (insPage.page === 2) {
                    insPage.page = 1;
                    transitSound();
                }
            }
        }
        
        if (gameState === 'inGame') {
            if (myChoice[i] === "pause") {
                pause = true;
                transitSound();
            } else if (myChoice[i] === "continue") {
                pause = false;
                transitSound();
            }
        }
        
        if (gameState === 'challenge') {
            if (myChoice[i] === "continue") {
                shop.state = 2;
            } else if (myChoice[i] === "check") {
                shop.collide();
            }
        }
        
        if (gameState === 'sick') {
            if (myChoice[i] === "continue") {
                if(!sick.continue) {
                    sick.continue = true;
                    transitSound();
                } else if (sick.continue && sick.pictureY === 360) {
                    sick.scalingPic = true;
                    transitSound();
                }
            }
        }
        
        if (gameState === 'winWin' || gameState === 'winLose' || gameState === 'loseMildLose' || gameState === 'loseMildWin' || gameState === 'loseSevereLose' || gameState === 'loseSevereWin') {
            if (myChoice[i] === "restart") {
                gameState = 'start';
                score = 0;
                lives = 19;
                shop.tryAgain = false;
                shop.state = 1;
                virus[i].reset();
                virus.splice(10, virus.length - 10);
                shop.reset();
                sick.reset();
                transitSound();
            }
        }
    }
} 