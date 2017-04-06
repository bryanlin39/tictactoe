$(document).ready(function(){

var origBoard = [[0,0,0],[0,0,0],[0,0,0]];
var player1 = 'X';
var player2 = 'O';
var cpuPlayer = false;
var activePlayer = player1;
var turn = 0;

function coinFlip(){
  var flip = Math.ceil(Math.random() * 2);
  if (flip===1){
    activePlayer=player1;
    alert('Player 1 is first');
  }
  else if(flip===2&&cpuPlayer===true){
    activePlayer=player1
    alert('Computer is first');
    randomFirstMove();
  }
  else{
    activePlayer=player2
    alert('Player 2 is first');
  }
}

function randomFirstMove(){
  var index = Math.floor(Math.random() * 3);
  var index2 = Math.floor(Math.random() * 3);
  origBoard[index][index2]=player2;
  $('#'+index.toString()+index2.toString()).children().text(player2);
  turn+=1;
}

function swap(){
  if(activePlayer===player1){
    activePlayer = player2;
  }
  else{
    activePlayer = player1;
  }
}

function winCheck(board, player){
  //check for row wins
  var win = false;
  for(i=0;i<3;i++){
    if(board[i][0]===board[i][1]&&board[i][0]===board[i][2]&&board[i][0]!=0){
      if(board[i][0]===player){
        win = true;
      }
    }
  }
  //check for column wins
  for(i=0;i<3;i++){
    if(board[0][i]===board[1][i]&&board[0][i]===board[2][i]&&board[0][i]!=0){
      if(board[0][i]===player){
        win = true;
      }
    }
  }
  //check for diagonal wins
  if(board[0][0]===board[1][1]&&board[0][0]===board[2][2]&&board[0][0]!=0){
    if(board[0][0]===player){
        win = true;
    }
  }
  else if(board[0][2]===board[1][1]&&board[0][2]===board[2][0]&&board[0][2]!=0){
    if(board[0][2]===player){
        win = true;
    }
  }
  return win;
}
function minimax(board, player){
  //determines available spots, adds coordinates to moves array
  var spots = [];
  for(i=0;i<3;i++){
    for(j=0;j<3;j++){
      if(board[i][j]===0){
        spots.push([i,j])
      }
    }
  }
  //checks for win/loss/draw states and returns value
  if(winCheck(board, player1)){
    return {score: -10};
  }
  else if(winCheck(board, player2)){
    return {score: 10};
  }
  else if(spots.length===0){
    return {score: 0};
  }

  //collects move objects
  var moves = [];
  for(i=0;i<spots.length;i++){
    //creates an object and stores the index of empty square
    var move = {};
      move.coordinates = [spots[i][0],spots[i][1]];
    //fills in empty space with X or O
    board[spots[i][0]][spots[i][1]] = player;
    //collects the score from calling minimax on the opponent of player
    if(player === player2){
      var result = minimax(board, player1);
      move.score = result.score;
    }
    else{
      var result = minimax(board, player2);
      move.score = result.score;
    }
    //reset spot to empty
    board[spots[i][0]][spots[i][1]] = 0;
    //push object to moves array
    moves.push(move);
  }

  // if it is the computer's turn loop over the moves and choose the move with the highest score
  var bestMove;
  if(player === player2){
    var bestScore = -10000;
    for(var i = 0; i < moves.length; i++){
      if(moves[i].score > bestScore){
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  else{
    var bestScore = 10000;
    for(var i = 0; i < moves.length; i++){
      if(moves[i].score < bestScore){
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  // return the chosen move (object) from the moves array
  return moves[bestMove];
  }


  var gameOver = false;
  function compTurn(){
    var cellCoord = minimax(origBoard, player2).coordinates;
    if(turn!=9){
      origBoard[cellCoord[0]][cellCoord[1]]=player2;
      var cellId = cellCoord.join("");
      $('#'+cellId).children().text(player2);
    }
    // activePlayer = player1;
    turn+=1;
    if(winCheck(origBoard, player2)){
      alert('Computer wins, you suck. Reset to play again.');
      gameOver = true;
    }
    else if(turn===9){
      alert('Draw. Reset to play again.');
      gameOver = true;
    }

  }

$('.cell').click(function(){
  var split = $(this).attr('id').split("");
  var coord1 = parseInt(split[0]);
  var coord2 = parseInt(split[1]);
  console.log(activePlayer);

  if(origBoard[coord1][coord2]===0&&gameOver===false){
    $(this).children().text(activePlayer);
    origBoard[coord1][coord2] = activePlayer;
    turn+=1;
    console.log(turn);
    if(winCheck(origBoard, activePlayer)){
      alert('You win, congrats. Reset to play again.');
      gameOver = true;
    }
    else if(turn===9){
      alert('Draw. Reset to play again.');
      gameOver = true;
    }

    if(cpuPlayer&&turn!=9){
      compTurn();
    }
    else{
      swap();
    }
  }
});
$('#reset').click(function(){
  origBoard = [[0,0,0],[0,0,0],[0,0,0]]
  $('.cellText').empty();
  gameOver = false;
  turn = 0;
  $('table').hide();
  $('#reset').hide();
  $('#howManyPlayers').show();
  activePlayer = player1;
  cpuPlayer = false;
})

$('#single').click(function(){
  $('table').show();
  $('#reset').show();
  $('#howManyPlayers').hide();
  cpuPlayer = true;
  coinFlip();
});

$('#double').click(function(){
  $('table').show();
  $('#reset').show();
  $('#howManyPlayers').hide();
  coinFlip();
});

});
