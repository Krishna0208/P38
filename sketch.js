var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

var highScore = 0;


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
   restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // createCanvas(600, 200);
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" ,trex_collided);
  trex.scale = 0.7;
  
  ground = createSprite(windowWidth/2,windowHeight/2,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /3;
  
  gameOver = createSprite(windowWidth/2,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(windowWidth/2,200);
  restart.addImage(restartImg);
  
  gameOver.scale = 1;
  restart.scale = 1;
  
  invisibleGround = createSprite(windowWidth/2,windowHeight/2 + 20, windowWidth ,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  console.log("Hello" + 5);
  
  trex.setCollider("circle",0,0,50);
  
  score = 0;
  
}

function draw() {
  
  background(255);
  //displaying score
  strokeWeight(10);
  fill(10);
  textSize(15);
  text("Score: "+ score, windowWidth - 150,50);
  text("High Score: "+ highScore, 100,50);
  
  console.log("this is ",gameState)
  
  
  if(gameState === PLAY){
    gameOver.visible = false
    restart.visible = false
    //move the ground
    ground.velocityX = -(6 + score/200);
    //scoring
    score = score + Math.round(frameCount/60);
    
    if(score > highScore) {
      highScore = score;
    }

    if (score>0 && score%100===0) {
        checkPointSound.play();
        }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 100) {
        trex.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        dieSound.play();
    }
  }
   else if (gameState === END) {
     console.log("hey")
      gameOver.visible = true;
      restart.visible = true;
     
      ground.velocityX = 0;
      trex.velocityY = 0;
     
      //change the trex animation
      trex.changeAnimation("collided", trex_collided);
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);

     if(mousePressedOver(restart)) {
      reset();
    }

   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 100 === 0){
   var obstacle = createSprite(windowWidth + 20,windowHeight/2 - 25,10,40);
   obstacle.scale = 3;
   obstacle.velocityX = -(6 + score/200);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              obstacle.scale = 2
              break;
      case 2: obstacle.addImage(obstacle2);
              obstacle.scale = 2
              break;
      case 3: obstacle.addImage(obstacle3);
              obstacle.scale = 2
              break;
      case 4: obstacle.addImage(obstacle4);
              obstacle.scale = 2
              break;
      case 5: obstacle.addImage(obstacle5);
              obstacle.scale = 2
              break;
      case 6: obstacle.addImage(obstacle6);
              obstacle.scale = 2
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.7;
    obstacle.lifetime = 300;
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
    obstaclesGroup.setVelocityXEach(-(6 + score/200));
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 80 === 0) {
     cloud = createSprite(windowWidth + 20,windowHeight/2, 40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 1;
    cloud.velocityX = -(6 + score/200);
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}

function reset(){
  gameState=PLAY;
  restart.visible=false;
  gameOver.visible=false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running",trex_running);
  score=0;
}

