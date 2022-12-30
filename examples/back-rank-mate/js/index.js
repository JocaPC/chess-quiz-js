import ChessQuiz from './ChessQuiz.js';

function updateInfo(info){    
    $('#status').html(info.status);
    $('#questionId').html(info.questionId);
    $('#points').html(info.points);
    $('#goal').html(info.goal);
    $('#comment').html(info.comment);
    $('#score').html(info.total_points + "/" + info.quiz_goal);
    $('#solution').html(info.finished&&!info.success&&"("+info.solution+")");   
    if(info.finished)
      $("#next").show();
    else 
      $("#next").hide();    
}

var quiz = new ChessQuiz('myBoard', updateInfo);
quiz.loadFromUri('pgn/{0}.pgn', 40);
quiz.onError(function(questionId) { alert('Problem ('+ questionId + ') mora da se preskoči.') })
await quiz.gotoNextQuestion();

$("#next").click(function(){ quiz.gotoNextQuestion() })
$("#next").hide();