# Chess quiz js

JavaScript component that enables solving puzzles in a browser. The puzzles must be saved as pgn.

## Usage

1. Copy the content of a folder [src](src) in your project. This folder contains .css, .js and image files needed for the chessboard.
2. Optionally, change the files in [src/js](src/js) folder to add newer versions of Chess.js and Chessboard.js files.
3. Reference chessboard.css in your page and add your own .js file (for example index.js) that will initialize the board:
```
<link rel="stylesheet" href="css/chessboard-1.0.0.min.css">
<script type="module" src="./js/index.js"></script>

<div id="myBoard" style="width: 400px"></div>
```
Here you need to add a `<div>` element that will hold the chessboard.
  
4. Prepare your pgn files and place them in a folder. See this [example](examples/back-rank-mate/pgn).
5. Initialize ChessQuiz
    - Import ChessQuiz.js module in your JavaScript file using `import ChessQuiz from './ChessQuiz.js'`
    - Define our own `updateInfo()` function that will update the page when something happens on the board. See [example here](https://github.com/JocaPC/chess-quiz-js/blob/main/examples/back-rank-mate/js/index.js#L3)
    - Create a chess quiz by providing the id of the `<div>` element that will contain the board, and a function that will react on the board events.
    - Optionally, register an event handler what will be called if a questions cannot be loaded.
    - Start a quiz by going to the next question using `await quiz.gotoNextQuestion();` call.

Here is an example of usage:
```
import ChessQuiz from './ChessQuiz.js';

function updateInfo(info){    
    /* the code that will update the page once something is moved on the board. */   
}

var quiz = new ChessQuiz('myBoard', updateInfo);
quiz.loadFromUri('pgn/{0}.pgn', 40); //-> Uri of pgns and total number of questions.

// Optionally, registed a callback that will be called if an error happens:
quiz.onError(function(questionId) { alert('Problem ('+ questionId + ') must be skipped!') })
  
await quiz.gotoNextQuestion();
```

This is how it works: https://chessquiz.blob.core.windows.net/$web/back-rank-mate/index.html
