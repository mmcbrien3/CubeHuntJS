var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");


canvas.addEventListener("click", handleMenuClicks, false);
document.addEventListener("keydown", handleGameKeysDown, false);
document.addEventListener("keyup", handleGameKeysUp, false);

var size = 10;
var key = {left: false, right: false, up: false, down: false};
var playingGame = false
var playSmooth = false

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


var welcomeMessage = "CUBE HUNT";
var sixLabel = "Mini";
var tenLabel = "Normal";
var fourteenLabel = "Massive";
var smoothLabel = "Smooth";
var timeLabel = "0.0";
var scoreLabel = "0";

function gameLoop() {
    if (playingGame) {
        if (seconds > 0) {
            lost = true
            playGame(playSmooth)
        } else {
            loseGame()
        }
    } else {
        menuScreen()
    }
    requestAnimationFrame(gameLoop);
}

function drawRect(rect) {
    ctx.beginPath();
    ctx.rect(rect.x, rect.y, rect.width, rect.height);
    ctx.fillStyle = rect.color;
    ctx.fill();
}
                
function menuScreen() {
    drawMenu()
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
    return {
        x: (evt.clientX - rect.left) / (rect.right - rect.left) * c.width,
        y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * c.height
    };
}

function handleMenuClicks(event) {
    if (playingGame) {
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

function handleGameKeysDown(e) {
    if((e.key == "Right" || e.key == "ArrowRight" || e.key == "d") && (playSmooth || key.right === false)) {
        key.right = true;
        if (!playSmooth) {
            return;
        }
    }
    else if((e.key == "Left" || e.key == "ArrowLeft" || e.key == "a") && (playSmooth || key.left === false)) {
        key.left = true;
        if (!playSmooth) {
            return;
        }
    }
    else if((e.key == "Up" || e.key == "ArrowUp" || e.key == "w") && (playSmooth || key.up === false)) {
        key.up = true;
        if (!playSmooth) {
            return;
        }
    }
    else if((e.key == "Down" || e.key == "ArrowDown" || e.key == "s") && (playSmooth || key.down === false)) {
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
    else if(e.key == "Left" || e.key == "ArrowLeft" || e.key == "a") {
        key.left = false;
    }
    else if(e.key == "Up" || e.key == "ArrowUp" || e.key == "w") {
        key.up = false;
    }
    else if(e.key == "Down" || e.key == "ArrowDown" || e.key == "s") {
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
    if(playSmooth) { return; }
    key.right = false;
    key.left = false;
    key.up = false;
    key.down = false;
}

function playGame(smooth){
    if (smooth) {
        seconds = allowed - milliseconds/1000
        if (objective.returnPos() === {x: -50, y: -50} || doRectsCollide(player.returnRect(), objective.returnRect())) {
            tempPos = pathway.addRandom('objective')
            if (doRectsCollide(player.returnRect(), objective.returnRect())) {
                pathway.removeObjective()
                objective.place({x: -50, y: -50})
            } else {
                objective.place(tempPos)
            }
        }
        checkMove(key)
        resetKeys();
        console.log(key)
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
                milliseconds = 0
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
                while (neighbors.indexOf("_") === -1 && neighbors.indexOf("O") === -1) {
                    pathway.removeWalls([tempPos])
                    tempPos = pathway.addRandom('wall')
                    newWall.place(tempPos)
                    options = pathway.getOptions(player.returnPos())
                    neighbors = []
                    for (let i = 0; i < options.length; i++) {
                        neighbors.push(options[i].object)
                    }
                }
                if (doRectsCollide(player.returnRect(), newWall.returnRect())) {
                    pathway.removeWalls([tempPos])
                    tempPos = {x: -50, y: -50}
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
        checkMove(key)
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
                milliseconds = 0
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
                let options = pathway.getOptions(player.returnPos())
                let neighbors = []
                for (let i = 0; i < options.length; i ++) {
                    neighbors.push(options[i].object);
                }
                while (neighbors.indexOf("_") === -1 && neighbors.indexOf("O") === -1) {
                    pathway.removeWalls([tempPos])
                    tempPos = pathway.addRandom('wall')
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
    drawAll()
}

function loseGame(self) {
    if (lost) {
        lost = false 
    }
}

function updateClock() {
    milliseconds += 100;
}

function setGame() {
    setInterval(updateClock, 100);
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
    drawAll()
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
    drawBackground();
    drawWalls();
    drawRect(player.returnRect());
    drawRect(objective.returnRect());
    for (let i = 0; i < walls.length; i++) {
        drawRect(walls[i].returnRect);
    }

    ctx.fillStyle = "#000000";
    ctx.font = "16px Arial";
    ctx.fillText(scoreLabel, (canvas.width / 2) - 10, (canvas.height / 2));
    ctx.fillText(timeLabel, (canvas.width / 2) - 10, (canvas.height / 2) - 10);

}

function drawWalls() {
    for (let i = 0; i < walls.length; i++) {
        let curRect = walls[i].returnRect();
        drawRect({x: curRect.x, y: curRect.y, width: curRect.width, height: curRect.height, color: wallColor})
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
    if (allowed > lowestTime) {
        allowed -= .5
    }
    seconds = allowed
    milliseconds = 0
}

function checkMove(direction) {
    let newPos = {x: 0, y: 0}
    let curPos = player.returnPos()
    newPos.x = curPos.x
    newPos.y = curPos.y
    let change = 50
    if (playSmooth) {
        change = 5
    }
    if (direction.left === true) {
        newPos.x = curPos.x - change
        newPos.y = curPos.y
    } 
    if (direction.right === true) {
        newPos.x = curPos.x + change
        newPos.y = curPos.y
    } 
    if (direction.up === true) {
        newPos.x = curPos.x
        newPos.y = curPos.y - change
    } 
    if (direction.down === true) {
        newPos.x = curPos.x
        newPos.y = curPos.y + change
    }
    if (playSmooth) {
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
            }
        }
    } else {
        if(pathway.getObject(newPos) !== 'X') {
            player.move(newPos)
            pathway.addPlayer(newPos)
        }
    }
}

gameLoop()