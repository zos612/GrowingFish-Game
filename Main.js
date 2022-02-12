const screenSizeX = 600;
const screenSizeY = 600;
const LEFT_END_LINE = -100;
let RIGHT_END_LINE = screenSizeX + 100;
const TAG_DEFAULT = 0;
const TAG_PLAYER = 1;
const TAG_ENERMY = 2;
const TAG_UI = 3;
const MAX_LAYER = 32;
const GAME_PLAYING = '0';
const GAME_END = '1';

let img;
let player;
let gameResultText;
let KeyPressPleaseText;
let winText;
let enemy = [];
let objs = [];
let renderObjs = [MAX_LAYER];
let collisionManager;
let gId = 0;
let myFont;
let score = 0;
let gameState;
let isRenderCol = false;

  function setup() {
    createCanvas(screenSizeX, screenSizeY);
    init();
  }

  function init(){
    
    for(let i = 0; i < MAX_LAYER ; i++){
      renderObjs[i] = [];
    } 
    
    collisionManager = new CollisionManager();
    collisionManager.init();

    BgImg = loadImage('image/background/waterBG.jpg');

    sceneInit();
  }

  function sceneInit(){

    score = 0;
    objs = [];
    player = new Player(screenSizeX / 2, screenSizeY / 2, 30, 20);
    objs.push(player);

    gameResultText = new TextUI();
    gameResultText.strText = 'GameOver';
    gameResultText.x = 300;
    gameResultText.y = 300;
    gameResultText.scale = 50;
    gameResultText.horizAlign = CENTER;
    gameResultText.vertAlign = CENTER;
    gameResultText.isActive = false;
    gameResultText.tag = TAG_UI;
    gameResultText.layer = 30;
    
    KeyPressPleaseText = new TextUI();
    KeyPressPleaseText.strText = 'Key Press Please';
    KeyPressPleaseText.x = 300;
    KeyPressPleaseText.y = 350;
    KeyPressPleaseText.scale = 30;
    KeyPressPleaseText.horizAlign = CENTER;
    KeyPressPleaseText.vertAlign = CENTER;
    KeyPressPleaseText.isActive = false;
    KeyPressPleaseText.tag = TAG_UI;
    KeyPressPleaseText.layer = 30;

    objs.push(gameResultText);
    objs.push(KeyPressPleaseText);
    
    for(let i = 0; i < 10; i++){
      objs.push(new Enemy(0, 0, 0, 0));
    }

    objs.forEach(element => {
      element.init();
    });
  }
  
  function draw() {
    update();
    image(BgImg, 0, 0, screenSizeX, screenSizeY);

    // // rendering
    for(let i = 0; i < objs.length ; i++){
      let curLayer = objs[i].layer;
      renderObjs[curLayer].push(objs[i]);
    }
    for(let i= 0; i <MAX_LAYER; ++i){
      let layerobjs = renderObjs[i];
      for(let j=0; j < layerobjs.length; ++j){
        let renderObj = layerobjs[j]; 
        if(renderObj.isActive)
          renderObj.draw();

      }
    }

    for(let i=0 ;i<MAX_LAYER;++i){
      renderObjs[i] = [];
    }

    push();
    textSize(30);
    text('Score : ' + score, 30, 50);
    pop();

    collisionManager.update();

    // delete event
    objs.forEach(obj => {
      if(obj.isDead == true){

        let idx = findIndex(obj.id);

        if(idx != -1){
          objs.splice(idx, 1);
        }
      }
    });
  }

  function keyPressed(){
    if(gameState == GAME_END){
      gameState = GAME_PLAYING;
      sceneInit();
    }
  }

  

  function update() {
      objs.forEach(element => {
        element.update();
      });
  }
  
  function findIndex(id){

    for(let i=0; i< objs.length; i++){
      if(objs[i].id == id){
        return i;
      } 
    }
    return -1;
  }

  class GameObject{
    constructor() {
      this.x = 0;
      this.y = 0;
      this.width = 100;
      this.height = 100;
      this.scale = 0;
      this.tag = TAG_DEFAULT;
      this.id = gId++;
      this.isDead = false;
      this.isActive = true;
      this.layer = 0;
    }

    init(){
  
    }
    update(){
  
    }
    collisionObj(obj){
  
    }
  }

  class Fish extends GameObject{
    constructor(x, y, width, height) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.ratioWidth = 3;
        this.ratioHeight = 2;
        this.speed = 5;
        this.isLeft = true;
      }

      get minX(){
        return this.x - (this.width / 2);
      }
      get minY(){
        return this.y - (this.height / 2);
      }
      get maxX(){
        return this.x + (this.width / 2);
      }
      get maxY(){
        return this.y + (this.height / 2);
      }

    draw(){
      let resultX = this.minX;
      let resultY = this.minY;
      this.width = this.ratioWidth * this.scale;
      this.height = this.ratioHeight * this.scale;

      if(isRenderCol == true){ 
        push();
        fill(0,0);
        rect(resultX, resultY, this.width, this.height);
        pop();
      }      
      
      if(this.isLeft == true){
        push();
        scale(-1, 1);
        image(this.img, -this.x - (this.width / 2), resultY, this.width, this.height);
        pop();
      }
      else{
        image(this.img, resultX, resultY, this.width, this.height);
      }

    }

    update(){
    }

  collisionObj(obj){
  }
}



class Player extends Fish{
    init(){
      this.tag = TAG_PLAYER;
      push();
      this.img = loadImage('image/fish/1.png');
      imageMode(CENTER);
      pop();

      this.speed = 10;
      this.scale = 10;
    }

    update(){
      if(gameState == GAME_END){
        return;
      }

      if ( keyIsDown(UP_ARROW)) { 
        this.y -= this.speed;
      } 
      if (keyIsDown(DOWN_ARROW)) {
        this.y += this.speed;
      }  
      if (keyIsDown(LEFT_ARROW)) { 
        this.x -= this.speed;
        this.isLeft = true;
      }
      if (keyIsDown(RIGHT_ARROW)) {
        this.x += this.speed;
        this.isLeft = false;
      }
    }
    collisionObj(obj){
      if(obj.tag == TAG_ENERMY){
        if(this.scale > obj.scale){
          if(score >= 1000){
            gameResultText.isActive = true;
            gameResultText.strText = 'Win'; 
            KeyPressPleaseText.isActive = true;

            gameState = GAME_END; 
          }else{
            this.scale += 10;  
            // obj.isDead = true;  
            obj.init();
            score += 1 * this.scale; 
          }
        }
        else{
          this.isDead = true;
          gameState = GAME_END;
          gameResultText.isActive = true;
          KeyPressPleaseText.isActive = true;
        }
      }
    }
    
}

class Enemy extends Fish{
  init(){
      let randomImgNum = Math.floor(Math.random() * 4 + 2);
      this.tag = TAG_ENERMY;
      push();
      this.img = loadImage('image/fish/'+ randomImgNum + '.png');
      imageMode(CENTER);
      pop();

      let randomPosX = Math.random() * screenSizeX;
      let randomPosY = Math.random() * screenSizeY;
      let randomDir = Math.floor(Math.random() * 2);//Math.floor(Math.random() * 2);
      if(randomDir == 0){
        this.isLeft = false;
      }else{
        this.isLeft = true;

      }

      this.scale = Math.random() * 40 + 3;

      if(this.isLeft){
        this.x = screenSizeX + randomPosX;
      }else{
        this.x = -screenSizeX + randomPosX;
      }
      
      this.y = randomPosY;

  }

  update(){

    if(gameState == GAME_END){
      return;
    }


    if(this.isLeft == true){
      this.x -= this.speed;
    }
    else{
      this.x += this.speed;
    }
    
    if(this.x < LEFT_END_LINE && this.isLeft == true){
      this.init();
    }
    else if(this.x > RIGHT_END_LINE && this.isLeft == false){
      this.init();
    }
}
}
class CollisionManager {
  init(){

  }

  update(){
   
    for(let i =0; i< objs.length; i++){
      if(objs[i].isDead){
        continue;
      }
      for(let j =0; j< objs.length; j++){
        if(i == j){
          continue;
        }

        if(objs[j].isDead){
          continue;
        }

        let isCol = this.isCollision(objs[i], objs[j]);
        if (isCol == true){
          if(objs[i] && objs[j]){
            objs[i].collisionObj(objs[j]);
            objs[j].collisionObj(objs[i]); 
          }
        }
      }
    }
  }

  isCollision(obj1, obj2){
    if (obj1.maxX < obj2.minX || obj1.minX > obj2.maxX) return false;
    if (obj1.maxY < obj2.minY || obj1.minY > obj2.maxY) return false;
      return true;
  }

}

// class GameManager{
//   init(){

//   }
//   update(){

//   }
// }

class UI extends GameObject{
  
  constructor(){
    super();
    this.layer = 31;
  }
}

class TextUI extends UI{
  
  init(){
  }
  update(){

  }
  draw(){
    // textFont(myFont);
    push();
    textAlign(this.horizAlign, this.vertAlign);
    textSize(this.scale);
    text(this.strText, this.x, this.y);
    pop();
  }
}
