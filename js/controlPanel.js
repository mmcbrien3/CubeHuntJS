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
var playingGame = false
var playSmooth = true

var wallColor = "#C69354"
var bgColor = "#00254C"
var menuColor = wallColor
var rainbowColors = ["#F49AC2","#AEC6CF","#77BE77","#CFCFC4","#FDFD96","#826953"]

var sixButton = {x: 50, y: 225, width: 100, height: 50, color: "#C69354"};
var tenButton = {x: 200, y: 225, width: 100, height: 50, color: "#C69354"};
var fourteenButton = {x: 350, y: 225, width: 100, height: 50, color: "#C69354"};
var smoothButton = {x: 200, y: 425, width: 100, height: 50, color: "#00FF00"};

var playerSymbol = {x: 50, y: 50, width: 50, height: 50, color: "#FFFFFF"};
var objectiveSymbol = {x: 350, y: 50, width: 50, height: 50, color: "#FF0000"};

function resetGame() {
    level = 1
    score = 0
    lowestTime = size/2
    milliseconds = 0
    allowed = size
    seconds = allowed
    pathway = new map({width: size, height: size})
    player = new playerSquare(playerSymbol)
    wallPos = []
    walls = addWalls()
    pathway.addWalls(wallPos)
    objective = new square(objectiveSymbol)

    xMouseMovement = 0;
    yMouseMovement = 0;
    isMouseDown = 0;
    curMouseEvent = null;
    resetScreen();
    resetClock();
    clearInterval(timerInterval);
}

var timerInterval;
var level = 1

var score = 0
var lowestTime = size/2
var milliseconds = 0
var allowed = size
var seconds = allowed
var pathway = new map({width: size, height: size})
var player = new playerSquare(playerSymbol)
var wallPos = []
var walls = addWalls()
pathway.addWalls(wallPos)
var objective = new square(objectiveSymbol)

let xMouseMovement = 0;
let yMouseMovement = 0;
let isMouseDown = 0;
let curMouseEvent = null;

var welcomeMessage = "CUBE HUNT";
var sixLabel = "Mini";
var tenLabel = "Normal";
var fourteenLabel = "Massive";
var smoothLabel = "Smooth";
var timeLabel = "0.0";
var scoreLabel = "0";
var smoothBasePlayerSpeed = 5;

setInterval(gameLoop, 10);

function gameLoop() {
    if (playingGame) {
        if (seconds > 0) {
            lost = true
            playGame(playSmooth)
        } else {
            loseGame()
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
    x =  mp.x
    y = mp.y
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
    else if (checkClickInRect(x, y, smoothButton)) {
        playSmooth = !playSmooth;
    }
}

function resetScreen() {
    canvas.width = 500;
    canvas.height = 500;
}

function handleGameKeysDown(e) {
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
    let xDist = Math.pow(mousePos.x - playerPos.x, 2);
    let yDist = Math.pow(mousePos.y - playerPos.y, 2);
    return Math.sqrt(xDist + yDist);
}

function getMaxDistanceBySize() {
    return Math.sqrt(Math.pow(canvas.width, 2) + Math.pow(canvas.height, 2));
}

function getMousePlayerSpeed() {
    let distance = getDistTweenMouseAndPlayer(getMousePos(canvas, curMouseEvent), player.returnPos());
    let minSpeed = 3;
    let maxSpeed = 7;
    let maxDistance = getMaxDistanceBySize();
    let multiplier = 3.1415;
    let speed = smoothBasePlayerSpeed * multiplier * (distance / maxDistance);
    speed = speed > maxSpeed ? maxSpeed : speed;
    speed = speed < minSpeed ? minSpeed : speed;
    if (speed === maxSpeed) {
        var breakpoint = 1;
    }
    return speed;
}

function playGame(smooth) {
    if (smooth) {
        seconds = allowed - milliseconds/1000
        if (isMouseDown) {
            mp = getMousePos(canvas, curMouseEvent)
            x = mp.x;
            y = mp.y
            xMouseMovement = 0;
            yMouseMovement = 0;
            let gridSize = 50;
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
                level += 1
                pathway.removeWalls(wallPos)
                walls = addWalls()
                score+=50
                if (lowestTime > size/2-2) {
                    lowestTime -= 1
                }
                tempPos = pathway.addRandom('objective')
                objective.place(tempPos)
                allowed = size
                seconds = allowed
                resetClock()
            } else {
                score+=1
                var newWall;
                if (level > 3) {
                    newWall = new square({x: -50, y: -50, width: 50, height: 50, color: rainbowColors[Math.floor(Math.random() * (rainbowColors.length))]})
                } else {
                    newWall = new square({x: -50, y: -50, width: 50, height: 50, color: wallColor})
                }
                let tempPos = pathway.addRandom('wall')
                newWall.place(tempPos)
                let options = pathway.getOptions(player.returnPos())
                let neighbors = []
                for (let i = 0; i < options.length; i++) {
                    neighbors.push(options[i].object)
                }
                while ((neighbors.indexOf("_") === -1 && neighbors.indexOf("O") === -1) || doRectsCollide(player.returnRect(), newWall.returnRect())) {
                    if (walls.length === size * size - 4) {
                        score += 2;
                        walls.push(new square({x: -50, y: -50, width: 50, height: 50, color: wallColor}));
                        walls.push(new square({x: -50, y: -50, width: 50, height: 50, color: wallColor}));
                        return;
                    }
                    pathway.removeWalls([tempPos])
                    tempPos = pathway.addRandom('wall')
                    newWall.place(tempPos)
                    options = pathway.getOptions(player.returnPos())
                    neighbors = []
                    for (let i = 0; i < options.length; i++) {
                        neighbors.push(options[i].object)
                    }
                }
                newWall.place(tempPos);
                walls.push(newWall)
                wallPos.push(newWall.returnPos())
                tempPos = pathway.addRandom('objective');
                objective.place(tempPos); 
                resetClock()
            }
        }
    } else {
        seconds = allowed - milliseconds/1000
        if (key.left === true) {
            checkMove("LEFT");
        }
        else if (key.right === true) {
            checkMove("RIGHT");
        }
        else if (key.up === true) {
            checkMove("UP");
        }
        else if (key.down === true) {
            checkMove("DOWN");
        }
        resetKeys();
        if (doRectsCollide(player.returnRect(), objective.returnRect())) {
            if (walls.length === (size*size-2)) {
                level += 1
                pathway.removeWalls(wallPos)
                walls = addWalls()
                pathway.addWalls(wallPos)
                score+=50
                if (lowestTime > size/2-2) {
                    lowestTime -= 1
                }
                let tempPos = pathway.addRandom('objective')
                while (!pathway.isPathway(tempPos)) {
                    tempPos = pathway.addRandom('objective')
                }
                objective.place(tempPos)
                allowed = size
                seconds = allowed
                resetClock()
            } else {
                score+=1
                let newWall;
                if (level > 3) {
                    newWall = new square({x: -50, y: -50, width: 50, height: 50, color: rainbowColors[Math.floor(Math.random() * (rainbowColors.length))]})
                } else {
                    newWall = new square({x: -50, y: -50, width: 50, height: 50, color: wallColor})
                }
                let tempPos = pathway.addRandom('wall')
                newWall.place(tempPos)
                let options = pathway.getOptions(player.returnPos())
                let neighbors = []
                for (let i = 0; i < options.length; i ++) {
                    neighbors.push(options[i].object);
                }
                while ((neighbors.indexOf("_") === -1 && neighbors.indexOf("O") === -1)  || doRectsCollide(player.returnRect(), newWall.returnRect())) {
                    pathway.removeWalls([tempPos])
                    tempPos = pathway.addRandom('wall')
                    newWall.place(tempPos)
                    options = pathway.getOptions(player.returnPos())
                    neighbors = []
                    for (let i = 0; i < options.length; i ++) {
                        neighbors.push(options[i].object)
                    }
                }
                newWall.place(tempPos);
                walls.push(newWall)
                wallPos.push(newWall.returnPos())
                tempPos = pathway.addRandom('objective')
                objective.place(tempPos)
                resetClock()
            }
        }
    }
    timeLabel = (Math.round(seconds * 10) / 10).toString();
    scoreLabel = score.toString();
}

function doubleCheckMoves(key) {
    let originalKey = Object.assign({}, key);
    let playerOriginalPos = Object.assign({}, player.returnRect());
    let numMovesUp = checkIndividualMovesUp(key)
    player.place(playerOriginalPos);
    let numMovesDown = checkIndividualMovesDown(key)

    player.place(playerOriginalPos);

    if (numMovesUp >= numMovesDown) {
        checkIndividualMovesUp(key);
    } else {
        checkIndividualMovesDown(key);
    }
    return originalKey;
}

function checkIndividualMovesUp(key) {
    let numMoves = 0;
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
    let numMoves = 0;
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

function loseGame(self) {
    if (lost) {
        lost = false 
        playinGame = false;
    }
}

function updateClock() {
    milliseconds += 100;
}

function setGame() {
    timerInterval = setInterval(updateClock, 100);
    level = 1
    score = 0
    lowestTime = size/2
    milliseconds = 0
    allowed = size
    seconds = allowed
    pathway = new map({width: size, height: size})
    player = new playerSquare(playerSymbol)
    pathway.addPlayer(player.returnPos())
    wallPos = []
    walls = addWalls()
    pathway.addWalls(wallPos)
    objective = new square(objectiveSymbol)
    let tempPos = pathway.addRandom('objective')
    objective.place(tempPos)
    key = {left: false, right: false, up: false, down: false};
}
    
function addWalls() {
    walls = []
    wallPos = []
    walls.push(new square({x: -50, y: -50, width: 50, height: 50, color: wallColor}));
    walls.push(new square({x: -50, y: -50, width: 50, height: 50, color: wallColor}));
    walls.push(new square({x: -50, y: -50, width: 50, height: 50, color: wallColor}));
    walls.push(new square({x: -50, y: -50, width: 50, height: 50, color: wallColor}));
    walls[0].place({x: Math.round(size*50/2-50), y: Math.round(size*50/2-50)})
    walls[1].place({x: Math.round(size*50/2), y: Math.round(size*50/2-50)})
    walls[2].place({x: Math.round(size*50/2-50), y: Math.round(size*50/2)})
    walls[3].place({x: Math.round(size*50/2), y: Math.round(size*50/2)})
    wallPos.push({x: Math.round(size*50/2-50), y: Math.round(size*50/2-50)})
    wallPos.push({x: Math.round(size*50/2), y: Math.round(size*50/2-50)})
    wallPos.push({x: Math.round(size*50/2-50), y: Math.round(size*50/2)})
    wallPos.push({x: Math.round(size*50/2), y: Math.round(size*50/2)})
    pathway.addWalls(wallPos)
    return walls
}

function drawBackground() {
    drawRect({x:0, y:0, width: canvas.width, height: canvas.height, color: bgColor})
}

function drawAll() {
    if (playingGame) {
        drawBackground();
        drawWalls();
        drawRect(player.returnRect());
        drawRect(objective.returnRect());
        for (let i = 0; i < walls.length; i++) {
            drawRect(walls[i].returnRect);
        }

        ctx.fillStyle = "#000000";
        ctx.font = "16px Arial";
        ctx.fillText(timeLabel, (canvas.width / 2) - 10, (canvas.height / 2) - 10);
        ctx.fillStyle = "#000000";
        ctx.font = "bold 16px Arial";
        ctx.fillText(scoreLabel, (canvas.width / 2) - 10, (canvas.height / 2) + 10);
    } else {
        drawMenu()
    }
    
    

}

function drawWalls() {
    for (let i = 0; i < walls.length; i++) {
        let curRect = walls[i].returnRect();
        drawRect({x: curRect.x, y: curRect.y, width: curRect.width, height: curRect.height, color: curRect.color})
    }
}

function drawMenu() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawBackground()
    drawRect(sixButton)
    drawRect(tenButton)
    drawRect(fourteenButton)
    if (playSmooth) {
        smoothButton.color = "#00ff00"
        drawRect(smoothButton)
    } else {
        smoothButton.color = "#ff0000"
        drawRect(smoothButton)
    }
    ctx.font = "30px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(welcomeMessage, 160, 100); 

    ctx.font = "16px Arial";
    ctx.fillStyle = "#000000";
    ctx.fillText(sixLabel, 83, 255); 
    ctx.fillText(tenLabel, 223, 255); 
    ctx.fillText(fourteenLabel, 370, 255); 
    ctx.fillText(smoothLabel, 222, 455); 
            
}

        
function resetClock() {
    milliseconds = 0;
    if (allowed > lowestTime) {
        allowed -= .5
    }
    seconds = allowed
    milliseconds = 0
}

function arePositionsEqual(posOne, posTwo) {
    if (posOne.x === posTwo.x 
        && posOne.y === posTwo.y) {
            return true;
        }
        return false;
}

function checkMove(direction) {
    let originalPos = player.returnPos();
    let newPos = {x: 0, y: 0}
    let curPos = player.returnPos()
    let moduloMoveX = curPos.x;
    let moduloMoveY = curPos.y
    let gridSize = 50;
    newPos.x = curPos.x
    newPos.y = curPos.y
    let change = 50
    if (playSmooth) {
        change = smoothBasePlayerSpeed;
        if (isMouseDown) {
            change = getMousePlayerSpeed();
        }
    }
    if (direction === "LEFT") {
        newPos.x = curPos.x - change
        moduloMoveX = curPos.x - (curPos.x % gridSize);
    } else if (direction === "RIGHT") {
        newPos.x = curPos.x + change
        moduloMoveX = curPos.x + (gridSize - curPos.x % gridSize);
    } else if (direction === "UP") {
        newPos.y = curPos.y - change
        moduloMoveY = curPos.y - (curPos.y % gridSize);
    } else if (direction === "DOWN") {
        newPos.y = curPos.y + change
        moduloMoveY = curPos.y + (gridSize - curPos.y % gridSize);
    }

    if (playSmooth) {
        let firstCheck = newPos;
        let secondCheck = {x: moduloMoveX, y: moduloMoveY}
        let modX = newPos.x % gridSize
        let modY = newPos.y % gridSize
        let modXDiff = Math.abs(moduloMoveX - curPos.x);
        let modYDiff = Math.abs(moduloMoveY - curPos.y);
        if (((modX < change || (gridSize - modX > -change)) || (modY < change || (gridSize - modY > -change))) 
        && modXDiff < change && modYDiff < change && (modXDiff !== 0 || modYDiff !== 0)) {
            firstCheck = {x: moduloMoveX, y: moduloMoveY}
            secondCheck = newPos;
        }
        let smoothMoveAttempt = checkBoundaryAndCollision(curPos, firstCheck);
        if (arePositionsEqual(originalPos, player.returnPos())) {
            checkBoundaryAndCollision(curPos, secondCheck);
        }
    } else if (!playSmooth) {
        if(pathway.getObject(newPos) !== 'X') {
            player.move(newPos)
            pathway.addPlayer(newPos)
        }
    }
    return !arePositionsEqual(originalPos, player.returnPos())
}

function checkBoundaryAndCollision(curPos, newPos) {
    if (newPos.x >= 0 && newPos.x <=size*50-50 && newPos.y >= 0 && newPos.y <=size*50-50) {
        let collided = false
        player.move(newPos)
        for (let i = 0; i < walls.length; i++) {
            if (doRectsCollide(player.returnRect(), walls[i].returnRect())) {
                collided = true
            }
        }
        if(collided) {
            player.move(curPos)
            return false;
        }
        return true;
    }
    return false;
}

gameLoop()