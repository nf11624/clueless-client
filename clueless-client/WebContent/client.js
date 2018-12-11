/**
 *  JavaScript to handle displaying the client
 */
var activePlayers = [1,2];//,3,4,5,6];
var currentPlayer = 1;
var gameOver = false;

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
};

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


makeMove = function() {
	$.ajax({
		method: "POST",
		url: "http://localhost:8080/clueless/move",
		data: { 
			player : currentPlayer,
			room : $('#moveSelect').val(),
			direction : "0"
		}
	}).then(
			function(data) {
				updateStatus(data);
			});
	$('#makeMove').prop('disabled', true);
//	.then(function(data) {
//	console.log(data);
//	$('#moveSelect').empty();
//	currentPlayer = activePlayers[(currentPlayer % activePlayers.length)];
//	setLegalMoves()
//	});
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

function suggest(accuse) {
	var url = "http://localhost:8080/clueless/suggest";
	var targetPlayer = $('input[name=player]:checked').val();
	var targetWeapon = $('input[name=weapon]:checked').val();
	if (accuse === true) {
		url = "http://localhost:8080/clueless/accuse";
	}
	$.ajax({
		method: "POST",
		url : url,
		data : {
			accusingPlayer : currentPlayer,
			accusedPlayer : targetPlayer,
			murderWeapon : targetWeapon
		}
	}).then(function (data) {
		if (accuse) {
			$('#messages').html(data.message);
			if (data.correct === true) {
				// Game ends
				gameOver = true;
			}
			else {
				// Remove the current player from the active player list
				for( var i = 0; i < activePlayers.length-1; i++) { 
					if ( array[i] === currentPlayer) {
						arr.splice(i, 1); 
					}
				}
			}
		}
		else {
			$('#messages').html("Suggestions handled properly next version");
		}
		console.log(data);
		$('#makeMove').prop('disabled', true);
		$('#suggest').prop('disabled', true);
		$('#accuse').prop('disabled', true);
		updateStatus();
//		await sleep(5000);
//		doTurn();
	});

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
		}
		$('#makeMove').prop('disabled', false);
	});
}

function finishTurn() {
//	console.log(data);
	$('#moveSelect').empty();
	currentPlayer = activePlayers[(currentPlayer % activePlayers.length)];
	$('#messages').empty();
	doTurn();
}

function doTurn(data) {
	if (!gameOver) {
		$('#suggest').prop('disabled', false);
		$('#accuse').prop('disabled', false);
		updateStatus();
		setLegalMoves();
	}
}