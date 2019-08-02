

class map {     

    constructor(s) {
        this.objectivePos;
        this.playerPos;
        this.isPathwayBool;
        this.options;
        this.size;
        this.graph;
        this.empties;

        this.size = s;
        this.graph = [];

        for (var i = 0; i < this.size.height; i++) {
            var newRow = [];
            for (var j = 0; j < this.size.width; j++) {
                newRow.push("_");
            }
            this.graph.push(newRow);
        }
        this.empties = this.getEmpties()
    }
    
    addPlayer(playerPos) {
        if (typeof this.playerPos === 'undefined') {
            this.playerPos = playerPos;
            this.graph[Math.floor(this.playerPos.y/50)][Math.floor(this.playerPos.x/50)] = 'P';
        } else {
            this.graph[Math.floor(this.playerPos.y/50)][Math.floor(this.playerPos.x/50)] = '_';
            this.playerPos = playerPos
            this.graph[Math.floor(this.playerPos.y/50)][Math.floor(this.playerPos.x/50)] = 'P';
        }
    }
        
    addObjective(objectivePos) {
        if (typeof this.objectivePos === 'undefined') {
            this.objectivePos = objectivePos;
            this.graph[Math.floor(this.objectivePos.y/50)][Math.floor(this.objectivePos.x/50)] = 'O';
        } else {
            this.graph[Math.floor(this.objectivePos.y/50)][Math.floor(this.objectivePos.x/50)] = '_';
            this.objectivePos = objectivePos;
            this.graph[Math.floor(this.objectivePos.y/50)][Math.floor(this.objectivePos.x/50)] = 'O';
        }
    }
     
    addWalls(walls) {
        for (var i = 0; i < walls.length; i++) {
            this.graph[Math.floor(walls[i].y/50)][Math.floor(walls[i].x/50)] = 'X';
        }
    }
       
    addWall(wallPos) {
        this.graph[Math.floor(wallPos.y/50)][Math.floor(wallPos.x/50)] = 'X';
    }

    addWallsInUnreachableLocations() {
        this.removeObjective();
        var wallsAdded = [];
        this.empties = this.getEmpties();
        for (var i = 0; i < this.empties.length; i++) {
            this.addObjective(this.empties[i]);
            var isReachable = this.isPathway(this.empties[i]);
            if (!isReachable) {
                this.addWall(this.empties[i]);
                wallsAdded.push(this.empties[i]);
            }
        }
	this.removeObjective();
	for (var i = 0; i < wallsAdded.length; i++) {
	    this.addWall(wallsAdded[i]);
	}
        return wallsAdded;
    }

    addRandom(objectType) {
        this.removeObjective();
        this.empties = this.getEmpties();
        var spot = Math.floor(Math.random() * (this.empties.length));
        var position = this.empties[spot];
        if(objectType === "objective") {
            this.addObjective(position);
            var retries = 0;
            while(!this.isPathway(position)) {
                this.removeObjective();
                this.empties = this.getEmpties();
                retries += 1;
                spot = Math.floor(Math.random() * (this.empties.length));
                position = this.empties[spot];
                this.addObjective(position);
            }
            
        } else {
            this.addWall(position);
        }
        return position;
    }

    removeWalls(wallPos) {
        for (var i = 0; i < wallPos.length; i ++) {
            this.graph[Math.floor(wallPos[i].y/50)][Math.floor(wallPos[i].x/50)] = '_';
        }
    }
    
    removeObjective() {
        if (typeof this.objectivePos === 'undefined'){
            return;
        }
        this.graph[Math.floor(this.objectivePos.y/50)][Math.floor(this.objectivePos.x/50)] = '_';
        //this.objectivePos = undefined;
    }
        
    removePeriods() {
        for(var i = 0; i < this.size.height; i++) {
            for(var j = 0; j < this.size.width; j++) {
                if (this.graph[i][j] === '.') {
                    this.graph[i][j] = '_';
                }
            }
        }
    }

    setPlayerToObjective() {
        var oPos = this.findItem("O");
        if (oPos.x === -1) {
            return;
        }
        var pPos = this.findItem("P");
        this.graph[pPos.y][pPos.x] = "_";
        this.graph[oPos.y][oPos.x] = "P";

    }

    findItem(item) {
        for(var i = 0; i < this.size.height; i++) {
            for(var j = 0; j < this.size.width; j++) {
                if (this.graph[i][j] === item) {
                    return {x: j, y: i};
                }
            }
        }
        return {x: -1, y: -1};
    }

    inBounds(position) {
        var x = position.x/50;
        var y = position.y/50;
        var xVal = (x>=0 && x<this.size.width);
        var yVal = (y>=0 && y<this.size.height);
        return (xVal && yVal);
    }

    checkMove(key) {
        var newPos = {x: 0, y: 0};
        var nextSquare = {x: 0, y: 0};
        var curPos = this.playerPos;
        newPos.x = curPos.x;
        newPos.y = curPos.y;
        nextSquare.x = newPos.x;
        nextSquare.y = newPos.y;
        var onGrid = false;
        if (key.left) {
            newPos.x = curPos.x - 5;
            newPos.y = curPos.y;
            nextSquare.x = newPos.x - (50-(newPos.x%50));
            nextSquare.y = newPos.y;
            if (newPos.y % 50 === 0){
                onGrid = true;
            }
        } 
        if (key.right) {
            newPos.x = curPos.x + 5;
            newPos.y = curPos.y;
            nextSquare.x = newPos.x + (50-(newPos.x%50));
            nextSquare.y = newPos.y;
            if (newPos.y%50 === 0) {
                onGrid = true;
            }
        }
        if (key.up) {
            newPos.x = curPos.x;
            newPos.y = curPos.y - 5;
            nextSquare.x = newPos.x;
            nextSquare.y = newPos.y - (50-(newPos.y%50));
            if (newPos.x%50 === 0) {
                onGrid = true;
            }
        }
        if (key.down) {
            newPos.x = curPos.x;
            newPos.y = curPos.y + 5;
            nextSquare.x = newPos.x;
            nextSquare.y = newPos.y + (50-(newPos.y%50));
            if(newPos.x%50 === 0) {
                onGrid = true;
            }
        }
        if( onGrid && !(this.getObject(nextSquare) === 'X')){
            this.addPlayer(newPos);
            return newPos;
        }
        return {x: -1, y: -1};
    }
    
    isPathway(oPos) {
        this.options = [];
        var originalObj = this.objectivePos;
        var originalPlayer = this.playerPos;
        this.graph[Math.floor(this.playerPos.y/50)][Math.floor(this.playerPos.x/50)] = '_';
        this.removeObjective();
        this.addObjective(oPos);
        var tempOptions = this.getOptions(this.playerPos);
        this.options = [];
        this.isPathwayBool = false;

        for (var i = 0; i < tempOptions.length; i++) {
            if (this.isPathwayBool === true) {
                break;
            }
            if (!(tempOptions[i].object === 'X') && !(tempOptions[i].object === '.') && !(tempOptions[i].object === 'O')) {
                this.graph[Math.floor(tempOptions[i].y/50)][Math.floor(tempOptions[i].x/50)] = '.';
                this.makeFakeMove(tempOptions[i]);
                if (this.isPathwayBool === true) {
                    break;
                }
                this.options.push(tempOptions[i]);
            } else if (tempOptions[i].object === 'O'){
                this.isPathwayBool = true;
                break;
            }
        }
        this.removePeriods();
        this.addPlayer(originalPlayer);
        this.removeObjective();
        this.addObjective(originalObj);
        return this.isPathwayBool;
    }
    
    makeFakeMove(newPos) {
        var tempOptions = this.getOptions(newPos);
        for (var i = 0; i < tempOptions.length; i++) {
            if(this.isPathwayBool === true) {
                break;
            }
            if (!(tempOptions[i].object === 'X') && !(tempOptions[i].object === '.') && !(tempOptions[i].object === 'O')) {
                this.graph[Math.floor(tempOptions[i].y/50)][Math.floor(tempOptions[i].x/50)] = '.';
                this.makeFakeMove(tempOptions[i]);
                if(this.isPathwayBool === true){
                    break;
                }
                this.options.push(tempOptions[i]);
            }else if (tempOptions[i].object === 'O'){
                this.isPathwayBool = true;
                break;
            }
        }
    }

    getOptions(curPos) {
        curPos.x = Math.floor(curPos.x / 50) * 50;
        curPos.y = Math.floor(curPos.y / 50) * 50;
        this.options = [];
        this.options.push({object: this.getObject({x: curPos.x-50, y: curPos.y}), x: curPos.x-50, y: curPos.y});
        this.options.push({object: this.getObject({x: curPos.x+50, y: curPos.y}), x: curPos.x+50, y: curPos.y});
        this.options.push({object: this.getObject({x: curPos.x, y: curPos.y-50}), x: curPos.x, y: curPos.y-50});
        this.options.push({object: this.getObject({x: curPos.x, y: curPos.y+50}), x: curPos.x, y: curPos.y+50});
        return this.options;
    }
          
    getEmpties(self) {
        var empties = [];
        for (var i = 0; i < this.size.height; i++){
            for (var j = 0; j < this.size.width; j++) {
                if (this.graph[i][j] === '_'){
                    empties.push({x: j*50, y: i*50});
                }
            }
        }
        return empties;
    }

    getObject(position) {
        if (this.inBounds(position)){
            return this.graph[Math.floor(position.y/50)][Math.floor(position.x/50)];
        } else {
            return 'X';
        }
    }
}        
