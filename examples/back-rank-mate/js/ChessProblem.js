import './chessboard-1.0.0.min.js'
import {Chess} from './chess.js'

export default class ChessProblem {
                
    constructor(boardId, onUpdate) {
        this.boardId = boardId;
        if(onUpdate!=null)
            this.onUpdate = onUpdate;
        this.points = 0;
        this.GAIN = 2;
        this.PENAL = 1;
        //this.LABEL = this.LABEL.sr;
    }

    boardId;
    game = Chess();
    moveIndex = 0;

    onUpdate(state) {
        console.log(state.status);
        console.log(state.fen);
        console.log("Points:"+state.points);
    };
    
    loadPgn(pgn) {
        this.game.load_pgn(pgn);
        this.moves = Array.from(this.game.history());
        this.comments = Array.from(this.game.get_comments());
        //reset
        this.moveIndex = 0;
        const history_length = this.game.history().length;  
        for(var i=0; i<=history_length; i++) {
            this.game.undo();
        }
        this.points = 0;
        this.goal = Math.floor((this.moves.length+1)/2);
        this.credit = -Math.floor((this.moves.length+1)/2);
        this.GAIN = 1;
    }


    // 1,2->1 3,4->2 5,6-> 3
    getGoal() { return Math.floor((this.moves.length+1)/2); }

    createChessboard() {

        var config = {
            draggable: true,
            position: this.game.fen(),
            orientation: (this.game.turn()==="b")?"black":"white",
            onDragStart: this.onDragStart,
            onDrop: this.onDrop,
            onSnapEnd: this.onSnapEnd
        }
        this.board = Chessboard(this.boardId, config);
        this.updateStatus();
    }


    updateStatus = () => {
        var status = '';
        var end = true;

        var moveColor = this.LABEL.WHITE;
        if (this.game.turn() === 'b') {
            moveColor = this.LABEL.BLACK;
        }

        // checkmate?
        if (this.game.in_checkmate()) {
            status = this.LABEL.GAME_OVER + ', ' + moveColor + this.LABEL._IS_IN_CHECKMATE;
            end = true;
        }

        // draw?
        else if (this.game.in_draw()) {
            status = this.LABEL.GAME_OVER + ',' + this.LABEL.DRAWN_POSITION;
            end = true;
        } else if (this.moves && (this.game.history().length == this.moves.length)) {
            status = this.LABEL.REACHED_END;
            end = true;
        }
        else if (this.points == this.credit) {
            status = this.LABEL.FAILED;
            end = true;
        }
        // game still on
        else {
            status = moveColor + this.LABEL._TO_MOVE;
            end = false;

            // check?
            if (this.game.in_check()) {
                status += ', ' + moveColor + this.LABEL._IS_IN_CHECK
            }
        }

        var history_length = this.game.history().length;
        var isSuccess = this.moves 
                        && (this.game.history().length == this.moves.length)
                        && (this.game.history()[this.moves.length] == this.moves[this.moves.length]);

        var comment = this.game.get_comment();
        if(comment&&comment.trim().startsWith("["))
            comment = null; // Hide annotation comments
        this.onUpdate && this.onUpdate({"status":status,
                                        "fen":this.game.fen(), 
                                        "pgn": this.game.pgn(),
                                        "comment": comment,
                                        "points":this.points,
                                        "goal":Math.ceil(this.moves.length/2),
                                        "finished":end,
                                        "success":isSuccess,
                                        "solution":end?this.moves.join(","):"",
                                        "game": this.game.header()
                                    });
        
    }

    /// Start: Event handlers

    onDragStart = (source, piece, position, orientation) => {
        var game = this.game;
        // do not pick up pieces if the game is over
        if (game.game_over()) return false

        // only pick up pieces for the side to move
        if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
            (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
            return false
        }
    }

    onDrop = (source, target) => {
        // see if the move is legal
        var game = this.game;
        var board = this.board;
        var moves = this.moves;
        var updateStatus = this.updateStatus;

        var move = game.move({
            from: source,
            to: target,
            promotion: 'q' // NOTE: always promote to a queen for example simplicity
        })

        // illegal move
        if (move === null) {
            return 'snapback'
        }

        var nextMove = null;
        if(move.san == moves[this.moveIndex])
        {
            this.points = this.points+this.GAIN;
            //updateStatus();

            nextMove = moves[this.moveIndex+1]; // Take the opponent's half move     
            this.moveIndex=this.moveIndex+2; // Switch to next move 

            var isEnd = this.isEnd();
            if(!isEnd ) {
                var delay = 500;
                if(game.get_comment()&&(!game.get_comment().trim().startsWith("[")))
                    delay = 3000;

                window.setTimeout(function(){
                                    game.move(nextMove); // make opponent move
                                    updateStatus();
                                    board.position(game.fen());
                                }, delay);
            }
            isEnd = true;
        } 
        else {
            this.points = this.points-this.PENAL;
            game.undo(); // We need to undo because a valid move is made.
            updateStatus();
            return 'snapback';
        }

    }

    isEnd = () =>   this.game.in_checkmate()
                    || this.game.in_draw()
                    || (this.moves && this.game.history().length == this.moves.length)

    // update the board position after the piece snap
    // for castling, en passant, pawn promotion
    onSnapEnd = () => {
        this.board.position(this.game.fen())
        this.updateStatus();
    }


    /// End: Event handlers

    LABEL = {   WHITE:"White",
                BLACK: "Black", 
                GAME_OVER_CHECKMATE : 'Game over, checkmate!',
                GAME_OVER_DRAW : 'Game over, drawn position.',
                REACHED_END: 'Reached the end.',
                FAILED: 'Failed!',
                _TO_MOVE: ' to move',
                GAME_OVER: 'Game over',
                _IS_IN_CHECK: ' is in check!',
                _IS_IN_CHECKMATE: ' is in checkmate!'
            };

    LABELS = { "sr": {   WHITE:"Бели",
                        BLACK: "Црни", 
                        GAME_OVER_CHECKMATE : 'Крај, шахмат!',
                        GAME_OVER_DRAW : 'Крај, реми.',
                        REACHED_END: 'Крај проблема.',
                        FAILED: 'Неуспех!',
                        _TO_MOVE: ' на потезу',
                        GAME_OVER: 'Крај',
                        _IS_IN_CHECK: ' је под шахом.',
                        _IS_IN_CHECKMATE: ' је матиран!'
            },
            "sr-lat": {
                        WHITE:"Beli",
                        BLACK: "Crni", 
                        GAME_OVER_CHECKMATE : 'Kraj, šahmat!',
                        GAME_OVER_DRAW : 'Kraj, remi.',
                        REACHED_END: 'Kraj problema.',
                        FAILED: 'Neuspeh!',
                        _TO_MOVE: ' na potezu',
                        GAME_OVER: 'Kraj',
                        _IS_IN_CHECK: ' je pod šahom.',
                        _IS_IN_CHECKMATE: ' je matiran!'
            },
        }

}
