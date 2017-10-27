var origBoard; // keep tracks of everything inside the board (X,O,nothing)
const huPlayer = 'O';
const aiPlayer = 'X';
const winCombos= [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 5],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2] 
]

const cells = document.querySelectorAll('.cell');
startGame();

function startGame() {
    document.querySelector('.endgame').style.display = 'none';
    origBoard = Array.from(Array(9).keys());
    /* Remove all the X and O at the begining of the game */
    for (var i = 0; i < cells.length; i++) {
        /* erase the text inside the square */
        cells[i].innerText = '';
        /* remove the background-color of the winner */
        cells[i].style.removeProperty('background-color');
        /* turn on the turnClick function each time we click the squares */
        cells[i].addEventListener('click', turnClick, false);
    }
}

function turnClick(square) {
    // here we check if a square is empty. it's empty when there is a number inside (0 to 8), in that case either the human or the AI can play.
    if (typeof origBoard[square.target.id] == 'number') { 
         // console.log(square.target.id); // shows the id of the square we are clicking.
        // we are calling the turn function to target a square and get the id of this square, only when the human player is clicking
        turn(square.target.id, huPlayer)
        // right after the human the AI must play, we first check if this is a tie, in that cas AI doesn't play
     //  Not applicable[if (!checkTie()) turn(bestSpot(), aiPlayer);] 
        if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
    }
}

function turn(squareId, player) {
    /* on each turn we set the player who just clicked that spot */
    origBoard[squareId] = player;
    /* As we don't see that array, we have to update the display so we can see what we just clicked */
    // we select the element that was just clicked
    document.getElementById(squareId).innerText = player;
    // we pass 2 arguments the origBoard (shows where the X & O are) and the player (to see which player won)
    let gameWon = checkWin(origBoard, player)
    // if we found that the game has been won, call the gameOver function with the gameWon variable.
    if (gameWon) gameOver(gameWon)
}

// the function checkWin shows all the square that have been played.
function checkWin(board, player) {
    // the reduce method is going through every element on the board array and give back one single value == the accumulator (a). We initialize the (a) with an empty array. The (e) is the element that we are going through. (i) is the index.
    let plays = board.reduce((a, e, i) =>
    // if the element equal the player then concat i = take the accumulator array and add the index to that array. If not return the (a) just as it was, don't add anything.
    // if the element equal the player then concat i = take the accumulator array and add the index to that array. If not return the (a) just as it was, don't add anything.
        (e === player) ? a.concat(i) : a, []);
    // if nobody won "gameWon = null"
    let gameWon = null;
    for (let [index, win] of winCombos.entries()) {
        //with win.every, we go through every element on the winCombos array, and we check if plays.indexOf(elem) is more than -1 = it means has the player played in every spot that counts for a win. We go through every possibilities to check a win
        if (win.every(elem => plays.indexOf(elem) > -1)){
            // shows which winCombos was succesful and which player won
            gameWon = { index: index, player: player};
            break; // we break from the function
        } 
    }
    return gameWon;
}

    function gameOver(gameWon) {
        // highlight all the square part of the winning combos
        // prevent the player to click squares anymore as the game is over
        for (let index of winCombos[gameWon.index]) {
            document.getElementById(index).style.backgroundColor =
            // we set the background-color to who won the game, if the human player wins, turn the background-color to blue
//                gameWon.player == huPlayer ? "#FFD39B" : "IndianRed";
                gameWon.player == huPlayer ? "#538F8B" : "#b06699";
        }
        for (var i = 0; i < cells.length; i++) {
            cells[i].removeEventListener('click', turnClick, false);
        }
        // say you won or you lose to the human player
        declareWinner(gameWon.player == huPlayer ? 'You win!' : 'You Lose');
    }

function declareWinner(who) {
    document.querySelector('.endgame').style.display = 'block';
    document.querySelector('.endgame .text').innerText = who;
}

function emptySquares() {
    // we filter every element on the origboard to see if the typeof the element is a number. If yes we return it. squares with number = empty
    return origBoard.filter(s => typeof s == 'number');
}

// to find spot so the AI player could play
function bestSpot() {
    // return emptySquares()[0]; find empty square and return the first spot
    // with the minimax function
    return minimax(origBoard, aiPlayer).index; // calls the minimax function passing origBoard, and the aiPlayer (because is the one playing) and get that index. The result of the minimax function is an object and the '.index', is the index where the aiPlayer should play.
}

function checkTie() {
    // it check if every square is filled up, and is yes + no winner === it's a tie
    if (emptySquares().length == 0) {
        for (var i = 0; i < cells.length; i++) {
            // set the BC of every cells to green
            cells[i].style.backgroundColor = '#E8E8E8';
            // remove the event listener so the user can't click anywhere
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner('Tie Game!')
        return true;
    }
    return false;
}

// we define the minimax function with 2 arguments (newBoard and player)
function minimax(newBoard, player) {
    // then we need to find the indexes of the available spots, using the empty square function and set them to availSpots variable
    var availSpots = emptySquares(newBoard)
    // we check for a terminal state == a winner
    if (checkWin(newBoard, huPlayer)) {
        return {score: -10}; // if 0 win return -10
    } else if (checkWin(newBoard, aiPlayer)){
        return {score: 10};// if X win return 20
    } else if (availSpots.length === 0) {
         return {score: 0}; // the length of the availSpots is 0 = no more room to play = tie game. Return 0
    }
    // we collect the score from  each of the empty spots to evaluate later
    var moves = [];
      // loop through the availSpots, while collecting each moves and spots
        for (var i = 0; i < availSpots.length; i++) {
        var move = {};
            // set the index number of the empty spot that was collected in move to the index property of the move object
            move.index = newBoard[availSpots[i]];
            // set the empty spot on the newBoard to the current player 
            newBoard[availSpots[i]] = player;
            //  call the minimax function with other Player and the newly changed newBoard.
            // if the minimax function doesn't find a terminal state it keeps recursing level by level deeper into the game.
            if (player == aiPlayer) {
                var result = minimax(newBoard, huPlayer);
                move.score = result.score;
            } else {
                var result = minimax(newBoard, aiPlayer);
                move.score = result.score;
            }
            
            newBoard[availSpots[i]] = move.index;
            
            moves.push(move);
    }
    
    // evaluate the bestSpots
    var bestMove;
    if(player === aiPlayer) {
        var bestScore = -10000;
        for(var i = 0; i < moves.length; i++) {
            if(moves[i].score > bestScore) { // if +++ possibilities keep the first one
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        var bestScore = 10000;
            for(var i = 0; i < moves.length; i++) {
                if(moves[i].score < bestScore) { // this time check the lowest score 
                    bestScore = moves[i].score;
                    bestMove = i;
        }
    }
}

return moves[bestMove];
    
}






