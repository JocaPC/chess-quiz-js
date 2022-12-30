import ChessProblem from './ChessProblem.js';

export default class ChessQuiz {

    points = 0;
    goal = 0;

    onUpdate = (info) => { 
        if(info.finished) {
            this.points += info.points;
            info.total_points = this.points;
        } else {
            info.total_points = this.points + info.points;
        }
        info.questionId = this.index;
        info.quiz_goal = this.goal;
        this.onUpdateCallback(info);
    }
    
    constructor(boardId, onUpdate){
        this.goal = 0;
        this.points = 0;
        this.onUpdateCallback = onUpdate;
        this.problem = new ChessProblem(boardId, this.onUpdate);
    }

    onError(callback) {
        this.onError = callback;
    }

    async gotoNextQuestion(){
        try {
            var pgn;
            if (this.pgnArray!=null) {
                if (this.index<this.pgnArray.length) {
                    pgn = this.pgnArray[this.index++];
                    this.problem.loadPgn(pgn);
                    this.problem.createChessboard();

                    this.goal += this.problem.getGoal();
                    this.problem.updateStatus();    
                }
            } else if (this.uri!=null) {
                if (this.index<this.questionCount) {
                    var uri = this.uri.replace("{0}",this.index++);
                    var res = await fetch(uri).then((response) => {
                        if (response.status >= 400 && response.status < 600) {
                          throw new Error("Cannot load response from server");
                        }
                        return response;})
                    var pgn = await res.text();
                    this.problem.loadPgn(pgn);
                    this.problem.createChessboard();
                    
                    this.goal += this.problem.getGoal();
                    this.problem.updateStatus();   
                
                }
            }
        } catch (ex) {
            this.onError(this.index);
            this.gotoNextQuestion();
        }
    }

    loadFromUri(uri, total) {
        this.index = 0;
        this.uri = uri; 
        this.questionCount = total;
    }

    loadFromPgnArray(pgnArray) {
        this.index = 0;
        this.pgnArray = pgnArray;
        this.questionCount = pgnArray.length;
    }
}