let t;
function initialize(){
  BROWN = color(165,100,100);
  BLACK = color(0, 0, 0);
  WHITE = color(255, 255, 255);
  GREEN = color(0,255,0);
  BLUE = color(0,0,255);
  RED = color(255, 0, 0);
  PURPLE = color(255, 0, 255);
  YELLOW = color(255,255,0);
  COLORS = [RED, BLUE, GREEN, YELLOW, PURPLE, BROWN, WHITE];
  TEMPLATE = [L, J, S, N, Z, T, I];
}

function setup() {
  createCanvas(WIDTH, tHEIGHT);
  
  initialize();
  t = new Tetris();
  t.initialize();
  
}

function draw() {
  background(0);
  t.display();
  if (t.is_collided(t.cur.p[0])){
    console.log('x');
  }

}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    if (!t.is_edge(t.cur.p[t.cur.o], t.cur.x-1, t.cur.y)){
      t.move('left');
    }
  } else if (keyCode === RIGHT_ARROW) {
    if (!t.is_edge(t.cur.p[t.cur.o], t.cur.x+1, t.cur.y)){
      t.move('right');
    }      
  }else if (keyCode === DOWN_ARROW) {
    if (!t.is_edge(t.cur.p[t.cur.o], t.cur.x, t.cur.y+1)){
      t.move('down');
    }
  }else if (keyCode === UP_ARROW) {
    t.rotate();
    //if (t.is_collided(t.cur.p[t.cur.o], t.cur.x, t.cur.y)){
    //}
  }else if (keyCode === 32) {
    t.drop();
  }
}