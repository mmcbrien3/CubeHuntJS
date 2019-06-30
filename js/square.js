class square {
    constructor(r){
        this.rect = r;
    }
    
    place(position) {
        this.rect.x = position.x;
        this.rect.y = position.y; 
    }
    
    returnPos() {
        return {x: this.rect.x, y: this.rect.y};
    }
    
    returnColor() {
        return this.rect.color;
    }
    
    returnRect() {
        return this.rect;
    }
}


class playerSquare extends square {

    constructor(r) {
        super(r);  
    }
    
    move(position) {
        this.rect.x = position.x;
        this.rect.y = position.y;
    }
}