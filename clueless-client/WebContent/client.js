/**
 *  JavaScript to handle displaying the client
 */
var activePlayers = [1,2];//,3,4,5,6];
var currentPlayer = 1;

$(document).ready(function() {
	initGame();
	
});

updateStatus = function(status) {
	$.ajax({
		method: "GET",
		url: "http://localhost:8080/clueless/status",
		data: { 
			currentPlayer : currentPlayer,
		}
	}).then(function(data) {
		$('#summaryTable').empty();
		$('#weaponStatusTable').empty();
		$('#statusTable').empty();
		//#summaryTable - all players and locations
		for (var i = 0; i < data.players.length; i++){
			$('#summaryTable').append("<tr><td>" + data.players[i].name + "</td><td>" +
					data.players[i].location.name + "</td></tr>");
		}
		//#weaponStatusTable - weapon locations
		for (var i = 0; i < data.weapons.length; i++){
			$('#weaponStatusTable').append("<tr><td>" + data.weapons[i].name + "</td><td>" +
					data.weapons[i].location + "</td></tr>");
		}
		$('#currPlayerName').empty().append(data.currentPlayer.name);
		$('#currPlayerLoc').empty().append(data.currentPlayer.location.name);
		for (var i = 0; i < data.currentPlayer.playerCardsDTO.length; i++) {
			$('#statusTable').append("<tr><td>" + data.currentPlayer.playerCardsDTO[i].name + "</td></tr>");
		}
	});
}

func1 = function() {
	updateStatus("Some message could go here?");
}

makeMove = function() {
	$.ajax({
		method: "POST",
		url: "http://localhost:8080/clueless/move",
		data: { 
			player : currentPlayer,
			room : $('#moveSelect').val(),
			direction : "0"
		}
	}).then(function(data) {
		console.log(data);
		$('#moveSelect').empty();
		currentPlayer = activePlayers[(currentPlayer % activePlayers.length)];
		setLegalMoves()
	});
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
	}).then(updateStatus());
}

function setLegalMoves() {
	$.ajax({
		method: "GET",
		url: "http://localhost:8080/clueless/moves",
		data: {
			player : currentPlayer
		}
	}).then(function(data) {
		for (var i = 0; i < data['legalMoves'].length; i++) {
			var opt = new Option(data['legalMoves'][i].name, data['legalMoves'][i].name);
			$('#moveSelect').append(opt);
			updateStatus();
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