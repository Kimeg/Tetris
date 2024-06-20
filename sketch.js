let t;
function initialize(){
  var ORANGE = color(255,165,0);
  var TEAL = color(63, 224, 208);
  var WHITE = color(255, 255, 255);
  var GREEN = color(0,255,0);
  var BLUE = color(0,0,255);
  var RED = color(255, 0, 0);
  var PURPLE = color(150,0,150);
  var YELLOW = color(255,255,0);
  COLORS = [ORANGE, BLUE, YELLOW, RED, GREEN, PURPLE, TEAL];
  TEMPLATE = [L, J, S, N, Z, T, I];
}

function setup() {
  createCanvas(tHEIGHT, tHEIGHT);
  
  initialize();
  t = new Tetris();
  t.initialize();
  
}

function draw() {
  background(0);
  t.display();
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    if (!t.is_edge(t.cur.x-1, t.cur.y) &&
       !t.is_collided(t.cur.x-1, t.cur.y)){
      t.move('left');
    }
  } else if (keyCode === RIGHT_ARROW) {
    if (!t.is_edge(t.cur.x+1, t.cur.y) &&
        !t.is_collided(t.cur.x+1, t.cur.y)){
      t.move('right');
    }      
  }else if (keyCode === DOWN_ARROW) {
    if (!t.is_edge(t.cur.x, t.cur.y+1) &&
        !t.is_collided(t.cur.x, t.cur.y+1)){
      t.move('down');
    }
  }else if (keyCode === UP_ARROW) {
    t.rotate();
    if (t.is_collided(t.cur.p[t.cur.o], t.cur.x, t.cur.y)){
      if (t.collided_from == 'left'){
        t.move('right');
      }else if (t.collided_from =='right'){
        t.move('left');
      }
      t.collided_from = null;
    }
  }else if (keyCode === 32) {
    t.drop();
    t.shifted = false;
  }else if (keyCode === 16) {
    if (!t.shifted){
      t.shift();
    }
  }
  t.check_full_row();
  t.make_shadow();
}