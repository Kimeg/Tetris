let WIDTH = 400;
let HEIGHT = 400;
let tWIDTH = 300;
let tHEIGHT = 600;
let TILESIZE = tWIDTH / 10;
let MINISIZE = tWIDTH / 20;
let offset = tHEIGHT/4;

class Tetris {
  constructor() {
    this.cur = null
    this.temp = null;
    this.queue = [];
    this.ground = [];
    this.shifted = false;
    this.shadow = null;
    
    this.collided_from = null;
  }

  initialize() {
    for (let i = 0; i < 5; i++) {
      this.queue.push(new Piece(3, 0));
    }

    this.cur = this.queue[0];
    for (let i = 0; i < 10 * tHEIGHT / tWIDTH; i++) {
      var temp = [];
      for (let j = 0; j < 10; j++) {
        temp.push(0);
      }
      this.ground.push(temp);
    }
    this.shadow = this.cur;
  }

  next() {
    this.queue.shift();
    this.queue.push(new Piece(3, 0));
    this.cur = this.queue[0];
  }

  move(dir) {
    if (dir == 'left') {
      this.cur.x--;
    } else if (dir == 'right') {
      this.cur.x++;
    } else if (dir == 'up') {
      this.cur.y--;
    } else if (dir == 'down') {
      this.cur.y++;
    }
  }

  bounce(){
    var n = this.cur.p[0].length;
    var collided = true;
    
    while (collided){
      var flag = false;
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (this.cur.p[this.cur.o][i][j] == 0) {
            continue;
          }

          if (this.cur.x+j < 0){
            this.cur.x++;
          }else if (this.cur.x+j >= 10){
            this.cur.x--;
          }
        }
      }
      collided = false;
    }
  }
  
  rotate(clockwise=true) {
    var dir = 1;
    if (!clockwise){
      dir = -1;
    }
    var _next = this.cur.o + dir
    if (_next == -1){
      _next = this.cur.p.length-1;
    }
    this.cur.o = _next % this.cur.p.length;
    this.bounce();
  }
  
  shift () {
    var temp = this.temp;
    this.temp = this.cur;

    if (temp == null) {
      this.next();
    } else {
      var x = this.cur.x;
      var y = this.cur.y;
      this.cur = temp;
      this.cur.x = x;
      this.cur.y = y;
    }
    this.bounce();
    this.shifted = true;
  }

  drop() {
    var collided = false;
    var hit_edge = false;
    var hit_block = false;
    while (!collided) {
      hit_edge = this.is_edge(this.cur.x, this.cur.y + 1);
      hit_block = this.is_collided(this.cur.x, this.cur.y + 1);
      if (hit_edge || hit_block) {
        collided = true;
        //this.move('up');
        break;
      }
      this.move('down');
    }
    var n = this.cur.p[0].length;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (this.cur.p[this.cur.o][i][j] == 0) {
          continue;
        }
        //console.log(this.cur.x,this.cur.y);
        this.ground[this.cur.y+i][this.cur.x+j] = this.cur.c;
      }
    }
    
    this.next();
  }

  is_edge(x, y) {
    var n = this.cur.p[0].length;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (this.cur.p[this.cur.o][i][j] == 0) {
          continue;
        }

        if ((x + j) >= 10 || (y + i) >= 10 * (tHEIGHT / tWIDTH) ||
          (x + j) < 0 || (y + i) < 0) {
          return true;
        }
      }
    }
    return false;
  }

  is_collided(x, y) {
    var leftmost = Infinity;
    var rightmost = -Infinity;
    var n = this.cur.p[0].length;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        var p = this.cur;
        if (p.p[this.cur.o][i][j] == 0) {
          continue;
        }
        if (leftmost > j){
          leftmost = j;
        }
        if (rightmost < j){
          rightmost = j;
        }
        if (y+i < this.ground.length && x+j < this.ground[0].length){
          if (this.ground[y+i][x+j] == 0) {
             continue;
          }
          
          if (j <= leftmost){
            //console.log('a');
            this.collided_from = 'left';
          }else if (j >= rightmost){
            //console.log('b');
            this.collided_from = 'right';
          }
          return true;
        }
      }
    }
    return false;
  }
  
  make_shadow(){
    var n = this.cur.p[0].length;
    var x = this.cur.x;
    var y = this.cur.y;
    var collided = false;
    while (!collided){
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          var p = this.cur;
          if (p.p[this.cur.o][i][j] == 0) {
            continue;
          }

          if (y+i < this.ground.length && x+j < this.ground[0].length){
            if (this.ground[y+i][x+j] == 0) {
               continue;
            }
            this.shadow = new Piece(x, y);
            this.shadow.x = x;
            this.shadow.y = y-1;
            this.shadow.c = this.cur.c;
            this.shadow.p = this.cur.p;
            this.shadow.o = this.cur.o;
            return;
          }else{
            this.shadow = new Piece(x, y);
            this.shadow.x = x;
            this.shadow.y = y-1;
            this.shadow.c = this.cur.c;
            this.shadow.p = this.cur.p;
            this.shadow.o = this.cur.o;
            return;
          }
        }
      }
      y++;
    }
  }
  
  check_full_row(){
    var empty = false;
    var bot = this.ground.length-1;
    while (!empty){
      if (bot == 0){
        break;
      }
      
      var count = countElement(this.ground[bot], 0);
      if (count < this.ground[0].length){
        if (count==0){
          for (let i=0; i<bot;i++){
            this.ground[bot-i] = this.ground[bot-(i+1)];
          }
        }else{
          bot -= 1;
        }
      }else{
        empty=true;
      }
      //empty = true;
    }
  }
  
  display() {
    var n = this.cur.p[0].length;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (this.cur.p[this.cur.o][i][j] == 0) {
          continue;
        }
        noStroke();
        fill(this.cur.c);
        rect(offset+TILESIZE * (this.cur.x + j), TILESIZE * (this.cur.y + i), TILESIZE, TILESIZE);
        this.cur.c.setAlpha(100);
        fill(this.cur.c);
        rect(offset+TILESIZE * (this.shadow.x + j), TILESIZE * (this.shadow.y + i), TILESIZE, TILESIZE);
        this.cur.c.setAlpha(255);
      }
    }


    for (let i = 0; i < 10*tHEIGHT/tWIDTH; i++) {
      for (let j = 0; j < 10; j++) {
        if (this.ground[i][j] == 0) {
          continue;
        }
        //console.log('x');
        noStroke();
        fill(this.ground[i][j]);
        
        rect(offset+TILESIZE * j, TILESIZE * i, TILESIZE, TILESIZE);
      }
    }


    var ind = 0;
    for (var piece of this.queue) {
      if (ind == 0) {
        ind++;
        continue;
      }

      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (piece.p[piece.o][i][j] == 0) {
            continue;
          }
          stroke(255);
          fill(piece.c);
          rect(offset+tWIDTH + MINISIZE*(2+j), MINISIZE * (piece.y + i) + 5 * MINISIZE * ind, MINISIZE, MINISIZE);
        }
      }
      ind++;
    }

    if (this.temp !=null){
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (this.temp.p[piece.o][i][j] == 0) {
            continue;
          }
          stroke(255);
          fill(this.temp.c);
          rect(MINISIZE*(2+j), MINISIZE * (piece.y + i), MINISIZE, MINISIZE);
        }
      }
    }
    
    draw_grid();
  }


}

class Piece {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    
    var rand = int(random(TEMPLATE.length));
    this.p = TEMPLATE[rand];
    this.c = COLORS[rand];
    this.o = 0;
  }
}

function draw_grid() {
  for (let i = 0; i < 10 * tHEIGHT / tWIDTH; i++) {
    stroke(255);
    if (i < 11) {
      line(offset+TILESIZE * i, 0, offset+TILESIZE * i, tHEIGHT);
    }
    line(offset, TILESIZE * i, offset+tWIDTH, TILESIZE * i);

  }
}

function countElement(arr, e){
  var count = 0;
  for (var v of arr){
    if (v==e){
      count++;
    }
  }
  return count;
}