var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");


canvas.addEventListener("mousedown", handleMenuClicks, false);
canvas.addEventListener("touchstart", handleMenuClicks, false);
canvas.addEventListener("mouseup", handleRelease, false);
canvas.addEventListener("touchend", handleRelease, false);
canvas.addEventListener("mousemove", handleMouseMove, false);
canvas.addEventListener("touchmove", handleMouseMove, false);
document.addEventListener("keydown", handleGameKeysDown, false);
document.addEventListener("keyup", handleGameKeysUp, false);

var size = 10;
var key = {left: false, right: false, up: false, down: false};
var playingGame = false;
var showingHighScores = false;
var playSmooth = true;

var wallColor = "#C69354";
var bgColor = "#00254C";
var menuColor = wallColor;
var rainbowColors = ["#F49AC2","#AEC6CF","#77BE77","#CFCFC4","#FDFD96","#826953"];

var sixButton = {x: 50, y: 225, width: 100, height: 50, color: "#C69354"};
var tenButton = {x: 200, y: 225, width: 100, height: 50, color: "#C69354"};
var fourteenButton = {x: 350, y: 225, width: 100, height: 50, color: "#C69354"};
var hsButton = {x: 200, y: 425, width: 100, height: 50, color: "#008800"};
var jsSquare = {x: 260, y: 125, width: 50, height: 50, color: "#F1DA4E"};

var playerSymbol = {x: 50, y: 50, width: 50, height: 50, color: "#FFFFFF"};
var objectiveSymbol = {x: 350, y: 50, width: 50, height: 50, color: "#FF0000"};

var playerMenuRect = {x: 50, y: 325, width: 50, height: 50, color: "#FFFFFF"};
var objectiveMenuRect = {x: 400, y: 325, width: 50, height: 50, color: "#ff0000"};
var playerMenu = new playerSquare(playerMenuRect);
var objectiveMenu = new square(objectiveMenuRect);
var menuSpeed = 2;

var cachedScores = {};
var enteringHighScore = false;
var validatedToken = "";
var highScoreName = "";
var highScoreAchieved = false;
var highScoreDetermined = false;
var justLost = true;

function resetGame() {
    menuSpeed = 2;
    playingGame = false;
    enteringHighScore = false;
    highScoreAchieved = false;
    highScoreDetermined = false;
    justLost = true;
    validatedToken = "";
    highScoreName = "";
    showingHighScores = false;
    level = 1;
    lost = false;
    score = 0;
    lowestTime = getStartingMinTimeBasedOnSize(size);
    milliseconds = 0;
    size = 10;
    allowed = getMaxTimeBasedOnSize(size);
    seconds = allowed;
    pathway = new map({width: size, height: size});
    playerSymbol = {x: 50, y: 50, width: 50, height: 50, color: "#FFFFFF"};
    objectiveSymbol = {x: 350, y: 50, width: 50, height: 50, color: "#FF0000"};
 
    player = new playerSquare(playerSymbol);
    wallPos = [];
    walls = addWalls();
    pathway.addWalls(wallPos);
    objective = new square(objectiveSymbol);

    playerMenuRect = {x: 50, y: 325, width: 50, height: 50, color: "#FFFFFF"};
    objectiveMenuRect = {x: 400, y: 325, width: 50, height: 50, color: "#ff0000"};
    playerMenu = new playerSquare(playerMenuRect);
    objectiveMenu = new square(objectiveMenuRect);

    xMouseMovement = 0;
    yMouseMovement = 0;
    isMouseDown = 0;
    curMouseEvent = null;
    resetScreen();
    clearInterval(timerInterval);
    drawAll();
}

function getMaxTimeBasedOnSize(size) {
    if (size === 6) {
        return 6;
    } else if (size === 10) {
        return 6.25;
    } else if (size === 14) {
	   return 6.5;
    }
}
function getStartingMinTimeBasedOnSize(size) {
    if (size === 6) {
        return 3;
    } else if (size === 10) {
        return 3.25;
    } else if (size === 14) {
       return 3.5;
    }
}
var timerInterval;
var level = 1;

var score = 0;
var lowestTime = getStartingMinTimeBasedOnSize(size);
var milliseconds = 0;
var allowed = getMaxTimeBasedOnSize(size);
var seconds = allowed;
var pathway = new map({width: size, height: size});
var player = new playerSquare(playerSymbol);
var wallPos = [];
var walls = addWalls();
pathway.addWalls(wallPos);
var objective = new square(objectiveSymbol);

var xMouseMovement = 0;
var yMouseMovement = 0;
var isMouseDown = 0;
var curMouseEvent = null;
var lost = false;

const welcomeMessage = "CUBE HUNT";
const sixLabel = "Mini";
const tenLabel = "Normal";
const fourteenLabel = "Massive";
const smoothLabel = "Smooth";
const pureJsPureLabel = "Pure";
const pureJsJsLabel = "JS";
var timeLabel = "0.0";
var scoreLabel = "0";
const smoothBasePlayerSpeed = 6;

setInterval(gameLoop, 10);

function gameLoop() {
    if (playingGame) {
        if (!lost) {
        	if (seconds <= 0) { 
        		lost = true; 
        	} else {
            	playGame(playSmooth)
            }
        } else {
            if (justLost) {
                drawWalls()                
                timeLabel = 0.0
                ctx.fillStyle = "#000000";
                ctx.font = "16px Arial";
                ctx.fillText(timeLabel, (canvas.width / 2) - 10, (canvas.height / 2) - 10);
                ctx.fillText(scoreLabel, (canvas.width / 2) - 10, (canvas.height / 2) + 10);
                drawDeterminingHighScore();
                highScoreAchieved = checkForHighScore(score, size);
            }
            justLost = false;
        }
    } else {

    }
    requestAnimationFrame(drawAll);
}

function drawRect(rect) {
    ctx.beginPath();
    ctx.rect(rect.x, rect.y, rect.width, rect.height);
    ctx.fillStyle = rect.color;
    ctx.fill();
}


function checkClickInRect(x, y, rect) {
    if (x >= rect.x && x <= rect.x + rect.width) {
        if (y >= rect.y && y < rect.y + rect.height) {
            return true;
        }
    }
    return false;
}

function getMousePos(c, evt) {
    var rect = c.getBoundingClientRect();
    if (typeof evt.clientX !== 'undefined') {
        return {
            x: (evt.clientX - rect.left) / (rect.right - rect.left) * c.width,
            y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * c.height
        };
    } else {
        return {
            x: (evt.touches[0].clientX - rect.left) / (rect.right - rect.left) * c.width,
            y: (evt.touches[0].clientY - rect.top) / (rect.bottom - rect.top) * c.height
        };
    }
}

function handleRelease(event) {
    isMouseDown = false;
}

function handleMouseMove(event) {
    if (playingGame && isMouseDown) {
        curMouseEvent = event;
        return;
    }
}

function handleMenuClicks(event) {
    
    if (playingGame) {
        isMouseDown = true;
        curMouseEvent = event;
        return;
    }
    mp = getMousePos(canvas, event);
    x =  mp.x;
    y = mp.y;
    if (checkClickInRect(x, y, sixButton)) {
        size = 6;
        playingGame = true;
        canvas.width = 300;
        canvas.height = 300;
        setGame();
    }
    else if (checkClickInRect(x, y, tenButton)) {
        size = 10;
        playingGame = true;
        canvas.width = 500;
        canvas.height = 500;
        setGame();
    }
    else if (checkClickInRect(x, y, fourteenButton)) {
        size = 14;
        playingGame = true;
        canvas.width = 700;
        canvas.height = 700;
        setGame();
    }
    else if (checkClickInRect(x, y, hsButton)) {
        cachedScores = getAllTimeScores()
        showingHighScores = true;
    }
}

function resetScreen() {
    canvas.width = 500;
    canvas.height = 500;
}

function handleGameKeysDown(e) {
    if (enteringHighScore) {
        if (e.keyCode === 13) {
            if (highScoreName.length > 20) {
                highScoreName.substring(0, 19);
            }
            submitHighScore(score, highScoreName, size, validatedToken);
            resetGame();
        } else if (e.keyCode == 37 && highScoreName.length > 0) {
            highScoreName = highScoreName.substring(0, highScoreName.length - 1);
        } else if((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 65 && e.keyCode <= 90)) {
            if (highScoreName.length === 20) { return; }
            highScoreName += e.key;

        }
        return;
    }
    if (e.keyCode === 27) {
        playingGame = false;
        resetGame();
        return;
    }
    if((e.key == "Right" || e.key == "ArrowRight" || e.key == "d") && (playSmooth || key.right === false)) {
        key.right = true;
        if (!playSmooth) {
            return;
        }
    }
    if((e.key == "Left" || e.key == "ArrowLeft" || e.key == "a") && (playSmooth || key.left === false)) {
        key.left = true;
        if (!playSmooth) {
            return;
        }
    }
    if((e.key == "Up" || e.key == "ArrowUp" || e.key == "w") && (playSmooth || key.up === false)) {
        key.up = true;
        if (!playSmooth) {
            return;
        }
    }
    if((e.key == "Down" || e.key == "ArrowDown" || e.key == "s") && (playSmooth || key.down === false)) {
        key.down = true;
        if (!playSmooth) {
            return;
        }
    }
}

function handleGameKeysUp(e) {
    if(e.key == "Right" || e.key == "ArrowRight" || e.key == "d") {
        key.right = false;
    }
    if(e.key == "Left" || e.key == "ArrowLeft" || e.key == "a") {
        key.left = false;
    }
    if(e.key == "Up" || e.key == "ArrowUp" || e.key == "w") {
        key.up = false;
    }
    if(e.key == "Down" || e.key == "ArrowDown" || e.key == "s") {
        key.down = false;
    }
}

function doRectsCollide(rect1, rect2) {
    if (rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y) {
         return true;
     }
     return false;
}

function resetKeys() {
    if(playSmooth && !isMouseDown) { return; }
    key.right = false;
    key.left = false;
    key.up = false;
    key.down = false;
}

function getDistTweenMouseAndPlayer(mousePos, playerPos) {
    var xDist = Math.pow(mousePos.x - playerPos.x, 2);
    var yDist = Math.pow(mousePos.y - playerPos.y, 2);
    return Math.sqrt(xDist + yDist);
}

function getMaxDistanceBySize() {
    return Math.sqrt(Math.pow(canvas.width, 2) + Math.pow(canvas.height, 2));
}

function getMinTimeBasedOnSize(size) {
    if (size === 6) {
        return 1.00;
    } else if (size === 10) {
        return 1.33;
    } else if (size === 14) {
        return 1.66;
    }
}

function getMousePlayerSpeed() {
    var distance = getDistTweenMouseAndPlayer(getMousePos(canvas, curMouseEvent), player.returnPos());
    var minSpeed = 3;
    var maxSpeed = 7;
    var maxDistance = getMaxDistanceBySize();
    var multiplier = 3.1415;
    var speed = smoothBasePlayerSpeed * multiplier * (distance / maxDistance);
    speed = speed > maxSpeed ? maxSpeed : speed;
    speed = speed < minSpeed ? minSpeed : speed;
    if (speed === maxSpeed) {
        var breakpoint = 1;
    }
    return speed;
}

function playGame(smooth) {
    seconds = allowed - milliseconds/1000;
    if (isMouseDown) {
        mp = getMousePos(canvas, curMouseEvent);
        x = mp.x;
        y = mp.y;
        xMouseMovement = 0;
        yMouseMovement = 0;
        var gridSize = 50;
        if (x > player.returnPos().x + gridSize / 2) {
            key.right = true;
        } else if (x < player.returnPos().x + gridSize / 2) {
            key.left = true;
        }
        if (y > player.returnPos().y + gridSize / 2) {
            key.down = true;
        } else if (y < player.returnPos().y + gridSize / 2){
            key.up = true;
        }
    }
    key = doubleCheckMoves(key)
    
    resetKeys(isMouseDown);
    pathway.addPlayer(player.returnPos())
    if (doRectsCollide(player.returnRect(), objective.returnRect())) {
        if (walls.length === (size*size-2)) {
            score += 2;
            levelUpNoScoreIncrement();
        } else {
            pathway.setPlayerToObjective();
            if (36 - pathway.getEmpties().length != walls.length + 1){
                pathway.getEmpties();
                var yeet = 1;
            }
            var newWall;
            if (level > 3) {
                newWall = new square({x: -50, y: -50, width: 50, height: 50, color: rainbowColors[Math.floor(Math.random() * (rainbowColors.length))]})
            } else {
                newWall = new square({x: -50, y: -50, width: 50, height: 50, color: wallColor})
            }
            var tempPos = pathway.addRandom('wall')
            newWall.place(tempPos)

            
            var options = pathway.getOptions(player.returnPos());
            var neighbors = [];
            for (var i = 0; i < options.length; i++) {
                neighbors.push(options[i].object);
            }
            //TODO: there is sometimes a glitch in score (e.g. giving 33pts/clear on mini instead of 32)
            while ((neighbors.indexOf("_") === -1 && neighbors.indexOf("O") === -1) || doRectsCollide(player.returnRect(), newWall.returnRect())) {
                if (walls.length === size * size - 4) {
                    score += 4;
                    levelUpNoScoreIncrement();
                    return;
                }
                pathway.removeWalls([tempPos]);
                tempPos = pathway.addRandom('wall');
                newWall.place(tempPos);
                options = pathway.getOptions(player.returnPos());
                neighbors = [];
                for (var i = 0; i < options.length; i++) {
                    neighbors.push(options[i].object);
                }
            }
            newWall.place(tempPos);
            walls.push(newWall);
            wallPos.push(newWall.returnPos());
            score += 1;  
            if (walls.length === (size*size-2)) {
                score += 2;
                levelUpNoScoreIncrement();
                return;
            }
            //TODO: unreachable locations has very rare bug where block isn't placed, causes infinite loop
            var wallsAddedInUnreachableLocations = pathway.addWallsInUnreachableLocations();
            for (var w = 0; w < wallsAddedInUnreachableLocations.length; w++) {
                var unreachableWall = null;
                if (level > 3) {
                    unreachableWall = new square({x: -50, y: -50, width: 50, height: 50, color: rainbowColors[Math.floor(Math.random() * (rainbowColors.length))]});
                } else {
                    unreachableWall = new square({x: -50, y: -50, width: 50, height: 50, color: wallColor});
                }
                unreachableWall.place(wallsAddedInUnreachableLocations[w]);
                walls.push(unreachableWall);
                wallPos.push(unreachableWall.returnPos());
                if (walls.length === (size*size-2)) {
                    score += 3;
                    levelUpNoScoreIncrement();
                    return;
                } else {
                    score += 1;
                }
            }
            

            if (walls.length > (size*size-2)) {
                levelUpNoScoreIncrement();
                return;
            }

            
            tempPos = pathway.addRandom('objective');
            objective.place(tempPos);
            resetClock();
        }
    }
    timeLabel = (Math.round(seconds * 10) / 10).toString();
    scoreLabel = score.toString();
}

function levelUpNoScoreIncrement() {
    level += 1;
    pathway.removeWalls(wallPos);
    walls = addWalls();
    if (lowestTime - 1.0 >= getMinTimeBasedOnSize(size)) {
        lowestTime -= 1.0
    } else {
        lowestTime = getMinTimeBasedOnSize(size);
    }
    tempPos = pathway.addRandom('objective');
    objective.place(tempPos);
    allowed = getMaxTimeBasedOnSize(size);
    seconds = allowed;
    resetClock();
}

function doubleCheckMoves(key) {
    var originalKey = Object.assign({}, key);
    var playerOriginalPos = Object.assign({}, player.returnRect());
    var numMovesUp = checkIndividualMovesUp(key);
    player.place(playerOriginalPos);
    var numMovesDown = checkIndividualMovesDown(key);

    player.place(playerOriginalPos);

    if (numMovesUp >= numMovesDown) {
        checkIndividualMovesUp(key);
    } else {
        checkIndividualMovesDown(key);
    }
    return originalKey;
}

function checkIndividualMovesUp(key) {
    var numMoves = 0;
    if (key.left === true) {
        if(checkMove("LEFT")) {
            numMoves+=1;
        }
    } else if (key.right === true) {
        if(checkMove("RIGHT")) {
            numMoves+=1;
        }
    }
    if (key.up === true) {
        if(checkMove("UP")) {
            numMoves+=1;
        }
    } else if (key.down === true) {
        if(checkMove("DOWN")) {
            numMoves+=1;
        }
    }
    return numMoves;
}

function checkIndividualMovesDown(key) {
    var numMoves = 0;
    if (key.down === true) {
        if(checkMove("DOWN")) {
            numMoves+=1;
        }
    } else if (key.up === true) {
        if(checkMove("UP")) {
            numMoves+=1;
        }
    }
    if (key.right === true) {
        if(checkMove("RIGHT")) {
            numMoves+=1;
        }
    }else if (key.left === true) {
        if(checkMove("LEFT")) {
            numMoves+=1;
        }
    }
    return numMoves;
}

function loseGame() {

    
}

function drawLoserEntry() {

    var loserLabel = "No high score."
    var escLabel = "Press 'esc' to restart";
    var loserRect = {x: 0, y: 0, width: 150, height: 100, color: "#ff0000"}; 
    drawRect(loserRect);
    ctx.fillStyle = "#000000";
    ctx.font = "12px Arial";
    ctx.fillText(loserLabel, 15, 15);
    ctx.fillText(escLabel, 15, 35);

}

function checkForHighScore(score, size) {
    validatedToken = submitState(pathway.graph.join(" "), score);
    cachedScores = getAllTimeScores();
    var scoresWeCareAbout;
    if (size == 6) {
        scoresWeCareAbout = cachedScores.mini
    } else if (size == 10) {
        scoresWeCareAbout = cachedScores.normal
    } else if (size == 14) {
        scoresWeCareAbout = cachedScores.massive
    }
    if (scoresWeCareAbout.length < 10) {
	highScoreDetermined = true;
        return true;
    }
    if (score > parseInt(scoresWeCareAbout[9].score)) {
        highScoreDetermined = true;
        return true;
    }
    highScoreDetermined = true;
    return false;

}

function submitState(st, sc) {
    var validationUrl="https://gczjty0d8g.execute-api.us-east-2.amazonaws.com/prod/validation";
    var dataToSubmit = {state: st, score: sc.toString()}
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "PUT", validationUrl, false ); // false for synchronous request
    xmlHttp.send(JSON.stringify(dataToSubmit));
    var resp = xmlHttp.responseText
    
    return resp;

}

function updateClock() {
    milliseconds += 100;
}

function setGame() {
    timerInterval = setInterval(updateClock, 100);
    level = 1;
    score = 0;
    lowestTime = getStartingMinTimeBasedOnSize(size);
    milliseconds = 0;
    allowed = getMaxTimeBasedOnSize(size);
    seconds = allowed;
    pathway = new map({width: size, height: size});
    player = new playerSquare(playerSymbol);
    pathway.addPlayer(player.returnPos());
    wallPos = [];
    walls = addWalls();
    pathway.addWalls(wallPos);
    objective = new square(objectiveSymbol);
    var tempPos = pathway.addRandom('objective');
    objective.place(tempPos);
    key = {left: false, right: false, up: false, down: false};
}
    
function addWalls() {
    walls = []
    wallPos = []
    walls.push(new square({x: -50, y: -50, width: 50, height: 50, color: wallColor}));
    walls.push(new square({x: -50, y: -50, width: 50, height: 50, color: wallColor}));
    walls.push(new square({x: -50, y: -50, width: 50, height: 50, color: wallColor}));
    walls.push(new square({x: -50, y: -50, width: 50, height: 50, color: wallColor}));
    walls[0].place({x: Math.round(size*50/2-50), y: Math.round(size*50/2-50)});
    walls[1].place({x: Math.round(size*50/2), y: Math.round(size*50/2-50)});
    walls[2].place({x: Math.round(size*50/2-50), y: Math.round(size*50/2)});
    walls[3].place({x: Math.round(size*50/2), y: Math.round(size*50/2)});
    wallPos.push({x: Math.round(size*50/2-50), y: Math.round(size*50/2-50)});
    wallPos.push({x: Math.round(size*50/2), y: Math.round(size*50/2-50)});
    wallPos.push({x: Math.round(size*50/2-50), y: Math.round(size*50/2)});
    wallPos.push({x: Math.round(size*50/2), y: Math.round(size*50/2)});
    pathway.addWalls(wallPos)
    return walls
}

function drawBackground() {
    drawRect({x:0, y:0, width: canvas.width, height: canvas.height, color: bgColor});
}

function drawAll() {
    if (playingGame) {

        if (!lost) {
            drawBackground();

            drawWalls();
            drawRect(player.returnRect());
            drawRect(objective.returnRect());
            for (var i = 0; i < walls.length; i++) {
                drawRect(walls[i].returnRect);
            }

            ctx.fillStyle = "#000000";
            ctx.font = "16px Arial";
            ctx.fillText(timeLabel, (canvas.width / 2) - 10, (canvas.height / 2) - 10);
            ctx.fillStyle = "#000000";
            ctx.font = "bold 16px Arial";
            ctx.fillText(scoreLabel, (canvas.width / 2) - 10, (canvas.height / 2) + 10);
        } else {
            if (highScoreAchieved) {
                drawHighScoreEntry();
            } else if (highScoreDetermined) {
                drawLoserEntry();
            } else {
                drawDeterminingHighScore();
            }
        }
    } else {
        if (!showingHighScores){
            drawMenu();
        } else {
            drawHighScores();
        }
    } 

}

function submitHighScore(sc, n, si, t) {
    var scoresUrl="https://gczjty0d8g.execute-api.us-east-2.amazonaws.com/prod/scores"
    var dataToSubmit = {score: sc.toString(), name: n, size: si.toString(), token: t}
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "PUT", scoresUrl, true ); // false for synchronous request
    xmlHttp.send(JSON.stringify(dataToSubmit));
}

function drawHighScoreEntry() {
    enteringHighScore = true;
    var winner = "HIGH SCORE!";
    var escLabel = "Press 'enter' to restart";
    var instLabel = "<-- for backspace"
    loserRect = {x: 0, y: 0, width: 150, height: 100, color: "#00ff00"}; 
    drawRect(loserRect);
    ctx.fillStyle = "#000000";
    ctx.font = "12px Arial";
    ctx.fillText(winner, 15, 15);
    ctx.fillText(escLabel, 15, 35);
    ctx.fillText(instLabel, 15, 55);
    ctx.fillText(highScoreName, 15, 75); 
}

function drawDeterminingHighScore() {
    var waitingLabel = "Checking for high score...";
    var escLabel = "Press 'esc' to restart now";
    determiningRect = {x: 0, y: 0, width: 150, height: 100, color: "#666666"}; 
    drawRect(determiningRect);
    ctx.fillStyle = "#000000";
    ctx.font = "12px Arial";
    ctx.fillText(waitingLabel, 15, 15);
    ctx.fillText(escLabel, 15, 35);

}

function drawWalls() {
    for (var i = 0; i < walls.length; i++) {
        var curRect = walls[i].returnRect();
        drawRect({x: curRect.x, y: curRect.y, width: curRect.width, height: curRect.height, color: curRect.color});
    }
}

function updateMenuAnimation() {
    var objectiveAchieved = doRectsCollide(playerMenuRect, objectiveMenuRect);
    if (objectiveAchieved) {
        switchMenuObjective();
        menuSpeed = -1 * menuSpeed;
    }
    var newPlayerPos = {x: playerMenu.returnPos().x + menuSpeed, y: playerMenu.returnPos().y};
    playerMenu.move(newPlayerPos);

}

function switchMenuObjective() {
    var newX;
    if (objectiveMenu.returnPos().x < 100) {
        newX = 400;
    } else {
        newX = 50;
    }
    var newObjectivePos = {x: newX, y: objectiveMenu.returnPos().y};
    objectiveMenu.place(newObjectivePos);
}

function drawMenu() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updateMenuAnimation(); 
    drawBackground();
    drawRect(playerMenuRect);
    drawRect(objectiveMenuRect);
    drawRect(sixButton);
    drawRect(tenButton);
    drawRect(fourteenButton);
    drawRect(jsSquare);
    drawRect(hsButton);
    ctx.font = "30px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(welcomeMessage, 160, 100);
    ctx.fillText(pureJsPureLabel, 185, 170);
    ctx.font = "16px Arial";
    ctx.fillStyle = "#000000";

    ctx.fillText("High Scores", 207, 455);

    ctx.fillText(sixLabel, 83, 255);
    ctx.fillText(tenLabel, 223, 255);
    ctx.fillText(fourteenLabel, 370, 255);
    //ctx.fillText(smoothLabel, 222, 455);
    ctx.font = "30px Arial";
    ctx.fillText(pureJsJsLabel, 275, 170);
}

function drawHighScores() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    var miniScores = cachedScores.mini;
    var normalScores = cachedScores.normal;
    var massiveScores = cachedScores.massive;
    console.log("M " + miniScores)
    drawScoresInColumn(miniScores, "MINI", 25);
    drawScoresInColumn(normalScores, "NORMAL", 195);
    drawScoresInColumn(massiveScores, "MASSIVE", 375);
}

function drawScoresInColumn(scores, topLabel, xPosition) {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(topLabel, xPosition, 20)
    for (var i = 0; i < scores.length && i < 10; i += 1) {
        ctx.fillText((i+1).toString() + ") " + scores[i].name + ": " + scores[i].score, xPosition, 20 * (i + 2));
    }
}

function getAllTimeScores() {
    var scoresUrl="https://gczjty0d8g.execute-api.us-east-2.amazonaws.com/prod/scores";
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", scoresUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    var resp = xmlHttp.responseText
    
    resp = resp.replace(/'/g, '"')
    console.log(resp);
    scoreResponse = JSON.parse(resp);
    var scores = {mini: [], normal: [], massive: []};
    for (var i = 0; i < scoreResponse.length; i++) {
        if (scoreResponse[i].size === "6") {
            scores.mini.push({score: scoreResponse[i].score, name: scoreResponse[i].name})
        } else if (scoreResponse[i].size === "10") {
            scores.normal.push({score: scoreResponse[i].score, name: scoreResponse[i].name})
        } else if (scoreResponse[i].size === "14") {
            scores.massive.push({score: scoreResponse[i].score, name: scoreResponse[i].name})
        }
    }
    scores.mini.sort((a, b) => (parseInt(a.score) < parseInt(b.score)) ? 1 : -1)
    scores.normal.sort((a, b) => (parseInt(a.score) < parseInt(b.score)) ? 1 : -1)
    scores.massive.sort((a, b) => (parseInt(a.score) < parseInt(b.score)) ? 1 : -1)
    return scores;
}

        
function resetClock() {
    var decrement = size / 6;
    if (allowed - decrement >= lowestTime) {
        allowed -= decrement;
    } else {
        allowed = lowestTime
    }
    seconds = allowed;
    milliseconds = 0;
}

function arePositionsEqual(posOne, posTwo) {
    if (posOne.x === posTwo.x 
        && posOne.y === posTwo.y) {
            return true;
        }
        return false;
}

function checkMove(direction) {
    var originalPos = player.returnPos();
    var newPos = {x: 0, y: 0};
    var curPos = player.returnPos();
    var moduloMoveX = curPos.x;
    var moduloMoveY = curPos.y;
    var gridSize = 50;
    newPos.x = curPos.x;
    newPos.y = curPos.y;
    var change = 50;
    if (playSmooth) {
        change = smoothBasePlayerSpeed;
        if (isMouseDown) {
            change = getMousePlayerSpeed();
        }
    }
    if (direction === "LEFT") {
        newPos.x = curPos.x - change;
        moduloMoveX = curPos.x - (curPos.x % gridSize);
    } else if (direction === "RIGHT") {
        newPos.x = curPos.x + change;
        moduloMoveX = curPos.x + (gridSize - curPos.x % gridSize);
    } else if (direction === "UP") {
        newPos.y = curPos.y - change;
        moduloMoveY = curPos.y - (curPos.y % gridSize);
    } else if (direction === "DOWN") {
        newPos.y = curPos.y + change;
        moduloMoveY = curPos.y + (gridSize - curPos.y % gridSize);
    }

    if (playSmooth) {
        var firstCheck = newPos;
        var secondCheck = {x: moduloMoveX, y: moduloMoveY};
        var modX = newPos.x % gridSize;
        var modY = newPos.y % gridSize;
        var modXDiff = Math.abs(moduloMoveX - curPos.x);
        var modYDiff = Math.abs(moduloMoveY - curPos.y);
        if (((modX < change || (gridSize - modX > -change)) || (modY < change || (gridSize - modY > -change))) 
        && modXDiff < change && modYDiff < change && (modXDiff !== 0 || modYDiff !== 0)) {
            firstCheck = {x: moduloMoveX, y: moduloMoveY}
            secondCheck = newPos;
        }
        var smoothMoveAttempt = checkBoundaryAndCollision(curPos, firstCheck);
        if (arePositionsEqual(originalPos, player.returnPos())) {
            checkBoundaryAndCollision(curPos, secondCheck);
        }
    } else if (!playSmooth) {
        if(pathway.getObject(newPos) !== 'X') {
            player.move(newPos);
            pathway.addPlayer(newPos);
        }
    }
    return !arePositionsEqual(originalPos, player.returnPos());
}

function checkBoundaryAndCollision(curPos, newPos) {
    if (newPos.x >= 0 && newPos.x <=size*50-50 && newPos.y >= 0 && newPos.y <=size*50-50) {
        var collided = false;
        player.move(newPos);
        for (var i = 0; i < walls.length; i++) {
            if (doRectsCollide(player.returnRect(), walls[i].returnRect())) {
                collided = true;
            }
        }
        if(collided) {
            player.move(curPos);
            return false;
        }
        return true;
    }
    return false;
}

gameLoop();
