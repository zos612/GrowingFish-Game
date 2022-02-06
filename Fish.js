let BgImg;

class Fish{
    // constructor(x, y) {
    //     this.x = x;
    //     this.y = y;
    //   }
    Init(){
        BgImg = loadImage('image/fish/1.png');
    }

    draw(){
        image(BgImg, 10, 10);
    }
}