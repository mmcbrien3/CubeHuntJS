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

var playerSymbol = {x: 50, y: 75, width: 100, height: 100, color: "#FFFFFF"};
var objectiveSymbol = {x: 350, y: 75, width: 100, height: 100, color: "#FF0000"};

var level = 1
var score = 0
var lowestTime = size/2
var milliseconds = 0
var allowed = size
var seconds = allowed
//var pathway = new map({width: size, height: size})
var player = new playerSquare(playerSymbol)
var wallPos = []
var walls = addWalls()
//pathway.addWalls(wallPos)
var objective = new square(objectiveSymbol)


var welcomeMessage = "CUBE HUNT";
var sixLabel = "Mini";
var tenLabel = "Normal";
var fourteenLabel = "Massive";
var smoothLabel = "Smooth";

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
    console.log(rect);
    if (x >= rect.x && x <= rect.x + rect.width) {
        console.log(" x match")
        if (y >= rect.y && y < rect.y + rect.height) {
            console.log("match")
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
    mp = getMousePos(canvas, event);
    x =  mp.x
    y = mp.y
    console.log({x1: x, y1: y})
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
    if(e.key == "Right" || e.key == "ArrowRight") {
        key.right = true;
        if (smooth) {
            return;
        }
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        key.left = true;
        if (smooth) {
            return;
        }
    }
    else if(e.key == "Up" || e.key == "ArrowUp") {
        key.up = true;
        if (smooth) {
            return;
        }
    }
    else if(e.key == "Down" || e.key == "ArrowDown") {
        key.down = true;
        if (smooth) {
            return;
        }
    }
}

function handleGameKeysUp(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        key.right = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        key.left = false;
    }
    else if(e.key == "Up" || e.key == "ArrowUp") {
        key.up = false;
    }
    else if(e.key == "Down" || e.key == "ArrowDown") {
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

function playGame(smooth){
    if (smooth) {
        seconds = allowed - milliseconds/1000
        if (objective.returnPos() === {x: -50, y: -50} || doRectsCollide(player.returnRect(), objective.returnRect())) {
            tempPos = pathway.addRandom('objective')
            if (doRectsCollide(player.returnRect(), objective.returnRect())) {
                pathway.removeObjective()
                objective.place({x: -50, y: -50}, ctx)
            } else {
                objective.place(tempPos, ctx)
            }
        }
        checkMove(key)
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
                objective.place(tempPos, ctx)
                allowed = size
                seconds = allowed
                milliseconds = 0
                resetClock()
            } else {
                score+=1
                var newWall;
                if (level > 3) {
                    newWall = new square({x: -50, y: -50, width: 50, height: 50, color: rainbowColors[Math.floor(Math.random() * (rainbowColors) - 1)]})
                } else {
                    newWall = new square({x: -50, y: -50, width: 50, height: 50, color: wallColor})
                }
                let tempPos = pathway.addRandom('wall')
                newWall.place(tempPos, ctx)
                let options = pathway.getOptions(player.returnPos())
                let neighbors = []
                for (let i = 0; i < options.length; i++) {
                    neighbors.push(options[i][0])
                }
                while (neighbors.indexOf("_") === -1 && neighbors.indexOf("O") === -1) {
                    pathway.removeWalls(tempPos)
                    tempPos = pathway.addRandom('wall')
                    newWall.place(tempPos, ctx)
                    options = pathway.getOptions(player.returnPos())
                    neighbors = []
                    for (let i = 0; i < options.length; i++) {
                        neighbors.push(options[i][0])
                    }
                }
                if (doRectsCollide(player.returnRect(), newWall.returnRect())) {
                    pathway.removeWalls(tempPos)
                    newWall.place({x: -50, y: -50}, ctx)
                }
                walls.push(newWall)
                wallPos.push(newWall.returnPos())
                objective.place({x: -50, y: -50}, ctx)
                pathway.removeObjective()
                resetClock()
            }
        }
    } else {
        seconds = allowed - milliseconds/1000
        checkMove(key)
        if (player.returnPos() == objective.returnPos()) {
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
                objective.place(tempPos, ctx)
                allowed = size
                seconds = allowed
                milliseconds = 0
                resetClock()
            }
        } else {
            score+=1
            let newWall;
            if (level > 3) {
                newWall = new square({x: -50, y: -50, width: 50, height: 50, color: rainbowColors[Math.floor(Math.random() * (rainbowColors) - 1)]})
            } else {
                newWall = new square({x: -50, y: -50, width: 50, height: 50, color: wallColor})
            }
            let tempPos = pathway.addRandom('wall')
            newWall.place(tempPos, ctx)
            let options = pathway.getOptions(player.returnPos())
            let neighbors = []
            for (let i = 0; i < options.length; i ++) {
                neighbors.push(options[i][0])
            }
            while (neighbors.indexOf("_") === -1 && neighbors.indexOf("O") === -1) {
                pathway.removeWalls(tempPos)
                tempPos = pathway.addRandom('wall')
                newWall.place(tempPos, ctx)
                options = pathway.getOptions(player.returnPos())
                neighbors = []
                for (let i = 0; i < options.length; i ++) {
                    neighbors.push(options[i][0])
                }
            }
            walls.push(newWall)
            wallPos.push(newWall.returnPos())
            tempPos = pathway.addRandom('objective')
            while (!pathway.isPathway(tempPos)) {
                tempPos = pathway.addRandom('objective')
            }
            objective.place(tempPos, ctx)
            resetClock()
        }
    }
    //label = myfont.render('%.1f' %seconds, 1, (0, 0,0))
    //scoreLabel = myfont2.render(str(score),1,(25,75,0))
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
    objective.place(tempPos, ctx)
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
    walls[0].place({x: Math.round(size*50/2-50), y: Math.round(size*50/2-50)}, ctx)
    walls[1].place({x: Math.round(size*50/2), y: Math.round(size*50/2-50)}, ctx)
    walls[2].place({x: Math.round(size*50/2-50), y: Math.round(size*50/2)}, ctx)
    walls[3].place({x: Math.round(size*50/2), y: Math.round(size*50/2)}, ctx)
    wallPos.push({x: Math.round(size*50/2-50), y: Math.round(size*50/2-50)})
    wallPos.push({x: Math.round(size*50/2), y: Math.round(size*50/2-50)})
    wallPos.push({x: Math.round(size*50/2-50), y: Math.round(size*50/2)})
    wallPos.push({x: Math.round(size*50/2), y: Math.round(size*50/2)})
    //pathway.addWalls(wallPos)
    return walls
}

function drawBackground() {
    drawRect({x:0, y:0, width: canvas.width, height: canvas.height, color: bgColor})
}

function drawAll() {
    drawBackground();
    drawRect(playerSquare.returnRect);
    drawRect(objective.returnRect);
    for (let i = 0; i < walls.length; i++) {
        drawRect(walls[i].returnRect);
    }
    //screen.blit(label, [int(size*50/2-50)+25,int(size*50/2-50)+30])
    //screen.blit(scoreLabel,[int(size*50/2-50)+70,int(size*50/2-50)+80])

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
    let newPos = [0,0]
    let curPos = player.returnPos()
    newPos[0] = curPos[0]
    newPos[1] = curPos[1]
    let change = 50
    if (playSmooth) {
        change = 5
    }
    if (direction.left) {
        newPos[0] = curPos[0] - change
        newPos[1] = curPos[1]
    } else if (direction.right) {
        newPos[0] = curPos[0] + change
        newPos[1] = curPos[1]
    } else if (direction.up) {
        newPos[0] = curPos[0]
        newPos[1] = curPos[1] - change
    } else if (direction.down) {
        newPos[0] = curPos[0]
        newPos[1] = curPos[1] + change
    }
    if (playSmooth) {
        if (newPos[0] >= 0 && newPos[0] <=size*50-50 && newPos[1] >= 0 && newPos[1] <=size*50-50) {
            let collided = false
            player.move(newPos)
            for (let i = 0; i < walls.length; i++) {
                if (player.returnRect().colliderect(walls[i].returnRect())) {
                    collided = true
                }
            }
            if(collided) {
                player.move(curPos)
            }
        }
    } else {
        if(!(pathway.getObject(newPos) === 'X')) {
            player.move(newPos)
            pathway.addPlayer(newPos)
        }
    }
}

gameLoop()