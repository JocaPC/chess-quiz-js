# Chess quiz js

JavaScript component that enables solving puzzles in a browser. The puzzles must be saved as pgn.

## Usage

1. Copy the content of a folder [src](src) in your project.
2. Optionally, change the files in [src/js](src/js) forder to add newer versions of Checc.js, Chessboard.js, and JQuery libraries.
3. Reference chessboard.css in your page and add your own .js file that wil initialize the board:
```
<link rel="stylesheet" href="css/chessboard-1.0.0.min.css">
<script type="module" src="./js/index.js"></script>

<div id="myBoard" style="width: 400px"></div>
```
Add a <div> element that will hold the chessboard.
  
4. Prepare your pgn files and place them in a folder. See this [example](examples/back-rank-mate/pgn).
5. 
  
```
import ChessQuiz from './ChessQuiz.js';

function updateInfo(info){    
    /* the code that will update the page once something is moved on the board. */   
}

var quiz = new ChessQuiz('myBoard', updateInfo);
quiz.loadFromUri('pgn/{0}.pgn', 40);
// Optionally, registed a callback that will be called if an error happens:
quiz.onError(function(questionId) { alert('Problem ('+ questionId + ') must be skipped!') })
  
await quiz.gotoNextQuestion();
  
```
