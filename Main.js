let img;
let player;
let enemy = [];
let objs = [];
let screenSizeX = 600;
let screenSizeY = 600;
let collisionManager;
let gId = 0;

const LEFT_END_LINE = -100;
const RIGHT_END_LINE = screenSizeX + 100;

function setup() {
    createCanvas(screenSizeX, screenSizeY);
    init();
  }

  function init(){

    collisionManager = new CollisionManager();
    collisionManager.init();

    BgImg = loadImage('image/background/waterBG.jpg');
    player = new Player(screenSizeX / 2, screenSizeY / 2, 30, 20);

    objs.push(player);

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

    objs.forEach(element => {
      element.draw();
    });
    
    collisionManager.update();


    objs.forEach(obj => {
      if(obj.isDead == true){

        let idx = findIndex(obj.id);

        if(idx != -1){
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
  
  function findIndex(id){

    for(let i=0; i< objs.length; i++){
      if(objs[i].id == id){
        return i;
      } 
    }
    return -1;
  }

  class Fish{
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.ratioWidth = 3;
        this.ratioHeight = 2;
        this.speed = 5;
        this.isLeft = true;
        this.scale = 0;
        this.tag = 0;
        this.id = gId++;
        this.isDead = false;
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
      
      push();
      fill(0,0);
      rect(resultX, resultY, this.width, this.height);
      pop();
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

class Enemy extends Fish{
    init(){
        this.tag = 1;
        push();
        this.img = loadImage('image/fish/2.png');
        imageMode(CENTER);
        pop();

        let randomPosX = Math.random() * screenSizeX;
        let randomPosY = Math.random() * screenSizeY;
        this.scale = Math.random() * 40 + 3;

        this.x = screenSizeX + randomPosX;
        this.y = randomPosY;
    }

    update(){
      if(this.isLeft == true){
        this.x -= this.speed;
      }
      else{
        this.x += this.speed;
      }
      
      if(this.x < LEFT_END_LINE && this.isLeft == true){
        this.init();
      }
  }
}
let cnt = 0;
class Player extends Fish{
    init(){
      this.tag = 0;
      push();
      this.img = loadImage('image/fish/1.png');
      imageMode(CENTER);
      pop();

      this.speed = 10;
      this.scale = 10;
    }

    update(){
        if(keyIsPressed === true){
          if ( keyCode === UP_ARROW) {
            this.y -= this.speed;
          } 
          if (keyCode === DOWN_ARROW) {
            this.y += this.speed;
          }  
          if (keyCode === LEFT_ARROW) {
            this.x -= this.speed;
            this.isLeft = true;
          }
          if (keyCode === RIGHT_ARROW) {
            this.x += this.speed;
            this.isLeft = false;

          }
        }
        
    }
    collisionObj(obj){
      if(this.scale > obj.scale){
        this.scale += 10;
        obj.isDead = true;
        

      }else{
    
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

class GameManager{
  init(){

  }
  update(){

  }
}
