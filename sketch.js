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
let tipsPage;
let shop, street, shopBG;


//for sound setting;
let rec;
let myChoice;

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
let choosing = false;
let timer;

//tips page;



function preload() {
    yellowVirus = loadImage('virus/yellowVirus.png');
    blueVirus = loadImage('virus/blueVirus.png');
    redVirus = loadImage('virus/redVirus.png');
    orangeVirus = loadImage('virus/orangeVirus.png');
    shopBG = loadImage('shop.png');
    street = loadImage('street.png');
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

    intro = new Intro();
    tipsPage = new TipsPage();
    shop = new Shop();
    timer = new Timer();
    
    boundingRed = new BoundingVirus();
    boundingYellow = new BoundingVirus();
    boundingOrange = new BoundingVirus();
    boundingBlue = new BoundingVirus();
    
    
    for (let i=0; i<10; i++) {
        virus[i] = new FallingVirus();
    }
    

    
    
}


function restart() {
    rec.start();
}


function draw() {

//    print(gameState)
//
//    print(gameState);
//    print(exiting);
    print(virus.length);
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
    if (gameState === 'inGame') {
        if (lives <= 0) {
            gameState = 'over';
        }
    }
        
    if (score > 60) {
        gameState = 'challenge';
    }


    if (gameState === 'challenge') {
        socialDistancing();
    }
    
//    if (gameState === 'final') {
//        sickScene();
//    }
    
    if (gameState === 'over') {
        endMenu();
    }
    
    if (gameState === 'win') {
        winMenu();
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
    text('Instruction Page', 200, height * 0.8);
    text('Start Playing', width/2, height * 0.8);
    text('Tips Page', width-200, height * 0.8);
    
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
    textSize(24);
    text('BACK', 50, 50);
    
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
            text('The virus that causes COVID-19 most commonly spreads between people who are in close contact with one another (within about 6 feet, or 2 arm lengths).', 130, 303, 330, 450);
            text('Avoid touching your eyes, nose, and mouth with unwashed hands.', 510, 303, 330, 450);
            text('Wash your hands often with soap and water for at least 20 seconds especially after you have been in a public place, or after blowing your nose, coughing, or sneezing. If soap and water are not readily available, use a hand sanitizer that contains at least 60% alcohol. ', 130, 528, 330, 450);
            text('Always cover your mouth and nose with a tissue when you cough or sneeze or use the inside of your elbow and do not spit. Throw used tissues in the trash.', 510, 568, 330, 450);
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
            text('Be alert for symptoms. Watch for fever, cough, shortness of breath, or other symptoms of COVID-19.', 130, 303, 330, 450);
            text('Stay home when you are sick, except to get medical care. Use a separate room and bathroom for sick household members (if possible).', 510, 303, 330, 450);
            text('If you need emergency help, call 911,  or if someone is showing any of these signs, seek emergency medical care immediately: Trouble breathing, Persistent pain or pressure in the chest, New confusion, Inability to wake or stay awake, and Bluish lips or face.', 130, 528, 330, 450);
            text('Most pets that have gotten sick from the virus that causes COVID-19 were infected after close contact with a person with COVID-19. Talk to your veterinarian about any health concerns you have about your pets.', 510, 548, 330, 450);
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
    
    next() {

    }
}


function instruction() {
    background(colors.bg);
    push();

    fill(0);
    textAlign(CENTER);
    textFont('Bungee', 48);
    text('How to Play', width/2, 100);
    textSize(24);
    text('BACK', 50, 50);
    
    
    textFont('Ubuntu Mono', 16);
    fill(0);
    textAlign(LEFT);
    text('This game is about motion and your knowledge about COVID-19. If you don’t feel confident, reading the tips page is strongly recommended.', 480, 340, width/2, height/3);
    text('Make sure you give access to your microphone and camera. Make sure your surrounding is quite enough. This game is controlled by voice and motion. NO KEYBOARD OR MOUSE INTERACTION. When choosing between different pages or game states, read the name of the chosen page. (ex.: BACK, TIPS PAGE, START PLAYING, CONTINUE, etc)', 480, 480, width/2, height/3);
    text('When in the playing states, where you see the character, you use your face to control its position. Notice that the camera is flipped horizontally, which means that if you want to move the character to the right, you, in the reality, have to move to the left. ', 480, 680, width/2, height/3);

    pop();
}


function inGame() {
    background(colors.bg);
    
    let newVirus = new FallingVirus();
    if (millis() - lastTrigger >= 2000) {
        virus.push(newVirus);
        lastTrigger = millis();
    }
    
    if (faceReady) {
        image(street, 0, 0);
        push();
        scale(1.5);
        drawSkeleton();

        for (let i=0; i<virus.length; i++) {
            virus[i].view();
            virus[i].fall();

            virus[i].collideFace();
            virus[i].reset();
    //        print('x', virus[i].x);
    //        print('y', virus[i].y)
        }
        pop();
        
        noStroke();
        fill('#2482A4');
        textAlign(LEFT);
        textFont('Ubuntu Mono', 24);
        text('progress', 15, 40);
        text('Lives Left', width - 130, 40);
        
        rectMode(CORNER);
        fill(colors.bg);
        rect(123.5, 21.5, 293, 23);
        fill(colors.green);
        rect(123.5, 21.5, score/60*293, 23);
        rect(width - 336.5, 21.5, 193, 23, 40);
        fill(colors.bg);
        rect(width - 336.5, 21.5, (19 - lives)/19*200, 23);
        stroke(colors.darkBlue);
        noFill();
        strokeWeight(7);
        rect(120, 18, 300, 30, 40);
        rect(width - 340, 18, 200, 30, 40);
//        print(lives);
    }
    
}


function socialDistancing() {
    background(colors.bg);
    
    shop.bgView();
    shop.character();
    
    if (shop.hit) {
        gameState = 'win';
    } else if (!shop.hit && shop.characterX > 312 && shop.checked) {
        gameState = 'over';
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
        this.characterY = 325;
        this.dotSize = 26;
        this.dotY = 296;
        this.hit = false;
        this.tryAgain = false;
        this.checked = false;
    }
    
    bgView() {
        image(shopBG, 0, 0, width, height, this.bgx, this.bgy, this.bgw, this.bgh);
        
        textFont('Ubuntu Mono', 20);
//        print(this.hit)
        noStroke();
        fill(0);
        if (this.state === 1) {
            if (timer.count(1000)) {
                text('You have reached your destination, the grocery shop.', 50, 50);
            } 
            
            if (timer.count(4000)) {
                text('There seems to be a long line. Get in there right now!', 50, 100);
            } 
            
            if (timer.count(7000)) {
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
            push();
            scale(1.5);
            strokeWeight(4);
            stroke(0);

            noStroke();
            fill(colors.green);
            ellipse(210, this.dotY + 1, this.dotSize);
            ellipse(104, this.dotY + 1, this.dotSize);
            ellipse(312, this.dotY, this.dotSize);
//            strokeWeight(4);
//            stroke(0);
//            point(312, this.dotY+1);
            for (let i = 0; i < predictions.length; i += 1) {
    const keypoints = predictions[i].scaledMesh;
                fill(colors.red);
                noStroke();

                this.characterX = map(keypoints[4][0], 0, 640, 0, 400);
//                    print(this.characterX);
                ellipse(this.characterX, this.characterY, 40, 60);
//                    print(keypoints[4][0]);
            }
            
            textFont('Ubuntu Mono', 20);
            fill(0);
            
            if (this.characterX > 316) {
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
            
            pop();
        }
    }
    
    collide() {
        push();
        scale(1.5);
        this.checked = true;
        this.hit = collidePointEllipse(312, this.dotY, this.characterX, this.characterY, 40, 60);
    
        
        if (!this.hit && this.characterX < 312) {
            this.tryAgain = true;
//            print('working');
        }
        pop();
    }
}


function washingHands() {
    background(colors.bg);
  
    fill(0);
    textAlign(CENTER);
    textSize(48);
    text('Wash your hands often', width/2, height/2);
    textSize(24);
    text('New game state is on the way...', width/2, height/2+100);
    text('say RESTART to restart game', width/2, height-200);
}


function modelLoaded() {
    console.log('facemesh ready');
    faceReady = true;
    
}


function drawSkeleton() {
//    image(video, 0, 0);

    for (let i = 0; i < predictions.length; i += 1) {
        const keypoints = predictions[i].scaledMesh;

        for (let j = 0; j < borderline.length; j++) {
            let [x1, y1] = keypoints[borderline[j]];
            
//            push();
//            imageMode(CENTER);
//            image(boy, keypoints[4][0], keypoints[4][1], 200, 200, 0, 0, 50, 50);
//            pop();
            fill(colors.red);
            noStroke();
            
            beginShape();
            curveVertex(keypoints[borderline[0]][0], keypoints[borderline[0]][1]); 
            curveVertex(keypoints[borderline[1]][0], keypoints[borderline[1]][1]);
            curveVertex(keypoints[borderline[2]][0], keypoints[borderline[2]][1]);  
            curveVertex(keypoints[borderline[3]][0], keypoints[borderline[3]][1]);  
            curveVertex(keypoints[borderline[4]][0], keypoints[borderline[4]][1]);  
            curveVertex(keypoints[borderline[5]][0], keypoints[borderline[5]][1]);  
            curveVertex(keypoints[borderline[6]][0], keypoints[borderline[6]][1]); 
            curveVertex(keypoints[borderline[7]][0], keypoints[borderline[7]][1]);  
            curveVertex(keypoints[borderline[8]][0], keypoints[borderline[8]][1]);  
            curveVertex(keypoints[borderline[9]][0], keypoints[borderline[9]][1]);  
            curveVertex(keypoints[borderline[10]][0], keypoints[borderline[10]][1]);  
            curveVertex(keypoints[borderline[11]][0], keypoints[borderline[11]][1]);
            curveVertex(keypoints[borderline[12]][0], keypoints[borderline[12]][1]);  
            curveVertex(keypoints[borderline[13]][0], keypoints[borderline[13]][1]); 
            curveVertex(keypoints[borderline[14]][0], keypoints[borderline[14]][1]); 
            curveVertex(keypoints[borderline[15]][0], keypoints[borderline[15]][1]);  
            curveVertex(keypoints[borderline[16]][0], keypoints[borderline[16]][1]);  
            curveVertex(keypoints[borderline[17]][0], keypoints[borderline[17]][1]);  
            curveVertex(keypoints[borderline[18]][0], keypoints[borderline[18]][1]);  
            curveVertex(keypoints[borderline[19]][0], keypoints[borderline[19]][1]);  
            curveVertex(keypoints[borderline[20]][0], keypoints[borderline[20]][1]);   curveVertex(keypoints[borderline[21]][0], keypoints[borderline[21]][1]);
            curveVertex(keypoints[borderline[22]][0], keypoints[borderline[22]][1]);  
            curveVertex(keypoints[borderline[23]][0], keypoints[borderline[23]][1]); 
            curveVertex(keypoints[borderline[24]][0], keypoints[borderline[24]][1]); 
            curveVertex(keypoints[borderline[25]][0], keypoints[borderline[25]][1]);  
            curveVertex(keypoints[borderline[26]][0], keypoints[borderline[26]][1]);  
            curveVertex(keypoints[borderline[27]][0], keypoints[borderline[27]][1]);  
            curveVertex(keypoints[borderline[28]][0], keypoints[borderline[28]][1]);  
            curveVertex(keypoints[borderline[29]][0], keypoints[borderline[29]][1]);  
            curveVertex(keypoints[borderline[30]][0], keypoints[borderline[30]][1]);   curveVertex(keypoints[borderline[31]][0], keypoints[borderline[31]][1]);
            curveVertex(keypoints[borderline[32]][0], keypoints[borderline[32]][1]);  
            curveVertex(keypoints[borderline[33]][0], keypoints[borderline[33]][1]); 
            curveVertex(keypoints[borderline[34]][0], keypoints[borderline[34]][1]); 
            curveVertex(keypoints[borderline[35]][0], keypoints[borderline[35]][1]);  
            endShape(CLOSE);
            
            
            fill(255);
            let eyeWidthL = dist(keypoints[130][0], keypoints[130][1], keypoints[133][0], keypoints[133][1]);
            let eyeWidthR = dist(keypoints[362][0], keypoints[362][1], keypoints[359][0], keypoints[359][1])
            ellipse(keypoints[28][0], keypoints[28][1], eyeWidthL, eyeWidthL);
            ellipse(keypoints[258][0], keypoints[258][1], eyeWidthR, eyeWidthR);
            
            fill(0);
            ellipse(keypoints[56][0], keypoints[56][1], eyeWidthL*0.3, eyeWidthL*0.3);
            ellipse(keypoints[286][0], keypoints[286][1], eyeWidthR*0.3, eyeWidthR*0.3);
            
            strokeWeight(10);
            stroke(colors.red);
            line(keypoints[140][0], keypoints[140][1], keypoints[140][0], keypoints[140][1] + 30);
            line(keypoints[378][0], keypoints[378][1], keypoints[378][0], keypoints[378][1] + 30);
            line(keypoints[93][0], keypoints[93][1], keypoints[93][0] - 20, keypoints[93][1] + 20);
            line(keypoints[323][0], keypoints[323][1], keypoints[323][0] + 20, keypoints[323][1] + 20);

            
      
//            if (j < borderline.length-1) {
//                line(x1, y1, keypoints[borderline[j+1]][0], keypoints[borderline[j+1]][1]);
//                line(keypoints[borderline[borderline.length-1]][0], keypoints[borderline[borderline.length-1]][1], keypoints[borderline[0]][0], keypoints[borderline[0]][1]);
//            }
        }
    }
}


//function sickScene() {
//    background(colors.bg);
//  
//    fill(0);
//    textAlign(CENTER);
//    textSize(48);
//    text('You got sick', width/2, height/2);
//    textSize(24);
//    text('New game state is on the way...', width/2, height/2+100);
//    text('say RESTART to restart game', width/2, height-200);
//}


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
    }
        
    
    fall() {
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
            this.type = round(random(0, 3));
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
            } else if (myChoice[i] === "next") {
                if (tipsPage.page === 1) {
                    tipsPage.page = 2;
                } else if (tipsPage.page === 2) {
                    tipsPage.page = 3;
                }
            } else if (myChoice[i] === "previous") {
                if (tipsPage.page === 3) {
                    tipsPage.page = 2;
                } else if (tipsPage.page === 2) {
                    tipsPage.page = 1;
                }
            }
        }
        
        if (gameState === 'challenge') {
            if (myChoice[i] === "continue") {
                shop.state = 2;
            } else if (myChoice[i] === "check") {
                shop.collide();
            }
        }
        
        if (gameState === 'over' || gameState === 'win') {
            if (myChoice[i] === "restart") {
                gameState = 'start';
                score = 0;
                lives = 19;
                shop.tryAgain = false;
                shop.state = 1;
                virus.splice(10, virus.length - 10);
            }
        }
    }
} 