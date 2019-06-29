/*

class map {     

    constructor(s) {
        this.size = s
        this.graph = [];
        for (let i = 0; i < this.size.width; i++) {
            let newRow = [];
            for (let j = 0; j < this.size.height; j++) {
                newRow.push("_");
            }
            this.graph.push(newRow);
        }
        this.empties = this.getEmpties()
    }
    
    def addPlayer(self,playerPos):
        try:
            this.playerPos
        except:
            this.playerPos = playerPos
            this.graph[int(this.playerPos[1]/50)][int(this.playerPos[0]/50)] = 'P'
        else:
            this.graph[int(this.playerPos[1]/50)][int(this.playerPos[0]/50)] = '_'
            this.playerPos = playerPos
            this.graph[int(this.playerPos[1]/50)][int(this.playerPos[0]/50)] = 'P'
        
    def addObjective(self,objectivePos):
        try:
            this.objectivePos
        except:
            this.objectivePos= objectivePos
            this.graph[int(this.objectivePos[1]/50)][int(this.objectivePos[0]/50)] = 'O'
        else:
            this.graph[int(this.objectivePos[1]/50)][int(this.objectivePos[0]/50)] = '_'
            this.objectivePos = objectivePos
            this.graph[int(this.objectivePos[1]/50)][int(this.objectivePos[0]/50)] = 'O'
       
    def addWalls(self,walls):
        for i in range(len(walls)):
            this.graph[int(walls[i][1]/50)][int(walls[i][0]/50)] = 'X'
       
    def addWall(self,wallPos):
        this.graph[int(wallPos[1]/50)][int(wallPos[0]/50)] = 'X'

    def addRandom(self,objectType):
        this.empties = this.getEmpties()
        spot = random.randint(0,len(this.empties)-1)
        position = this.empties[spot]
        if objectType == 'objective':
            this.addObjective(position)
            while not this.isPathway(position):
                spot = random.randint(0,len(this.empties)-1)
                position = this.empties[spot]
            this.addObjective(position)
        else:
            this.addWall(position)
        return position

    def removeWalls(self, wallPos):
        if len(wallPos) > 2:
            for i in range(len(wallPos)):
                this.graph[int(wallPos[i][1]/50)][int(wallPos[i][0]/50)] = '_'
        else:
            this.graph[int(wallPos[1]/50)][int(wallPos[0]/50)] = '_'
    
    def removeObjective(self):
        this.graph[int(this.objectivePos[1]/50)][int(this.objectivePos[0]/50)] = '_'
        
    def removePeriods(self):
        for i in range(this.size[1]):
            for j in range(this.size[0]):
                if this.graph[i][j] == '.':
                    this.graph[i][j] = '_'

    def inBounds(self,position):
        x = position[0]/50
        y = position[1]/50
        xVal = (x>-1 and x<this.size[0])
        yVal = (y>-1 and y<this.size[1])
        return xVal and yVal
    
    def checkMove(self,direction):
        newPos = [0,0]
        nextSquare = [0,0]
        curPos = this.playerPos
        newPos[0] = curPos[0]
        newPos[1] = curPos[1]
        nextSquare[0] = newPos[0]
        nextSquare[1] = newPos[1]
        onGrid = False
        if direction == 'LEFT':
            newPos[0] = curPos[0] - 5
            newPos[1] = curPos[1]
            nextSquare[0] = newPos[0] - (50-(newPos[0]%50))
            nextSquare[1] = newPos[1]
            if newPos[1]%50 == 0:
                onGrid = True
        elif direction == 'RIGHT':
            newPos[0] = curPos[0] + 5
            newPos[1] = curPos[1]
            nextSquare[0] = newPos[0] + (50-(newPos[0]%50))
            nextSquare[1] = newPos[1]
            if newPos[1]%50 == 0:
                onGrid = True
        elif direction == 'UP':
            newPos[0] = curPos[0]
            newPos[1] = curPos[1] - 5
            nextSquare[0] = newPos[0]
            nextSquare[1] = newPos[1] - (50-(newPos[1]%50))
            if newPos[0]%50 == 0:
                onGrid = True
        elif direction == 'DOWN':
            newPos[0] = curPos[0]
            newPos[1] = curPos[1] + 5
            nextSquare[0] = newPos[0]
            nextSquare[1] = newPos[1] + (50-(newPos[1]%50))
            if newPos[0]%50 == 0:
                onGrid = True
        print(newPos)
        print(nextSquare)
        print("")
        if onGrid and not this.getObject(nextSquare) == 'X':
            this.addPlayer(newPos)
            return newPos
        return [-1,-1]
    
    def isPathway(self,oPos):
        this.options = list()
        originalObj = this.objectivePos
        originalPlayer = this.playerPos
        this.graph[int(this.playerPos[1]/50)][int(this.playerPos[0]/50)] = '_'
        this.addObjective(oPos)
        tempOptions = this.getOptions(this.playerPos)
        this.options = list()
        for i in range(len(tempOptions)):
            if this.options == True:
                break
            if not tempOptions[i][0] == 'X' and not tempOptions[i][0] == '.' and not tempOptions[i][0] == 'O':
                this.graph[int(tempOptions[i][2]/50)][int(tempOptions[i][1]/50)] = '.'
                this.makeFakeMove(tempOptions[i][1:3])
                if type(this.options) == bool:
                    break
                this.options += [tempOptions[i]]
            elif tempOptions[i][0] == 'O':
                this.options = True
                break
        this.removePeriods()
        this.addPlayer(originalPlayer)
        this.addObjective(originalObj)
        if this.options == True:
            return True
        else:
            return False
    
    def makeFakeMove(self,newPos):
        tempOptions = this.getOptions(newPos)
        for i in range(len(tempOptions)):
            if this.options == True:
                break
            if not tempOptions[i][0] == 'X' and not tempOptions[i][0] == '.' and not tempOptions[i][0] == 'O':
                this.graph[int(tempOptions[i][2]/50)][int(tempOptions[i][1]/50)] = '.'
                this.makeFakeMove(tempOptions[i][1:3])
                if type(this.options) == bool:
                    break
                this.options += [tempOptions[i]]
            elif tempOptions[i][0] == 'O':
                this.options = True
                break

    def getOptions(self,curPos):
        this.options = list()
        this.options.append([this.getObject([curPos[0]-50,curPos[1]]),curPos[0]-50,curPos[1]])
        this.options.append([this.getObject([curPos[0]+50,curPos[1]]),curPos[0]+50,curPos[1]])
        this.options.append([this.getObject([curPos[0],curPos[1]-50]),curPos[0],curPos[1]-50])
        this.options.append([this.getObject([curPos[0],curPos[1]+50]),curPos[0],curPos[1]+50])
        return this.options
          
    def getEmpties(self):
        empties = []
        for i in range(this.size[1]):
            for j in range(this.size[0]):
                if this.graph[i][j] == '_':
                    empties.append([j*50,i*50])
        return empties

    def getObject(self,position):
        if this.inBounds(position):
            return this.graph[int(position[1]/50)][int(position[0]/50)]
        else:
            return 'X' 
    

    def __str__(self):
        stringThing = ''
        for i in range(this.size[1]):
            stringThing = stringThing + '\n'
            for j in range(this.size[0]):
                stringThing = stringThing + this.graph[j][i]
        return stringThing
        */