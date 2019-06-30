

class map {     

    constructor(s) {
        this.objectivePos;
        this.playerPos;
        this.isPathwayBool;
        this.options;
        this.size;
        this.graph;
        this.empties;

        this.size = s
        this.graph = [];

        for (let i = 0; i < this.size.height; i++) {
            let newRow = [];
            for (let j = 0; j < this.size.width; j++) {
                newRow.push("_");
            }
            this.graph.push(newRow);
        }
        this.empties = this.getEmpties()
    }
    
    addPlayer(playerPos) {
        if (typeof this.playerPos === 'undefined') {
            this.playerPos = playerPos
            this.graph[Math.floor(this.playerPos.y/50)][Math.floor(this.playerPos.x/50)] = 'P'
        } else {
            this.graph[Math.floor(this.playerPos.y/50)][Math.floor(this.playerPos.x/50)] = '_'
            this.playerPos = playerPos
            this.graph[Math.floor(this.playerPos.y/50)][Math.floor(this.playerPos.x/50)] = 'P'
        }
    }
        
    addObjective(objectivePos) {
        if (typeof this.objectivePos === 'undefined') {
            this.objectivePos = objectivePos
            this.graph[Math.floor(this.objectivePos.y/50)][Math.floor(this.objectivePos.x/50)] = 'O'
        } else {
            this.graph[Math.floor(this.objectivePos.y/50)][Math.floor(this.objectivePos.x/50)] = '_'
            this.objectivePos = objectivePos
            this.graph[Math.floor(this.objectivePos.y/50)][Math.floor(this.objectivePos.x/50)] = 'O'
        }
    }
     
       
    addWalls(walls) {
        for (let i = 0; i < walls.length; i++) {
            this.graph[Math.floor(walls[i].y/50)][Math.floor(walls[i].x/50)] = 'X'
        }
    }
       
    addWall(wallPos) {
        this.graph[Math.floor(wallPos.y/50)][Math.floor(wallPos.x/50)] = 'X'
    }

    addRandom(objectType) {
        this.empties = this.getEmpties()
        console.log("got empties " + objectType);
        let spot = Math.floor(Math.random() * (this.empties.length))
        let position = this.empties[spot]
        console.log(position);
        if(objectType === "objective"){
            console.log("adding objective");
            this.addObjective(position)
            while(!this.isPathway(position)) {
                spot = Math.floor(Math.random() * (this.empties.length))
                position = this.empties[spot]
            }
            this.addObjective(position)
        } else {
            console.log("adding wall");
            this.addWall(position)
        }
        console.log("returning from addRandom");
        return position
    }

    removeWalls(wallPos) {
        for (let i = 0; i < wallPos.length; i ++) {
            this.graph[Math.floor(wallPos[i].y/50)][Math.floor(wallPos[i].x/50)] = '_'
        }
    }
    
    removeObjective(self) {
        this.graph[Math.floor(this.objectivePos.y/50)][Math.floor(this.objectivePos.x/50)] = '_'
    }
        
    removePeriods(self) {
        for(let i = 0; i < this.size.height; i++) {
            for(let j = 0; j < this.size.width; j++) {
                if (this.graph[i][j] === '.') {
                    this.graph[i][j] = '_'
                }
            }
        }
    }

    inBounds(position) {
        let x = position.x/50
        let y = position.y/50
        let xVal = (x>=0 && x<this.size.width)
        let yVal = (y>=0 && y<this.size.height)
        console.log(`x is ${x} and y is ${y}`)
        return (xVal && yVal)
    }

    checkMove(key) {
        let newPos = {x: 0, y: 0}
        let nextSquare = {x: 0, y: 0}
        let curPos = this.playerPos
        newPos.x = curPos.x
        newPos.y = curPos.y
        nextSquare.x = newPos.x
        nextSquare.y = newPos.y
        let onGrid = false
        if (key.left) {
            newPos.x = curPos.x - 5
            newPos.y = curPos.y
            nextSquare.x = newPos.x - (50-(newPos.x%50))
            nextSquare.y = newPos.y
            if (newPos.y % 50 === 0){
                onGrid = true
            }
        } 
        if (key.right) {
            newPos.x = curPos.x + 5
            newPos.y = curPos.y
            nextSquare.x = newPos.x + (50-(newPos.x%50))
            nextSquare.y = newPos.y
            if (newPos.y%50 === 0) {
                onGrid = true
            }
        }
        if (key.up) {
            newPos.x = curPos.x
            newPos.y = curPos.y - 5
            nextSquare.x = newPos.x
            nextSquare.y = newPos.y - (50-(newPos.y%50))
            if (newPos.x%50 === 0){
                onGrid = true
            }
        }
        if (key.down) {
            newPos.x = curPos.x
            newPos.y = curPos.y + 5
            nextSquare.x = newPos.x
            nextSquare.y = newPos.y + (50-(newPos.y%50))
            if(newPos.x%50 === 0) {
                onGrid = true
            }
        }
        if( onGrid && !(this.getObject(nextSquare) === 'X')){
            this.addPlayer(newPos)
            return newPos
        }
        return {x: -1, y: -1};
    }
    
    isPathway(oPos) {
        this.options = []; 
        let originalObj = this.objectivePos
        let originalPlayer = this.playerPos
        this.graph[Math.floor(this.playerPos.y/50)][Math.floor(this.playerPos.x/50)] = '_'
        this.addObjective(oPos)
        let tempOptions = this.getOptions(this.playerPos)
        this.options = [];
        this.isPathwayBool = false;

        for (let i = 0; i < tempOptions.length; i++) {
            if (this.isPathwayBool === true) {
                break;
            }
            if (!(tempOptions[i].object === 'X') && !(tempOptions[i].object === '.') && !(tempOptions[i].object === 'O')) {
                this.graph[Math.floor(tempOptions[i].y/50)][Math.floor(tempOptions[i].x/50)] = '.'
                this.makeFakeMove(tempOptions[i])
                if (this.isPathwayBool === true) {
                    break;
                }
                this.options.push(tempOptions[i])
            } else if (tempOptions[i].object === 'O'){
                this.isPathwayBool = true;
                break
            }
        }
        this.removePeriods()
        this.addPlayer(originalPlayer)
        this.addObjective(originalObj)
        return this.isPathwayBool;
    }
    
    makeFakeMove(newPos) {
        let tempOptions = this.getOptions(newPos)
        for (let i = 0; i < tempOptions.length; i++) {
            if(this.isPathwayBool === true) {
                break
            }
            if (!(tempOptions[i].object === 'X') && !(tempOptions[i].object === '.') && !(tempOptions[i].object === 'O')) {
                this.graph[Math.floor(tempOptions[i].y/50)][Math.floor(tempOptions[i].x/50)] = '.'
                this.makeFakeMove(tempOptions[i])
                if(this.isPathwayBool === true){
                    break
                }
                this.options.push(tempOptions[i])
            }else if (tempOptions[i].object === 'O'){
                this.isPathwayBool = true;
                break
            }
        }
    }

    getOptions(curPos) {
        this.options = []
        this.options.push({object: this.getObject({x: curPos.x-50, y: curPos.y}), x: curPos.x-50, y: curPos.y})
        this.options.push({object: this.getObject({x: curPos.x+50, y: curPos.y}), x: curPos.x+50, y: curPos.y})
        this.options.push({object: this.getObject({x: curPos.x, y: curPos.y-50}), x: curPos.x, y: curPos.y-50})
        this.options.push({object: this.getObject({x: curPos.x, y: curPos.y+50}), x: curPos.x, y: curPos.y+50})
        return this.options
    }
          
    getEmpties(self) {
        let empties = []
        for (let i = 0; i < this.size.height; i++){
            for (let j = 0; j < this.size.width; j++) {
                if (this.graph[i][j] === '_'){
                    empties.push({x: j*50, y: i*50})
                }
            }
        }
        return empties
    }

    getObject(position) {
        if (this.inBounds(position)){
            return this.graph[Math.floor(position.y/50)][Math.floor(position.x/50)]
        } else {
            return 'X' 
        }
    }
}        