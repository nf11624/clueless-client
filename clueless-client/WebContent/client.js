/**
 *  JavaScript to handle displaying the client
 */
var activePlayers = [1,2,3,4,5,6];
var currentPlayer = 1;

$(document).ready(function() {
	initGame();
	
});

updateStatus = function(status) {
	if (status.hasOwnProperty('statusMessage')) {
		$('#game_status').html(status.statusMessage);
	}
	else {
		$('#game_status').html(status);
	}
}

func1 = function() {
	updateStatus("Some message could go here?");
}

makeMove = function() {
	$.ajax({
		method: "POST",
		url: "http://localhost:8080/clueless/move",
		data: { 
			player : "1",
			room : "study",
			direction : "0"
		}
	}).then(function(data) {
		console.log(data);
		
	})
}

initGame = function() {
	$.ajax({
		method: "POST",
		url: "http://localhost:8080/clueless/init",
		data: {
			gameName: "TEST GAME FROM FF"
		}
	}).then(function(data) {
		setLegalMoves();
	});	
}

function setLegalMoves() {
	$.ajax({
		method: "GET",
		url: "http://localhost:8080/clueless/moves",
		data: {
			player : "1"
		}
	}).then(function(data) {
		for (var i = 0; i < data[legalMoves].length; i++) {
			$('#moveSelect').append($('<option>', {
				value : data[legalMoves][i][0].roomName,
				text : datum[legalMoves][i][0].roomName
			}));
		}
	});
}

function doTurn(data) {
	$.ajax({
		method: "POST",
		url: "http://localhost:8080/clueless/getStatus",
		data: {
			gameName: "TEST GAME FROM FF"
		}}).then(function(data) {
			updateStatus(data);
			$.ajax({
				method: "GET",
				url: "http://localhost:8080/clueless/moves",
				data: {
					player : currentPlayer
				}
			}).then(function(data) {
				nextTurn(data);
			})
		})
}