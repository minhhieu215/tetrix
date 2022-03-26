const cvs = document.getElementById("tetris")
const ctx = cvs.getContext("2d")
let score =0;
const ROW =20;
const COL =COLUMN= 10;
const SQ = squareSize =20;
const VACANT = "WHITE" ; //Color of an empty square

// Draw a square
function drawSquare(x,y,color){
    // Mau o vuong
    ctx.fillStyle = color;
    ctx.fillRect(x*SQ,y*SQ,SQ,SQ);
    // Khung vien
    ctx.strokeStyle="black"
    ctx.strokeRect(x*SQ,y*SQ,SQ,SQ)
}
drawSquare(0,0,"red")

// Create the board
let board =[];
for( r=0 ; r<ROW ; r++){
    board[r]=[]
        for(c =0 ; c< COL ; c++){
            board[r][c] =VACANT
        }
}
// Draw the board
function drawBoard(){
    for( r=0 ; r<ROW ; r++){
            for(c =0 ; c< COL ; c++){
                drawSquare(c,r,board[r][c])
            }
    }
}
drawBoard()
// the pieces and their colors
const PIECES = [
    [Z,"red"],
    [S,"black"],
    [T,"yellow"],
    [O,"blue"],
    [L , "purple"],
    [I,"cyan"],
    [J,"orange"],
]
// Generate random pieces
function randomPiece(){
    let r = randomN = Math.floor(Math.random()*PIECES.length)
    return new Piece(PIECES[r][0],PIECES[r][1])
}
// initate a piece
let p  = randomPiece()
// The object piece
function Piece(tetromino,color){
    this.tetromino =tetromino;
    this.color = color 
    this.tetrominoN =0;
    this.activeTetromino = this.tetromino[this.tetrominoN]
    // We need to control the pieces 
    this.x = 4;
    this.y = -2 ;

}
// fill function 
Piece.prototype.fill =function(color){
    for( r=0 ; r<this.activeTetromino.length ; r++){
        for(c =0 ; c< this.activeTetromino.length ; c++){
            // We draw only occupied 
            if(this.activeTetromino[r][c]){
                drawSquare(this.x+c,this.y+r, color);
            }
        }
}
}
// draw a piece to the board
Piece.prototype.draw =function(){
    this.fill(this.color)
}
// undraw function
Piece.prototype.unDraw =function(){
    this.fill(VACANT)
}
// Move down the piece
Piece.prototype.moveDown = function(){
    if(!this.collision(0,1,this.activeTetromino)){

        this.unDraw()
        this.y++;
        this.draw()
    }else {
        // We lock the piece and generate a new one
        this.lock()
        p= randomPiece()
        
    }
}
// Move Right
Piece.prototype.moveRight = function(){
    if(!this.collision(1,0,this.activeTetromino)){

    this.unDraw()
    this.x++;
    this.draw()
    }else{}
}
// Move Left
Piece.prototype.moveLeft = function(){
    if(!this.collision(-1,0,this.activeTetromino)){

    this.unDraw()
    this.x--;
    this.draw()
    }
}
// Move Rotate
Piece.prototype.rotate = function(){
    let nextPattern = this.tetromino[(this.tetrominoN+1)%this.tetromino.length]
    let kick =0;

    if(this.collision(0,0,nextPattern)){
        if(this.x>COL/2){
            // right wall
            kick =-1;
        }else {
            // left wall
            kick =1;
        }
    }
    if(!this.collision(kick,0,nextPattern)){

    this.unDraw()
    this.x +=kick;
    this.tetrominoN=(this.tetrominoN+1)%this.tetromino.length;
    this.activeTetromino=this.tetromino[this.tetrominoN]
    this.draw()
    }
}
// Control the piece
document.addEventListener("keydown",CONTROL);
function CONTROL (e){
    if(e.keyCode ==37){
        p.moveLeft()
    }else if(e.keyCode==38){
        p.rotate()
    }else if(e.keyCode==39){
        p.moveRight()
    }else if(e.keyCode==40){
        p.moveDown()
    }
}
// Collision ( va cham )
Piece.prototype.collision= function(x,y,piece){
    for( r=0 ; r<piece.length ; r++){
        for(c =0 ; c< piece.length ; c++){
            // if the square is empty , we skip it
            if(!piece[r][c]){
                continue;
            }
            // coordinates of the piece after movement
            let newX = this.x +c+x;
            let newY = this.y+r+y;
            // condition
            if(newX<0||newX>=COL || newY>=ROW){
                return true
            }
            // Skip newY <0 ; board[-1] will crush
            if(newY <0 ){
                continue;
            }
            // check if there is a locked piece
            if(board[newY][newX] !=VACANT){
                return true;
            }
        }
}
}
// Lock function
Piece.prototype.lock = function(){
    for( r=0 ; r<this.activeTetromino.length ; r++){
        for(c =0 ; c< this.activeTetromino.length ; c++){
            if(!this.activeTetromino[r][c]){
                continue
            }
            // Lock the pices 
            if(this.y +r<0){
                alert("Game over")
                // stop request animation frame
                gameOver = true;
                break;
            }
            board[this.y+r][this.x+c]= this.color ;
        }
}
// remove full rows 
for (r=0;r<ROW ;r++){
    let isRowFull = true;
    for(c=0;c<COL;c++){
        isRowFull =isRowFull && (board[r][c]!=VACANT)
    }
    if(isRowFull){
        // if the row is full
        // we move all the rows above it down 
        for(y=r; y>1;y--){
            for(c=0;c<COL;c++){
            board[y][c]=board[y-1][c]
            }
        }
        // the top row board [0][..] has no row above it 
        for(c=0;c<COL;c++){
        board[0][c]=VACANT;
            }
            // Incement the score
            score+=10;
    }
}
drawBoard()
}
// Drop
let dropStart =Date.now()
let gameOver = false;
function drop(){
    let now = Date.now()
    let delta = now - dropStart ;
    if(delta>1000){
        p.moveDown()
        dropStart =Date.now()
    }
    if(!gameOver){
        requestAnimationFrame(drop)
    }
}
drop()