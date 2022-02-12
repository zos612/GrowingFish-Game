const screenSizeX = 1000;
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
let isRenderCol = true;

function setup() {
  createCanvas(screenSizeX, screenSizeY);
  init();
}

function init() {
  for (let i = 0; i < MAX_LAYER; i++) {
    renderObjs[i] = [];
  }

  collisionManager = new CollisionManager();
  collisionManager.init();

  sceneInit();
}



function keyPressed() {
  if (gameState == GAME_END) {
    gameState = GAME_PLAYING;
    sceneInit();
  }
}

function sceneInit() {

  score = 0;
  objs = [];

  let g_bgObj = new GameObject();
  g_bgObj.setPos(screenSizeX / 2, screenSizeY/ 2);
  g_bgObj.setImage('image/background/waterBG.jpg');
  g_bgObj.name = 'bgObj';
  g_bgObj.width = screenSizeX;
  g_bgObj.height = screenSizeY;
  objs.push(g_bgObj);
  
  player = new Player();
  player.name = 'playerObj';
  player.setPos(screenSizeX / 2, screenSizeY / 2);
  objs.push(player);
  
  gameResultText = new TextUI();
  gameResultText.name = 'bgObj';
  gameResultText.strText = 'GameOver';
  gameResultText.setPos(screenSizeX / 2, screenSizeY / 2);
  gameResultText.setScale(50,50);
  gameResultText.horizAlign = CENTER;
  gameResultText.vertAlign = CENTER;
  gameResultText.isActive = false;
  gameResultText.tag = TAG_UI;
  gameResultText.layer = 30;
  objs.push(gameResultText);

  KeyPressPleaseText = new TextUI();
  KeyPressPleaseText.name = 'key press plcease obj';
  KeyPressPleaseText.strText = 'Key Press Please';
  KeyPressPleaseText.setPos(screenSizeX / 2,screenSizeY / 2 + 50 );
  KeyPressPleaseText.setScale(30,30);
  KeyPressPleaseText.horizAlign = CENTER;
  KeyPressPleaseText.vertAlign = CENTER;
  KeyPressPleaseText.isActive = false;
  KeyPressPleaseText.tag = TAG_UI;
  KeyPressPleaseText.layer = 30;

  
  objs.push(KeyPressPleaseText);

  for (let i = 0; i < 10; i++) {
    let enemyFish = new Enemy();
    objs.push(enemyFish);
  }

  objs.forEach(element => {
    element.init();
  });
}

function draw() {
  update();

  // // rendering
  for (let i = 0; i < objs.length; i++) {
    let curLayer = objs[i].layer;
    renderObjs[curLayer].push(objs[i]);
  }
  for (let i = 0; i < MAX_LAYER; ++i) {
    let layerobjs = renderObjs[i];
    for (let j = 0; j < layerobjs.length; ++j) {
      let renderObj = layerobjs[j];
      if (renderObj.isActive)
        renderObj.draw();
    }
  }

  for (let i = 0; i < MAX_LAYER; ++i) {
    renderObjs[i] = [];
  }

  push();
  textSize(30);
  text('Score : ' + score, 30, 50);
  pop();

  collisionManager.update();

  // delete event
  objs.forEach(obj => {
    if (obj.isDead == true) {

      let idx = findIndex(obj.id);

      if (idx != -1) {
        objs.splice(idx, 1);
      }
    }
  });
}

function update() {
  objs.forEach(element => {
    element.update();
  });
}

function findIndex(id) {

  for (let i = 0; i < objs.length; i++) {
    if (objs[i].id == id) {
      return i;
    }
  }
  return -1;
}


// tools
function myNormalize(x,y) {
  let w = Math.sqrt(x*x, y*y);
  return [x/w, y/w];
}
// tools
function myNormalizeX(x,y) {
  let w = Math.sqrt(x*x, y*y);
  return x / w;
}
function myNormalizeY(x,y) {
  let w = Math.sqrt(x*x, y*y);
  return y / w;
}


class GameObject {
  constructor() {
    this.name = "emptyObj";
    this.posX = 0;
    this.posY = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.tag = TAG_DEFAULT;
    this.id = gId++;
    this.isDead = false;
    this.isActive = true;
    this.layer = 0;

    // Images
    this.image = null;
    this.width = 100;
    this.height = 100;
  }

  init(){}
  update(){}
  collisionObj(obj) {}
  draw(){
    let resultX = this.minX;
    let resultY = this.minY;
    console.log("minX : " + this.minX + " minY : " + this.minY);
  
    
    if(this.image){
      push();
      if(this.scaleX < 0) {
        scale(-1, 1);
        resultX = -this.posX - ((this.width * this.scaleX) / 2);
      }
      if(this.scaleY < 0){
        scale(1, -1);
        resultY = -this.posY - ((this.height * this.scaleY) / 2);
      }
      image(this.image, resultX, resultY, this.width * this.scaleX, this.height * this.scaleY);
      pop();
    }
    if (isRenderCol == true) {
      fill(0, 0);
      rect(resultX, resultY, this.width, this.height);
      console.log("col minX : " + resultX + " minY : " + resultY);
  }
  }
  
  setPos(x, y) {
    this.posX = x;
    this.posY = y;
  }
  setScale(x,y){
    this.scaleX =x;
    this.scaleY =y;
  }
  setImage(strPath){
    this.image = loadImage(strPath);
    this.width = 100;
    this.height = 100;
  }

  get minX() {
    return this.posX - (this.width * this.scaleX  / 2);
  }
  get minY() {
    return this.posY - (this.height * this.scaleY  / 2);
  }
  get maxX() {
    return this.posX + (this.width * this.scaleX  / 2);

  }
  get maxY() {
    return this.posY + (this.height * this.scaleY  / 2);
  }
}

class Fish extends GameObject {
  constructor() {
    super();
    this.posX = 0;
    this.posY = 0;
    this.width = 100;
    this.height = 100;
    this.speed = 5;
    this.isLeft = true;
  }
}

class Player extends Fish {
  init() {
    this.tag = TAG_PLAYER;
    push();
    this.setImage('image/fish/1.png');
    imageMode(CENTER);
    pop();

    this.speed = 10;
    this.scale = 10;
  }

  update() {
    if (gameState == GAME_END) {
      return;
    }

    let dirX = 0;
    let dirY = 0;
    if (keyIsDown(UP_ARROW)) {
      dirY = -1;
    }
    if (keyIsDown(DOWN_ARROW)) {
      dirY = 1;
    }
    if (keyIsDown(LEFT_ARROW)) {
      dirX = -1;
      this.isLeft = true;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      dirX = 1;
      this.isLeft = false;
    }
    if(this.isLeft == true){
      this.scaleX = -1;
    }
    else{
      this.scaleX =1;
    }
    // this.posX += dirX;
    // this.posY += dirY;
    // let vDirX = myNormalizeX(dirX, dirY);
    // let vDirY = myNormalizeY(dirX,dirY);
    // console.log('vDirection : '+ vDirX + ' ' + vDirY);
    // vDirX = vDirX * this.speed;
    // vDirY = vDirY * this.speed;
    
    // vDirX = vDirX * this.speed;
    // vDirY = vDirY * this.speed;
    this.posX += dirX;
    this.posY += dirY;
  }

  collisionObj(obj) {
    if (this.scale > obj.scale) {
        if (obj.tag == TAG_ENERMY) {
        if (score >= 1000) {
          gameResultText.isActive = true;
          gameResultText.strText = 'Win';
          KeyPressPleaseText.isActive = true;

          gameState = GAME_END;
        } else {
          this.scale += 10;
          // obj.isDead = true;  
          obj.init();
          score += 1 * this.scale;
        }
      }
      else {
        this.isDead = true;
        gameState = GAME_END;
        gameResultText.isActive = true;
        KeyPressPleaseText.isActive = true;
      }
    }
  }

}

class Enemy extends Fish {
  init() {
    let randomImgNum = Math.floor(Math.random() * 4 + 2);
    this.tag = TAG_ENERMY;
    push();
    this.setImage('image/fish/' + randomImgNum + '.png');
    imageMode(CENTER);
    pop();

    let randomPosX = Math.random() * screenSizeX;
    let randomPosY = Math.random() * screenSizeY;
    let randomDir = Math.floor(Math.random() * 2);//Math.floor(Math.random() * 2);
    if (randomDir == 0) {
      this.isLeft = false;
    } else {
      this.isLeft = true;

    }

    this.scale = Math.random() * 40 + 3;

    if (this.isLeft) {
      this.posX = screenSizeX + randomPosX;
    } else {
      this.posX = -screenSizeX + randomPosX;
    }

    this.posY = randomPosY;

  }

  update() {
    if (gameState == GAME_END) {
      return;
    }


    if (this.isLeft == true) {
      this.posX -= this.speed;
    }
    else {
      this.posX += this.speed;
    }

    if (this.posX < LEFT_END_LINE && this.isLeft == true) {
      this.init();
    }
    else if (this.posX > RIGHT_END_LINE && this.isLeft == false) {
      this.init();
    }
    if(this.isLeft == true){
      this.scaleX = -1;
    }
    else{
      this.scaleX =1;
    }
  }
}
class CollisionManager {
  init() {

  }

  update() {

    for (let i = 0; i < objs.length; i++) {
      if (objs[i].isDead) {
        continue;
      }
      for (let j = 0; j < objs.length; j++) {
        if (i == j) {
          continue;
        }

        if (objs[j].isDead) {
          continue;
        }

        let isCol = this.isCollision(objs[i], objs[j]);
        if (isCol == true) {
          if (objs[i] && objs[j]) {
            objs[i].collisionObj(objs[j]);
            objs[j].collisionObj(objs[i]);
          }
        }
      }
    }
  }

  isCollision(obj1, obj2) {
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

class UI extends GameObject {

  constructor() {
    super();
    this.layer = 31;
  }
}

class TextUI extends UI {

  init() {
  }
  update() {

  }
  draw() {
    // textFont(myFont);
    push();
    textAlign(this.horizAlign, this.vertAlign);
    textSize(this.scale);
    text(this.strText, this.posX, this.posY);
    pop();
  }
}
